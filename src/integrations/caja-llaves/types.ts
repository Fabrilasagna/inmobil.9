export type GenerarCodigoParams = {
  unidadId: string;
  identificadorCaja: string | null;
  iniciaEn: Date;
  terminaEn: Date;
};

export type CodigoAcceso = {
  codigo: string;
  expiraEn: Date;
};

export type CajaLlaves = {
  generarCodigo(params: GenerarCodigoParams): Promise<CodigoAcceso>;
  invalidarCodigo(params: { codigo: string }): Promise<void>;
};
