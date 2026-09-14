import type { CajaLlaves, CodigoAcceso, GenerarCodigoParams } from "./types";

function codigoSeisDigitos() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const cajaLlavesMock: CajaLlaves = {
  async generarCodigo(params: GenerarCodigoParams): Promise<CodigoAcceso> {
    const codigo = codigoSeisDigitos();
    console.info("[caja-llaves:mock] codigo generado", {
      unidadId: params.unidadId,
      identificadorCaja: params.identificadorCaja,
      iniciaEn: params.iniciaEn.toISOString(),
      terminaEn: params.terminaEn.toISOString(),
    });
    return { codigo, expiraEn: params.terminaEn };
  },

  async invalidarCodigo(params: { codigo: string }): Promise<void> {
    console.info("[caja-llaves:mock] codigo invalidado", {
      sufijo: params.codigo.slice(-2),
    });
  },
};
