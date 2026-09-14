import { NextResponse } from "next/server";
import { listarFranjasDisponibles } from "@/modules/visita";
import { respuestaErrorVisita } from "@/modules/visita/http";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: RouteContext<"/api/unidades/[unidadId]/disponibilidad">,
) {
  try {
    const { unidadId } = await context.params;
    const fecha = new URL(request.url).searchParams.get("fecha");
    if (!fecha) {
      return NextResponse.json(
        { error: "Falta el query fecha (YYYY-MM-DD).", codigo: "fecha_invalida" },
        { status: 400 },
      );
    }
    const disponibilidad = await listarFranjasDisponibles(unidadId, fecha);
    return NextResponse.json(disponibilidad);
  } catch (error) {
    return respuestaErrorVisita(error);
  }
}
