-- CreateEnum
CREATE TYPE "TipoEventoReserva" AS ENUM ('creacion', 'notificacion_porteria', 'confirmacion_porteria', 'cancelacion');

-- AlterTable
ALTER TABLE "edificios" ADD COLUMN     "duracionVisitaMinutos" INTEGER NOT NULL DEFAULT 45;

-- CreateTable
CREATE TABLE "eventos_reserva" (
    "id" TEXT NOT NULL,
    "reservaVisitaId" TEXT NOT NULL,
    "tipo" "TipoEventoReserva" NOT NULL,
    "ocurridoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB,

    CONSTRAINT "eventos_reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "eventos_reserva_reservaVisitaId_ocurridoEn_idx" ON "eventos_reserva"("reservaVisitaId", "ocurridoEn");

-- AddForeignKey
ALTER TABLE "eventos_reserva" ADD CONSTRAINT "eventos_reserva_reservaVisitaId_fkey" FOREIGN KEY ("reservaVisitaId") REFERENCES "reservas_visita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

