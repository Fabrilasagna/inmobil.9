import type { EstadoUnidad } from "@prisma/client";
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
  ETIQUETAS_ESTADO_UNIDAD,
  listarUnidades,
  type UnidadListado,
} from "@/modules/nucleo";

export const dynamic = "force-dynamic";

function formatPrice(value: string | null) {
  if (!value) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function EstadoBadge({ estado }: { estado: string }) {
  const label =
    ETIQUETAS_ESTADO_UNIDAD[estado as EstadoUnidad] ?? estado.replace(/_/g, " ");
  const published = estado === "publicada";

  return (
    <Badge variant={published ? "default" : "secondary"} className="capitalize">
      {label}
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-12 text-center text-sm text-muted-foreground">
      No hay unidades en el inventario. Ejecuta{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
        npm run db:seed
      </code>{" "}
      para cargar el edificio de desarrollo.
    </div>
  );
}

function UnidadesTable({ unidades }: { unidades: UnidadListado[] }) {
  if (unidades.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referencia</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Tipología</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Titulares</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unidades.map((unidad) => (
              <TableRow key={unidad.id}>
                <TableCell className="font-medium">{unidad.referencia}</TableCell>
                <TableCell>
                  <EstadoBadge estado={unidad.estado} />
                </TableCell>
                <TableCell>
                  {unidad.edificioNombre}
                  {unidad.planta ? ` · pl. ${unidad.planta}` : ""}
                  {unidad.puerta ? ` ${unidad.puerta}` : ""}
                </TableCell>
                <TableCell>
                  {unidad.tipologia ?? "—"}
                  {unidad.superficieM2 ? ` · ${unidad.superficieM2} m²` : ""}
                </TableCell>
                <TableCell>{formatPrice(unidad.precioPublicado)}</TableCell>
                <TableCell className="max-w-56 truncate">
                  {unidad.propietarios.join(", ") || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 p-4 md:hidden">
        {unidades.map((unidad) => (
          <div
            key={unidad.id}
            className="rounded-lg border bg-background p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{unidad.referencia}</p>
                <p className="text-xs text-muted-foreground">
                  {unidad.edificioNombre}
                </p>
              </div>
              <EstadoBadge estado={unidad.estado} />
            </div>
            <p className="mt-2 text-sm">
              {unidad.tipologia ?? "Sin tipología"} ·{" "}
              {formatPrice(unidad.precioPublicado)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {unidad.propietarios.join(", ") || "Sin titulares"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default async function UnidadesPage() {
  let unidades: UnidadListado[] = [];
  let error: string | null = null;

  try {
    unidades = await listarUnidades();
  } catch (caught) {
    error =
      caught instanceof Error
        ? caught.message
        : "No se pudo leer el inventario.";
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Unidades</h1>
        <p className="text-sm text-muted-foreground">
          Inventario interno con el estado operativo de cada unidad.
        </p>
      </div>

      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>Inventario</CardTitle>
          <CardDescription>
            {error
              ? "La consulta a la base de datos no está disponible."
              : `${unidades.length} unidad${unidades.length === 1 ? "" : "es"}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm font-medium">No se pudieron cargar las unidades</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
          ) : (
            <UnidadesTable unidades={unidades} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
