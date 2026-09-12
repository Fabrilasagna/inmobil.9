import type { EstadoUnidad, TipoAcceso, TipoOperacion } from "@prisma/client";

export const ETIQUETAS_ESTADO_UNIDAD: Record<EstadoUnidad, string> = {
  prospecto: "Prospecto",
  calificada: "Calificada",
  firmada: "Firmada",
  en_alta: "En alta",
  publicada: "Publicada",
  con_oferta: "Con oferta",
  reservada: "Reservada",
  en_cierre: "En cierre",
  cerrada: "Cerrada",
  retirada: "Retirada",
};

export const ORDEN_ESTADO_UNIDAD: EstadoUnidad[] = [
  "prospecto",
  "calificada",
  "firmada",
  "en_alta",
  "publicada",
  "con_oferta",
  "reservada",
  "en_cierre",
  "cerrada",
  "retirada",
];

export const ETIQUETAS_TIPO_OPERACION: Record<TipoOperacion, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
};

export const ETIQUETAS_TIPO_ACCESO: Record<TipoAcceso, string> = {
  caja_codigo: "Caja con código",
  cerradura_inteligente: "Cerradura inteligente",
  ninguno: "Sin acceso",
};
