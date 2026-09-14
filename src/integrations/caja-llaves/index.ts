import { cajaLlavesMock } from "./mock";
import type { CajaLlaves } from "./types";

export type { CajaLlaves, CodigoAcceso, GenerarCodigoParams } from "./types";

export function getCajaLlaves(): CajaLlaves {
  return cajaLlavesMock;
}
