import { confirmarPorteria } from "@/modules/visita";
import { respuestaErrorVisita } from "@/modules/visita/http";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/reservas/[id]/confirmacion-porteria">,
) {
  try {
    const { id } = await context.params;
    const reserva = await confirmarPorteria(id);
    return Response.json(reserva);
  } catch (error) {
    return respuestaErrorVisita(error);
  }
}
