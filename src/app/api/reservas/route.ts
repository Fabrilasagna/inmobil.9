import { NextResponse } from "next/server";
import { crearReserva, listarReservasDelDia } from "@/modules/visita";
import { respuestaErrorVisita } from "@/modules/visita/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const fecha = new URL(request.url).searchParams.get("fecha") ?? undefined;
    const reservas = await listarReservasDelDia(fecha);
    return NextResponse.json({ reservas });
  } catch (error) {
    return respuestaErrorVisita(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      unidadId?: string;
      compradorId?: string;
      iniciaEn?: string;
    };
    if (!body.unidadId || !body.compradorId || !body.iniciaEn) {
      return NextResponse.json(
        {
          error: "unidadId, compradorId e iniciaEn son obligatorios.",
          codigo: "payload_invalido",
        },
        { status: 400 },
      );
    }
    const reserva = await crearReserva({
      unidadId: body.unidadId,
      compradorId: body.compradorId,
      iniciaEn: body.iniciaEn,
    });
    return NextResponse.json(reserva, { status: 201 });
  } catch (error) {
    return respuestaErrorVisita(error);
  }
}
