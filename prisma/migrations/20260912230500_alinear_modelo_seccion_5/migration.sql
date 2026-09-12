-- CreateEnum
CREATE TYPE "TipoOperacion" AS ENUM ('venta', 'alquiler');

-- CreateEnum
CREATE TYPE "TipoAcceso" AS ENUM ('caja_codigo', 'cerradura_inteligente', 'ninguno');

-- CreateEnum
CREATE TYPE "UrgenciaPropietario" AS ENUM ('baja', 'media', 'alta');

-- CreateEnum
CREATE TYPE "NivelAcreditacion" AS ENUM ('no_acreditado', 'nivel_1', 'nivel_2', 'suspendido');

-- CreateEnum
CREATE TYPE "ComparacionFotos" AS ENUM ('pendiente', 'sin_diferencia', 'marcada_revision');

-- CreateEnum
CREATE TYPE "FeedbackInteres" AS ENUM ('si', 'no', 'tal_vez');

-- CreateEnum
CREATE TYPE "MotivoFreno" AS ENUM ('precio', 'tamano', 'luz', 'estado', 'ubicacion');

-- CreateEnum
CREATE TYPE "DerivacionVisita" AS ENUM ('negociador', 'alternativas', 'seguimiento_48h', 'ninguna');

-- CreateEnum
CREATE TYPE "AutorMovimientoOferta" AS ENUM ('comprador', 'propietario', 'negociador');

-- CreateEnum
CREATE TYPE "DireccionMensaje" AS ENUM ('entrada', 'salida', 'interno');

-- CreateEnum
CREATE TYPE "CanalContacto" AS ENUM ('whatsapp', 'email', 'telefono');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoEventoAcceso" ADD VALUE 'apertura_caja';
ALTER TYPE "TipoEventoAcceso" ADD VALUE 'entrada_camara';
ALTER TYPE "TipoEventoAcceso" ADD VALUE 'salida_camara';

-- DropForeignKey
ALTER TABLE "eventos_acceso" DROP CONSTRAINT "eventos_acceso_reservaVisitaId_fkey";

-- DropIndex
DROP INDEX "compradores_acreditado_idx";

-- AlterTable
ALTER TABLE "compradores" DROP COLUMN "acreditado",
ADD COLUMN     "descartes" JSONB,
ADD COLUMN     "esInversor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "identidadVerificada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metrosMax" DECIMAL(8,2),
ADD COLUMN     "metrosMin" DECIMAL(8,2),
ADD COLUMN     "monedaBusqueda" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "nivelAcreditacion" "NivelAcreditacion" NOT NULL DEFAULT 'no_acreditado',
ADD COLUMN     "presupuestoMax" DECIMAL(12,2),
ADD COLUMN     "presupuestoMin" DECIMAL(12,2),
ADD COLUMN     "zonaBusqueda" TEXT;

-- AlterTable
ALTER TABLE "conversaciones" ADD COLUMN     "derivadoAHumano" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "edificios" DROP COLUMN "instruccionesAcceso",
ADD COLUMN     "acuerdoAdministracion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "administracionContacto" TEXT,
ADD COLUMN     "administracionNombre" TEXT,
ADD COLUMN     "intervaloMinimoMinutos" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "porteriaCanal" TEXT,
ADD COLUMN     "porteriaContacto" TEXT,
ADD COLUMN     "protocoloAcceso" TEXT,
ADD COLUMN     "reglamento" TEXT,
ADD COLUMN     "ventanaFin" TEXT NOT NULL DEFAULT '21:00',
ADD COLUMN     "ventanaInicio" TEXT NOT NULL DEFAULT '08:00';

-- AlterTable
ALTER TABLE "eventos_acceso" ADD COLUMN     "personasDetectadas" INTEGER,
ALTER COLUMN "reservaVisitaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "incidencias" ADD COLUMN     "aplicacionGarantia" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "evidencia" JSONB,
ADD COLUMN     "resolucion" TEXT;

-- AlterTable
ALTER TABLE "ofertas" ADD COLUMN     "moneda" TEXT NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "operaciones_cierre" ADD COLUMN     "checklist" JSONB,
ADD COLUMN     "comision" DECIMAL(12,2),
ADD COLUMN     "moneda" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "tipoOperacion" "TipoOperacion" NOT NULL DEFAULT 'venta';

-- AlterTable
ALTER TABLE "propietarios" ADD COLUMN     "acuerdoFirmadoEn" TIMESTAMP(3),
ADD COLUMN     "canalContacto" "CanalContacto" NOT NULL DEFAULT 'whatsapp',
ADD COLUMN     "titularidadVerificada" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "reservas_visita" ADD COLUMN     "porteriaConfirmadaEn" TIMESTAMP(3),
ADD COLUMN     "porteriaNotificadaEn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "unidades" ADD COLUMN     "camaraConectada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "formaPagoAceptada" TEXT,
ADD COLUMN     "fotosLineaBase" JSONB,
ADD COLUMN     "identificadorCaja" TEXT,
ADD COLUMN     "identificadorCamara" TEXT,
ADD COLUMN     "moneda" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "precioMinimo" DECIMAL(12,2),
ADD COLUMN     "tipoAcceso" "TipoAcceso" NOT NULL DEFAULT 'ninguno',
ADD COLUMN     "tipoOperacion" "TipoOperacion" NOT NULL DEFAULT 'venta',
ADD COLUMN     "urgencia" "UrgenciaPropietario" NOT NULL DEFAULT 'media',
ADD COLUMN     "urlRecorrido360" TEXT;

-- AlterTable
ALTER TABLE "visitas" DROP COLUMN "resultado",
ADD COLUMN     "comparacionFotos" "ComparacionFotos" NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "derivacion" "DerivacionVisita" NOT NULL DEFAULT 'ninguna',
ADD COLUMN     "feedbackInteres" "FeedbackInteres",
ADD COLUMN     "fotosSalida" JSONB,
ADD COLUMN     "motivoFreno" "MotivoFreno";

-- DropEnum
DROP TYPE "ResultadoVisita";

-- CreateTable
CREATE TABLE "movimientos_oferta" (
    "id" TEXT NOT NULL,
    "ofertaId" TEXT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "autor" "AutorMovimientoOferta" NOT NULL,
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes" (
    "id" TEXT NOT NULL,
    "conversacionId" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "direccion" "DireccionMensaje" NOT NULL,
    "derivadoAHumano" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movimientos_oferta_ofertaId_createdAt_idx" ON "movimientos_oferta"("ofertaId", "createdAt");

-- CreateIndex
CREATE INDEX "mensajes_conversacionId_createdAt_idx" ON "mensajes"("conversacionId", "createdAt");

-- CreateIndex
CREATE INDEX "compradores_nivelAcreditacion_idx" ON "compradores"("nivelAcreditacion");

-- CreateIndex
CREATE INDEX "compradores_esInversor_idx" ON "compradores"("esInversor");

-- CreateIndex
CREATE INDEX "unidades_tipoOperacion_idx" ON "unidades"("tipoOperacion");

-- AddForeignKey
ALTER TABLE "eventos_acceso" ADD CONSTRAINT "eventos_acceso_reservaVisitaId_fkey" FOREIGN KEY ("reservaVisitaId") REFERENCES "reservas_visita"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_oferta" ADD CONSTRAINT "movimientos_oferta_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "ofertas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "conversaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

