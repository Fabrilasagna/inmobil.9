-- CreateEnum
CREATE TYPE "EstadoUnidad" AS ENUM ('prospecto', 'calificada', 'firmada', 'en_alta', 'publicada', 'con_oferta', 'reservada', 'en_cierre', 'cerrada', 'retirada');

-- CreateEnum
CREATE TYPE "EstadoReservaVisita" AS ENUM ('solicitada', 'confirmada', 'acceso_emitido', 'en_curso', 'realizada', 'cancelada', 'no_asistio', 'vencida');

-- CreateEnum
CREATE TYPE "ResultadoVisita" AS ENUM ('pendiente', 'interesada', 'no_interesada');

-- CreateEnum
CREATE TYPE "TipoEventoAcceso" AS ENUM ('codigo_validado', 'apertura', 'cierre', 'denegado', 'timeout');

-- CreateEnum
CREATE TYPE "EstadoOferta" AS ENUM ('enviada', 'contraoferta', 'aceptada', 'rechazada', 'caducada', 'retirada');

-- CreateEnum
CREATE TYPE "EstadoOperacionCierre" AS ENUM ('abierta', 'documentacion', 'pendiente_firma', 'firmada', 'caida');

-- CreateEnum
CREATE TYPE "SeveridadIncidencia" AS ENUM ('baja', 'media', 'alta', 'critica');

-- CreateEnum
CREATE TYPE "EstadoIncidencia" AS ENUM ('abierta', 'en_curso', 'resuelta', 'cerrada');

-- CreateEnum
CREATE TYPE "CanalConversacion" AS ENUM ('whatsapp', 'email', 'telefono', 'interno');

-- CreateEnum
CREATE TYPE "EstadoConversacion" AS ENUM ('abierta', 'archivada');

-- CreateTable
CREATE TABLE "edificios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "codigoPostal" TEXT,
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),
    "instruccionesAcceso" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edificios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" TEXT NOT NULL,
    "referencia" TEXT NOT NULL,
    "estado" "EstadoUnidad" NOT NULL DEFAULT 'prospecto',
    "edificioId" TEXT NOT NULL,
    "planta" TEXT,
    "puerta" TEXT,
    "tipologia" TEXT,
    "superficieM2" DECIMAL(8,2),
    "habitaciones" INTEGER,
    "banos" INTEGER,
    "precioPedido" DECIMAL(12,2),
    "precioPublicado" DECIMAL(12,2),
    "descripcion" TEXT,
    "publicadaEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propietarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "documentoIdentidad" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "propietarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidad_propietarios" (
    "unidadId" TEXT NOT NULL,
    "propietarioId" TEXT NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL DEFAULT 100,
    "esContacto" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "unidad_propietarios_pkey" PRIMARY KEY ("unidadId","propietarioId")
);

