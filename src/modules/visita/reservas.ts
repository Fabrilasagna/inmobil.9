import { getCajaLlaves } from "@/integrations/caja-llaves";
import { getMensajeria } from "@/integrations/mensajeria";
import { getPrisma } from "@/modules/nucleo/db";
import { ErrorVisita } from "./errores";
import { registrarEventoReserva } from "./eventos";
import {
  armarFranjasDelDia,
  esFechaISO,
  fechaHoyLima,
  seSolapan,
} from "./tiempo";

const ESTADOS_INACTIVOS = ["cancelada", "vencida", "no_asistio"] as const;
const ESTADOS_ACTIVOS = ["solicitada", "confirmada"] as const;
const NIVELES_HABILITADOS = ["nivel_1", "nivel_2"] as const;

const includePublica = {
  unidad: { select: { referencia: true, edificio: true } },
  comprador: { select: { nombre: true, apellidos: true } },
} as const;

export type ReservaPublica = {
  id: string;
  unidadId: string;
  unidadReferencia: string;
  compradorId: string;
  compradorNombre: string;
  estado: string;
  iniciaEn: string;
  terminaEn: string;
  porteriaNotificadaEn: string | null;
  porteriaConfirmadaEn: string | null;
};

function aPublica(reserva: {
  id: string;
  unidadId: string;
  compradorId: string;
  estado: string;
  iniciaEn: Date;
  terminaEn: Date;
  porteriaNotificadaEn: Date | null;
  porteriaConfirmadaEn: Date | null;
  unidad: { referencia: string };
  comprador: { nombre: string; apellidos: string };
}): ReservaPublica {
  return {
    id: reserva.id,
    unidadId: reserva.unidadId,
    unidadReferencia: reserva.unidad.referencia,
    compradorId: reserva.compradorId,
    compradorNombre: `${reserva.comprador.nombre} ${reserva.comprador.apellidos}`,
    estado: reserva.estado,
    iniciaEn: reserva.iniciaEn.toISOString(),
    terminaEn: reserva.terminaEn.toISOString(),
    porteriaNotificadaEn: reserva.porteriaNotificadaEn?.toISOString() ?? null,
    porteriaConfirmadaEn: reserva.porteriaConfirmadaEn?.toISOString() ?? null,
  };
}

async function cargarPublica(reservaId: string): Promise<ReservaPublica> {
  const reserva = await getPrisma().reservaVisita.findUniqueOrThrow({
    where: { id: reservaId },
    include: includePublica,
  });
  return aPublica(reserva);
}

export async function crearReserva(input: {
  unidadId: string;
  compradorId: string;
  iniciaEn: string;
}): Promise<ReservaPublica> {
  const iniciaEn = new Date(input.iniciaEn);
  if (Number.isNaN(iniciaEn.getTime())) {
    throw new ErrorVisita("franja_invalida", "iniciaEn no es una fecha válida.", 400);
  }
  if (iniciaEn.getTime() <= Date.now()) {
    throw new ErrorVisita(
      "franja_pasada",
      "No se puede reservar una franja que ya empezó.",
      400,
    );
  }

  const prisma = getPrisma();
  const creada = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`
      SELECT id FROM unidades WHERE id = ${input.unidadId} FOR UPDATE
    `;

    const unidad = await tx.unidad.findUnique({
      where: { id: input.unidadId },
      include: { edificio: true },
    });
    if (!unidad) {
      throw new ErrorVisita("unidad_no_encontrada", "La unidad no existe.", 404);
    }
    if (unidad.estado !== "publicada") {
      throw new ErrorVisita(
        "unidad_no_publicada",
        "Solo se reservan unidades publicadas.",
        409,
      );
    }

    const comprador = await tx.comprador.findUnique({
      where: { id: input.compradorId },
    });
    if (!comprador) {
      throw new ErrorVisita("comprador_no_encontrado", "El comprador no existe.", 404);
    }
    if (comprador.nivelAcreditacion === "suspendido") {
      throw new ErrorVisita(
        "comprador_suspendido",
        "El comprador está suspendido.",
        409,
      );
    }
    if (
      !NIVELES_HABILITADOS.includes(
        comprador.nivelAcreditacion as (typeof NIVELES_HABILITADOS)[number],
      )
    ) {
      throw new ErrorVisita(
        "comprador_no_acreditado",
        "El comprador debe estar acreditado (nivel 1 o 2).",
        409,
      );
    }

    const fechaISO = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(iniciaEn);

    const grilla = armarFranjasDelDia({
      fechaISO,
      ventanaInicio: unidad.edificio.ventanaInicio,
      ventanaFin: unidad.edificio.ventanaFin,
      duracionMinutos: unidad.edificio.duracionVisitaMinutos,
      intervaloMinutos: unidad.edificio.intervaloMinimoMinutos,
    });
    const franja = grilla.find((item) => item.iniciaEn.getTime() === iniciaEn.getTime());
    if (!franja) {
      throw new ErrorVisita(
        "franja_fuera_de_grilla",
        "La franja no está en la grilla disponible del edificio.",
        400,
      );
    }

    const activaMismaUnidad = await tx.reservaVisita.findFirst({
      where: {
        unidadId: unidad.id,
        compradorId: comprador.id,
        estado: { in: [...ESTADOS_ACTIVOS] },
      },
    });
    if (activaMismaUnidad) {
      throw new ErrorVisita(
        "reserva_activa",
        "El comprador ya tiene una reserva activa en esta unidad.",
        409,
      );
    }

    const ocupadas = await tx.reservaVisita.findMany({
      where: {
        unidadId: unidad.id,
        estado: { notIn: [...ESTADOS_INACTIVOS] },
        iniciaEn: { lt: franja.terminaEn },
        terminaEn: { gt: franja.iniciaEn },
      },
    });
    if (
      ocupadas.some((ocupada) =>
        seSolapan(franja, {
          iniciaEn: ocupada.iniciaEn,
          terminaEn: ocupada.terminaEn,
        }),
      )
    ) {
      throw new ErrorVisita("solape", "Esa franja ya está reservada.", 409);
    }

    const acceso = await getCajaLlaves().generarCodigo({
      unidadId: unidad.id,
      identificadorCaja: unidad.identificadorCaja,
      iniciaEn: franja.iniciaEn,
      terminaEn: franja.terminaEn,
    });

    const reserva = await tx.reservaVisita.create({
      data: {
        unidadId: unidad.id,
        compradorId: comprador.id,
        estado: "solicitada",
        iniciaEn: franja.iniciaEn,
        terminaEn: franja.terminaEn,
        codigoAcceso: acceso.codigo,
        codigoAccesoExpiraEn: acceso.expiraEn,
      },
      include: includePublica,
    });

    await registrarEventoReserva(tx, {
      reservaVisitaId: reserva.id,
      tipo: "creacion",
      payload: {
        unidadId: unidad.id,
        compradorId: comprador.id,
        iniciaEn: franja.iniciaEn.toISOString(),
      },
    });

    return reserva;
  });

  try {
    await getMensajeria().notificarPorteria({
      destino: creada.unidad.edificio.porteriaContacto,
      canal: creada.unidad.edificio.porteriaCanal,
      unidadReferencia: creada.unidad.referencia,
      compradorNombre: `${creada.comprador.nombre} ${creada.comprador.apellidos}`,
      iniciaEn: creada.iniciaEn,
      terminaEn: creada.terminaEn,
    });
    await prisma.reservaVisita.update({
      where: { id: creada.id },
      data: { porteriaNotificadaEn: new Date() },
    });
    await registrarEventoReserva(prisma, {
      reservaVisitaId: creada.id,
      tipo: "notificacion_porteria",
    });
  } catch (error) {
    console.error("[visita] fallo notificacion porteria", error);
  }

  return cargarPublica(creada.id);
}

