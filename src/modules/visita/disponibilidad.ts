import { getPrisma } from "@/modules/nucleo/db";
import { ErrorVisita } from "./errores";
import { armarFranjasDelDia, esFechaISO, seSolapan } from "./tiempo";

const ESTADOS_INACTIVOS = ["cancelada", "vencida", "no_asistio"] as const;

export type FranjaDisponible = {
  iniciaEn: string;
  terminaEn: string;
};

export async function listarFranjasDisponibles(
  unidadId: string,
  fechaISO: string,
) {
  if (!esFechaISO(fechaISO)) {
    throw new ErrorVisita("fecha_invalida", "La fecha debe ser YYYY-MM-DD.", 400);
  }

  const prisma = getPrisma();
  const unidad = await prisma.unidad.findUnique({
    where: { id: unidadId },
    include: { edificio: true },
  });

  if (!unidad) {
    throw new ErrorVisita("unidad_no_encontrada", "La unidad no existe.", 404);
  }

  const candidatas = armarFranjasDelDia({
    fechaISO,
    ventanaInicio: unidad.edificio.ventanaInicio,
    ventanaFin: unidad.edificio.ventanaFin,
    duracionMinutos: unidad.edificio.duracionVisitaMinutos,
    intervaloMinutos: unidad.edificio.intervaloMinimoMinutos,
  });

  if (candidatas.length === 0) {
    return {
      fecha: fechaISO,
      intervaloMinutos: unidad.edificio.intervaloMinimoMinutos,
      duracionMinutos: unidad.edificio.duracionVisitaMinutos,
      franjas: [] as FranjaDisponible[],
    };
  }

  const ocupadas = await prisma.reservaVisita.findMany({
    where: {
      unidadId,
      estado: { notIn: [...ESTADOS_INACTIVOS] },
      iniciaEn: { lt: candidatas[candidatas.length - 1].terminaEn },
      terminaEn: { gt: candidatas[0].iniciaEn },
    },
    select: { iniciaEn: true, terminaEn: true },
  });

  const franjas = candidatas
    .filter(
      (franja) =>
        !ocupadas.some((ocupada) =>
          seSolapan(franja, {
            iniciaEn: ocupada.iniciaEn,
            terminaEn: ocupada.terminaEn,
          }),
        ),
    )
    .map((franja) => ({
      iniciaEn: franja.iniciaEn.toISOString(),
      terminaEn: franja.terminaEn.toISOString(),
    }));

  return {
    fecha: fechaISO,
    intervaloMinutos: unidad.edificio.intervaloMinimoMinutos,
    duracionMinutos: unidad.edificio.duracionVisitaMinutos,
    franjas,
  };
}
