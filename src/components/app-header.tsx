import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Núcleo operativo
          </p>
          <p className="truncate text-sm font-semibold">Operaciones internas</p>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/interno/unidades">Unidades</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/interno/reservas">Reservas</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/api/health">Salud</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
