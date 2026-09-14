export class ErrorVisita extends Error {
  readonly codigo: string;
  readonly httpStatus: number;

  constructor(codigo: string, mensaje: string, httpStatus: number) {
    super(mensaje);
    this.name = "ErrorVisita";
    this.codigo = codigo;
    this.httpStatus = httpStatus;
  }
}

export function esErrorVisita(error: unknown): error is ErrorVisita {
  return error instanceof ErrorVisita;
}