export async function confirmarPorteria(reservaId: string): Promise<ReservaPublica> {
  const prisma = getPrisma();
  const reserva = await prisma.reservaVisita.findUnique({
    where: { id: reservaId },
  });
  if (!reserva) {
    throw new ErrorVisita("reserva_no_encontrada", "La reserva no existe.", 404);
  }
  if (reserva.estado !== "solicitada") {
    throw new ErrorVisita(
      "estado_invalido",
      "Solo se confirma una reserva solicitada.",
      409,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.reservaVisita.update({
      where: { id: reservaId },
      data: {
        estado: "confirmada",
        porteriaConfirmadaEn: new Date(),
      },
    });
    await registrarEventoReserva(tx, {
      reservaVisitaId: reservaId,
      tipo: "confirmacion_porteria",
    });
  });

  return cargarPublica(reservaId);
}

export async function cancelarReserva(input: {
  reservaId: string;
  compradorId: string;
}): Promise<ReservaPublica> {
  const prisma = getPrisma();
  const reserva = await prisma.reservaVisita.findUnique({
    where: { id: input.reservaId },
  });
  if (!reserva) {
    throw new ErrorVisita("reserva_no_encontrada", "La reserva no existe.", 404);
  }
  if (reserva.compradorId !== input.compradorId) {
    throw new ErrorVisita(
      "comprador_distinto",
      "Solo el comprador de la reserva puede cancelarla.",
      409,
    );
  }
  if (reserva.estado !== "solicitada" && reserva.estado !== "confirmada") {
    throw new ErrorVisita(
      "estado_invalido",
      "La reserva no se puede cancelar en su estado actual.",
      409,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.reservaVisita.update({
      where: { id: reserva.id },
      data: {
        estado: "cancelada",
        canceladaEn: new Date(),
      },
    });
    await registrarEventoReserva(tx, {
      reservaVisitaId: reserva.id,
      tipo: "cancelacion",
      payload: { compradorId: input.compradorId },
    });
  });

  if (reserva.codigoAcceso) {
    await getCajaLlaves().invalidarCodigo({ codigo: reserva.codigoAcceso });
  }

  return cargarPublica(reserva.id);
}

export async function listarReservasDelDia(fechaISO?: string): Promise<ReservaPublica[]> {
  const fecha = fechaISO ?? fechaHoyLima();
  if (!esFechaISO(fecha)) {
    throw new ErrorVisita("fecha_invalida", "La fecha debe ser YYYY-MM-DD.", 400);
  }

  const inicio = new Date(`${fecha}T00:00:00.000-05:00`);
  const fin = new Date(`${fecha}T23:59:59.999-05:00`);

  const reservas = await getPrisma().reservaVisita.findMany({
    where: {
      iniciaEn: { gte: inicio, lte: fin },
    },
    orderBy: { iniciaEn: "asc" },
    include: includePublica,
  });

  return reservas.map(aPublica);
}
