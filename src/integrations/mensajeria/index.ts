import { mensajeriaMock } from "./mock";
import type { Mensajeria } from "./types";

export type { Mensajeria, NotificarPorteriaParams } from "./types";

export function getMensajeria(): Mensajeria {
  return mensajeriaMock;
}
