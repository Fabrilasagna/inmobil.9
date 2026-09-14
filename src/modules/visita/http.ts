import { NextResponse } from "next/server";
import { esErrorVisita } from "./errores";

export function respuestaErrorVisita(error: unknown) {
  if (esErrorVisita(error)) {
    return NextResponse.json(
      { error: error.message, codigo: error.codigo },
      { status: error.httpStatus },
    );
  }
  console.error(error);
  return NextResponse.json({ error: "Error interno." }, { status: 500 });
}
