import type { Mensajeria, NotificarPorteriaParams } from "./types";

export const mensajeriaMock: Mensajeria = {
  async notificarPorteria(params: NotificarPorteriaParams): Promise<void> {
    console.info("[mensajeria:mock] notificacion porteria", {
      destino: params.destino,
      canal: params.canal,
      unidadReferencia: params.unidadReferencia,
      compradorNombre: params.compradorNombre,
      iniciaEn: params.iniciaEn.toISOString(),
      terminaEn: params.terminaEn.toISOString(),
    });
  },
};
