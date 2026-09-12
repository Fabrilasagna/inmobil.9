# Núcleo operativo

Base del módulo 7 de la plataforma: Next.js, Prisma y PostgreSQL (Supabase). Incluye el modelo de dominio, un seed de desarrollo y una pantalla interna de unidades.

## Stack

- Next.js (App Router) + TypeScript
- Prisma + PostgreSQL
- Cliente de Supabase en `src/integrations/supabase`
- shadcn/ui

## Arranque local

1. Copia el entorno:

```bash
cp .env.example .env.local
```

2. Completa `DATABASE_URL` y `DIRECT_URL` con la URI de Supabase (Database settings). En local, si no hay proyecto de Supabase, vale cualquier Postgres compatible: ambas variables pueden apuntar a la misma cadena.

3. Instala, genera el cliente, aplica el esquema y carga el seed:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

La app queda en [http://127.0.0.1:43123](http://127.0.0.1:43123).

- Inventario: `/interno/unidades`
- Salud: `/api/health`

## Seed

El seed crea datos para desarrollar el módulo 5 (visitas) sobre inventario real:

- 1 edificio (Residencial Begonias, San Isidro, Lima)
- 5 unidades en venta, estado `publicada`, acceso con caja de código
- 2 propietarios
- 3 compradores acreditados (uno inversor)

## Módulos

```
src/modules/captacion
src/modules/alta
src/modules/publicacion
src/modules/compradores
src/modules/visita
src/modules/negociacion
src/modules/nucleo
src/integrations/supabase
```

Prisma vive en `prisma/schema.prisma`. El cliente de base de datos está en `src/modules/nucleo`.
