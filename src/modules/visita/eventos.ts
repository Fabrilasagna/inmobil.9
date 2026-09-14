import type { Prisma } from "@prisma/client";
import { getPrisma } from "@/modules/nucleo/db";

type ClienteEventos =
  | ReturnType<typeof getPrisma>
  | Prisma.TransactionClient;

export async function registrarEventoReserva(
  db: ClienteEventos,
  params: {
    reservaVisitaId: string;
    tipo: "creacion" | "notificacion_porteria" | "confirmacion_porteria" | "cancelacion";
    payload?: Prisma.InputJsonValue;
  },
) {
  await db.eventoReserva.create({
    data: {
      reservaVisitaId: params.reservaVisitaId,
      tipo: params.tipo,
      payload: params.payload,
    },
  });
}
