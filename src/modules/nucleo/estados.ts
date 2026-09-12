import type { EstadoUnidad } from "@prisma/client";

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
