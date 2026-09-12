import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Núcleo operativo
        </h1>
        <p className="text-muted-foreground">
          Inventario, estados y datos maestros para captación, alta, visitas y
          negociación. Esta es la base del módulo 7.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Unidades</CardTitle>
            <CardDescription>
              Listado interno con estado, edificio y titulares. El seed deja 5
              unidades publicadas en Recoletos 8.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/interno/unidades">Ver unidades</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Salud del sistema</CardTitle>
            <CardDescription>
              Comprueba la API y la conexión a PostgreSQL (Supabase o la base
              de desarrollo).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/api/health">GET /api/health</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
