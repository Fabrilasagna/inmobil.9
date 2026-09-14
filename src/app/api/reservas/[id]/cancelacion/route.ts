import { NextResponse } from "next/server";
import { cancelarReserva } from "@/modules/visita";
import { respuestaErrorVisita } from "@/modules/visita/http";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: RouteContext<"/api/reservas/[id]/cancelacion">,
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { compradorId?: string };
    if (!body.compradorId) {
      return NextResponse.json(
        { error: "compradorId es obligatorio.", codigo: "payload_invalido" },
        { status: 400 },
      );
    }
    const reserva = await cancelarReserva({
      reservaId: id,
      compradorId: body.compradorId,
    });
    return NextResponse.json(reserva);
  } catch (error) {
    return respuestaErrorVisita(error);
  }
}
