import { getPrisma } from "./db";

export type UnidadListado = {
  id: string;
  referencia: string;
  estado: string;
  tipoOperacion: string;
  tipoAcceso: string;
  moneda: string;
  precioPublicado: string | null;
  planta: string | null;
  puerta: string | null;
  tipologia: string | null;
  superficieM2: string | null;
  edificioNombre: string;
  propietarios: string[];
};

export async function listarUnidades(): Promise<UnidadListado[]> {
  const unidades = await getPrisma().unidad.findMany({
    orderBy: [{ referencia: "asc" }],
    include: {
      edificio: { select: { nombre: true } },
      titulares: {
        include: {
          propietario: { select: { nombre: true, apellidos: true } },
        },
      },
    },
  });

  return unidades.map((unidad) => ({
    id: unidad.id,
    referencia: unidad.referencia,
    estado: unidad.estado,
    tipoOperacion: unidad.tipoOperacion,
    tipoAcceso: unidad.tipoAcceso,
    moneda: unidad.moneda,
    precioPublicado: unidad.precioPublicado?.toString() ?? null,
    planta: unidad.planta,
    puerta: unidad.puerta,
    tipologia: unidad.tipologia,
    superficieM2: unidad.superficieM2?.toString() ?? null,
    edificioNombre: unidad.edificio.nombre,
    propietarios: unidad.titulares.map(
      (titular) =>
        `${titular.propietario.nombre} ${titular.propietario.apellidos}`,
    ),
  }));
}