-- CreateTable
CREATE TABLE "compradores" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "acreditado" BOOLEAN NOT NULL DEFAULT false,
    "acreditadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_visita" (
    "id" TEXT NOT NULL,
    "unidadId" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "estado" "EstadoReservaVisita" NOT NULL DEFAULT 'solicitada',
    "iniciaEn" TIMESTAMP(3) NOT NULL,
    "terminaEn" TIMESTAMP(3) NOT NULL,
    "codigoAcceso" TEXT,
    "codigoAccesoExpiraEn" TIMESTAMP(3),
    "notas" TEXT,
    "canceladaEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_visita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_acceso" (
    "id" TEXT NOT NULL,
    "reservaVisitaId" TEXT NOT NULL,
    "unidadId" TEXT NOT NULL,
    "tipo" "TipoEventoAcceso" NOT NULL,
    "origen" TEXT NOT NULL,
    "exitoso" BOOLEAN NOT NULL DEFAULT true,
    "ocurridoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "eventos_acceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitas" (
    "id" TEXT NOT NULL,
    "reservaVisitaId" TEXT NOT NULL,
    "unidadId" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "iniciadaEn" TIMESTAMP(3) NOT NULL,
    "finalizadaEn" TIMESTAMP(3),
    "resultado" "ResultadoVisita" NOT NULL DEFAULT 'pendiente',
    "notasInternas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ofertas" (
    "id" TEXT NOT NULL,
    "unidadId" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "importe" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoOferta" NOT NULL DEFAULT 'enviada',
    "validezHasta" TIMESTAMP(3),
    "condiciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ofertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operaciones_cierre" (
    "id" TEXT NOT NULL,
    "unidadId" TEXT NOT NULL,
    "ofertaId" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "estado" "EstadoOperacionCierre" NOT NULL DEFAULT 'abierta',
    "precioAcordado" DECIMAL(12,2) NOT NULL,
    "fechaObjetivoFirma" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operaciones_cierre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidencias" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "severidad" "SeveridadIncidencia" NOT NULL DEFAULT 'media',
    "estado" "EstadoIncidencia" NOT NULL DEFAULT 'abierta',
    "unidadId" TEXT,
    "reservaVisitaId" TEXT,
    "visitaId" TEXT,
    "operacionCierreId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversaciones" (
    "id" TEXT NOT NULL,
    "canal" "CanalConversacion" NOT NULL,
    "asunto" TEXT NOT NULL,
    "estado" "EstadoConversacion" NOT NULL DEFAULT 'abierta',
    "ultimoMensaje" TEXT,
    "ultimoMensajeEn" TIMESTAMP(3),
    "unidadId" TEXT,
    "compradorId" TEXT,
    "propietarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidades_referencia_key" ON "unidades"("referencia");

-- CreateIndex
CREATE INDEX "unidades_estado_idx" ON "unidades"("estado");

-- CreateIndex
CREATE INDEX "unidades_edificioId_idx" ON "unidades"("edificioId");

-- CreateIndex
CREATE UNIQUE INDEX "propietarios_email_key" ON "propietarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "propietarios_documentoIdentidad_key" ON "propietarios"("documentoIdentidad");

-- CreateIndex
CREATE UNIQUE INDEX "compradores_email_key" ON "compradores"("email");

-- CreateIndex
CREATE INDEX "compradores_acreditado_idx" ON "compradores"("acreditado");

-- CreateIndex
CREATE INDEX "reservas_visita_unidadId_iniciaEn_idx" ON "reservas_visita"("unidadId", "iniciaEn");

-- CreateIndex
CREATE INDEX "reservas_visita_compradorId_idx" ON "reservas_visita"("compradorId");

-- CreateIndex
CREATE INDEX "reservas_visita_estado_idx" ON "reservas_visita"("estado");

-- CreateIndex
CREATE INDEX "eventos_acceso_reservaVisitaId_ocurridoEn_idx" ON "eventos_acceso"("reservaVisitaId", "ocurridoEn");

-- CreateIndex
CREATE INDEX "eventos_acceso_unidadId_idx" ON "eventos_acceso"("unidadId");

-- CreateIndex
CREATE UNIQUE INDEX "visitas_reservaVisitaId_key" ON "visitas"("reservaVisitaId");

-- CreateIndex
CREATE INDEX "visitas_unidadId_idx" ON "visitas"("unidadId");

-- CreateIndex
CREATE INDEX "visitas_compradorId_idx" ON "visitas"("compradorId");

-- CreateIndex
CREATE INDEX "ofertas_unidadId_estado_idx" ON "ofertas"("unidadId", "estado");

-- CreateIndex
CREATE INDEX "ofertas_compradorId_idx" ON "ofertas"("compradorId");

-- CreateIndex
CREATE UNIQUE INDEX "operaciones_cierre_ofertaId_key" ON "operaciones_cierre"("ofertaId");

-- CreateIndex
CREATE INDEX "operaciones_cierre_unidadId_idx" ON "operaciones_cierre"("unidadId");

-- CreateIndex
CREATE INDEX "operaciones_cierre_estado_idx" ON "operaciones_cierre"("estado");

-- CreateIndex
CREATE INDEX "incidencias_estado_severidad_idx" ON "incidencias"("estado", "severidad");

-- CreateIndex
CREATE INDEX "incidencias_unidadId_idx" ON "incidencias"("unidadId");

-- CreateIndex
CREATE INDEX "conversaciones_canal_estado_idx" ON "conversaciones"("canal", "estado");

-- CreateIndex
CREATE INDEX "conversaciones_unidadId_idx" ON "conversaciones"("unidadId");

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_edificioId_fkey" FOREIGN KEY ("edificioId") REFERENCES "edificios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidad_propietarios" ADD CONSTRAINT "unidad_propietarios_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidad_propietarios" ADD CONSTRAINT "unidad_propietarios_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "propietarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_visita" ADD CONSTRAINT "reservas_visita_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_visita" ADD CONSTRAINT "reservas_visita_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "compradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_acceso" ADD CONSTRAINT "eventos_acceso_reservaVisitaId_fkey" FOREIGN KEY ("reservaVisitaId") REFERENCES "reservas_visita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_acceso" ADD CONSTRAINT "eventos_acceso_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_reservaVisitaId_fkey" FOREIGN KEY ("reservaVisitaId") REFERENCES "reservas_visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "compradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ofertas" ADD CONSTRAINT "ofertas_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ofertas" ADD CONSTRAINT "ofertas_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "compradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operaciones_cierre" ADD CONSTRAINT "operaciones_cierre_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operaciones_cierre" ADD CONSTRAINT "operaciones_cierre_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "ofertas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operaciones_cierre" ADD CONSTRAINT "operaciones_cierre_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "compradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_reservaVisitaId_fkey" FOREIGN KEY ("reservaVisitaId") REFERENCES "reservas_visita"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "visitas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_operacionCierreId_fkey" FOREIGN KEY ("operacionCierreId") REFERENCES "operaciones_cierre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "compradores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "propietarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
