import type { EstadoReservaVisita } from "@prisma/client";

/**
 * Módulo 5 — Visita
 * Reserva, acceso y materialización de la visita.
 */
export const ETIQUETAS_ESTADO_RESERVA: Record<EstadoReservaVisita, string> = {
  solicitada: "Solicitada",
  confirmada: "Confirmada",
  acceso_emitido: "Acceso emitido",
  en_curso: "En curso",
  realizada: "Realizada",
  cancelada: "Cancelada",
  no_asistio: "No asistió",
  vencida: "Vencida",
};

export const FLUJO_RESERVA_VISITA: EstadoReservaVisita[] = [
  "solicitada",
  "confirmada",
  "acceso_emitido",
  "en_curso",
  "realizada",
];
