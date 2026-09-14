import type { EstadoReservaVisita } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ETIQUETAS_ESTADO_RESERVA,
  fechaHoyLima,
  listarReservasDelDia,
  type ReservaPublica,
} from "@/modules/visita";
import { formatearHoraLima } from "@/modules/visita/tiempo";

export const dynamic = "force-dynamic";

function EstadoBadge({ estado }: { estado: string }) {
  const label =
    ETIQUETAS_ESTADO_RESERVA[estado as EstadoReservaVisita] ?? estado;
  const confirmada = estado === "confirmada";
  return (
    <Badge variant={confirmada ? "default" : "secondary"}>{label}</Badge>
  );
}

function FranjaCell({ reserva }: { reserva: ReservaPublica }) {
  const inicio = formatearHoraLima(new Date(reserva.iniciaEn));
  const fin = formatearHoraLima(new Date(reserva.terminaEn));
  return (
    <span>
      {inicio}–{fin}
    </span>
  );
}

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>;
}) {
  const params = await searchParams;
  const fecha = params.fecha ?? fechaHoyLima();
  let reservas: ReservaPublica[] = [];
  let error: string | null = null;

  try {
    reservas = await listarReservasDelDia(fecha);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "No se pudo leer la agenda.";
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Reservas</h1>
        <p className="text-sm text-muted-foreground">
          Agenda del día (hora Lima). El código de caja no se muestra.
        </p>
      </div>

      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>Día {fecha}</CardTitle>
          <CardDescription>
            {error
              ? "La consulta a la base de datos no está disponible."
              : `${reservas.length} reserva${reservas.length === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm font-medium">No se pudieron cargar las reservas</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
          ) : reservas.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No hay reservas para este día.
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidad</TableHead>
                      <TableHead>Comprador</TableHead>
                      <TableHead>Franja</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Portería</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservas.map((reserva) => (
                      <TableRow key={reserva.id}>
                        <TableCell className="font-medium">
                          {reserva.unidadReferencia}
                        </TableCell>
                        <TableCell>{reserva.compradorNombre}</TableCell>
                        <TableCell>
                          <FranjaCell reserva={reserva} />
                        </TableCell>
                        <TableCell>
                          <EstadoBadge estado={reserva.estado} />
                        </TableCell>
                        <TableCell>
                          {reserva.porteriaConfirmadaEn
                            ? "Confirmada"
                            : reserva.porteriaNotificadaEn
                              ? "Notificada"
                              : "Pendiente"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col gap-3 p-4 md:hidden">
                {reservas.map((reserva) => (
                  <div key={reserva.id} className="rounded-lg border bg-background p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{reserva.unidadReferencia}</p>
                        <p className="text-xs text-muted-foreground">
                          {reserva.compradorNombre}
                        </p>
                      </div>
                      <EstadoBadge estado={reserva.estado} />
                    </div>
                    <p className="mt-2 text-sm">
                      <FranjaCell reserva={reserva} /> ·{" "}
                      {reserva.porteriaConfirmadaEn
                        ? "Portería confirmada"
                        : reserva.porteriaNotificadaEn
                          ? "Portería notificada"
                          : "Portería pendiente"}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
