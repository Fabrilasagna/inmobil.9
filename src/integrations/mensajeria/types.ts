export type NotificarPorteriaParams = {
  destino: string | null;
  canal: string | null;
  unidadReferencia: string;
  compradorNombre: string;
  iniciaEn: Date;
  terminaEn: Date;
};

export type Mensajeria = {
  notificarPorteria(params: NotificarPorteriaParams): Promise<void>;
};
