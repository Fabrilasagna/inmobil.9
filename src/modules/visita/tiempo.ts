const ZONA_LIMA = "America/Lima";
const OFFSET_LIMA = "-05:00";

export type Franja = {
  iniciaEn: Date;
  terminaEn: Date;
};

function parseHoraMinuto(valor: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(valor);
  if (!match) {
    throw new Error(`Hora inválida: ${valor}`);
  }
  const horas = Number(match[1]);
  const minutos = Number(match[2]);
  return horas * 60 + minutos;
}

function minutosAHora(total: number) {
  const horas = Math.floor(total / 60);
  const minutos = total % 60;
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

export function esFechaISO(valor: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(valor);
}

export function fechaHoyLima(ahora = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_LIMA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ahora);
}

export function instanteEnLima(fechaISO: string, horaMinuto: string) {
  return new Date(`${fechaISO}T${horaMinuto}:00.000${OFFSET_LIMA}`);
}

export function formatearHoraLima(fecha: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA_LIMA,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(fecha);
}

export function armarFranjasDelDia(params: {
  fechaISO: string;
  ventanaInicio: string;
  ventanaFin: string;
  duracionMinutos: number;
  intervaloMinutos: number;
  ahora?: Date;
}): Franja[] {
  const inicioDia = parseHoraMinuto(params.ventanaInicio);
  const finDia = parseHoraMinuto(params.ventanaFin);
  const paso = params.duracionMinutos + params.intervaloMinutos;
  const ahora = params.ahora ?? new Date();
  const franjas: Franja[] = [];

  for (
    let inicioMin = inicioDia;
    inicioMin + params.duracionMinutos <= finDia;
    inicioMin += paso
  ) {
    const iniciaEn = instanteEnLima(params.fechaISO, minutosAHora(inicioMin));
    if (iniciaEn.getTime() <= ahora.getTime()) {
      continue;
    }
    const terminaEn = instanteEnLima(
      params.fechaISO,
      minutosAHora(inicioMin + params.duracionMinutos),
    );
    franjas.push({ iniciaEn, terminaEn });
  }

  return franjas;
}

export function seSolapan(a: Franja, b: Franja) {
  return a.iniciaEn < b.terminaEn && a.terminaEn > b.iniciaEn;
}
