import { config } from "dotenv";
import {
  CanalContacto,
  EstadoUnidad,
  NivelAcreditacion,
  PrismaClient,
  TipoAcceso,
  TipoOperacion,
  UrgenciaPropietario,
} from "@prisma/client";

config({ path: ".env.local" });
config();

const prisma = new PrismaClient();

const fotosLineaBase = {
  living: "https://cdn.example.com/begonias/linea-base/living.jpg",
  cocina: "https://cdn.example.com/begonias/linea-base/cocina.jpg",
  dormitorio: "https://cdn.example.com/begonias/linea-base/dormitorio.jpg",
};

async function main() {
  await prisma.mensaje.deleteMany();
  await prisma.movimientoOferta.deleteMany();
  await prisma.eventoAcceso.deleteMany();
  await prisma.incidencia.deleteMany();
  await prisma.visita.deleteMany();
  await prisma.reservaVisita.deleteMany();
  await prisma.operacionCierre.deleteMany();
  await prisma.oferta.deleteMany();
  await prisma.conversacion.deleteMany();
  await prisma.unidadPropietario.deleteMany();
  await prisma.unidad.deleteMany();
  await prisma.edificio.deleteMany();
  await prisma.propietario.deleteMany();
  await prisma.comprador.deleteMany();

  const edificio = await prisma.edificio.create({
    data: {
      nombre: "Residencial Begonias",
      direccion: "Calle Las Begonias 441",
      ciudad: "San Isidro, Lima",
      codigoPostal: "15073",
      latitud: -12.0974,
      longitud: -77.0341,
      administracionNombre: "Administración Begonias SAC",
      administracionContacto: "+51 1 421 8800",
      porteriaContacto: "+51 989 441 220",
      porteriaCanal: "whatsapp",
      protocoloAcceso:
        "Portería 24 h. El visitante se registra con DNI. La caja de llaves está en el hall del piso. Sin confirmación de portería no se entrega código.",
      ventanaInicio: "08:00",
      ventanaFin: "21:00",
      intervaloMinimoMinutos: 30,
      reglamento:
        "Visitas autónomas solo para compradores acreditados. Máximo 3 personas. Prohibido fumar.",
      acuerdoAdministracion: true,
    },
  });

  const rosa = await prisma.propietario.create({
    data: {
      nombre: "Rosa María",
      apellidos: "Villanueva Quispe",
      email: "rosa.villanueva@example.com",
      telefono: "+51 998 120 441",
      documentoIdentidad: "10458231",
      titularidadVerificada: true,
      acuerdoFirmadoEn: new Date("2026-08-12T15:00:00.000Z"),
      canalContacto: CanalContacto.whatsapp,
    },
  });

  const fernando = await prisma.propietario.create({
    data: {
      nombre: "Fernando",
      apellidos: "Cubas Aliaga",
      email: "fernando.cubas@example.com",
      telefono: "+51 987 655 018",
      documentoIdentidad: "08721456",
      titularidadVerificada: true,
      acuerdoFirmadoEn: new Date("2026-08-14T16:30:00.000Z"),
      canalContacto: CanalContacto.whatsapp,
    },
  });

  const unidades = [
    {
      referencia: "BEG-301",
      planta: "3",
      puerta: "A",
      tipologia: "2 dormitorios",
      superficieM2: 85,
      habitaciones: 2,
      banos: 2,
      precioPedido: 298000,
      precioPublicado: 285000,
      precioMinimo: 270000,
      urgencia: UrgenciaPropietario.media,
      formaPagoAceptada: "contado_o_credito",
      descripcion: "Frente a parque. Luz de tarde, cocina abierta.",
      identificadorCaja: "IGLOO-BEG-301",
      identificadorCamara: "REOLINK-BEG-301",
      urlRecorrido360: "https://cdn.example.com/begonias/360/beg-301",
      propietarios: [{ propietarioId: rosa.id, porcentaje: 100, esContacto: true }],
    },
    {
      referencia: "BEG-302",
      planta: "3",
      puerta: "B",
      tipologia: "1 dormitorio",
      superficieM2: 58,
      habitaciones: 1,
      banos: 1,
      precioPedido: 205000,
      precioPublicado: 195000,
      precioMinimo: 185000,
      urgencia: UrgenciaPropietario.alta,
      formaPagoAceptada: "contado",
      descripcion: "Interior silencioso, ideal para renta corta.",
      identificadorCaja: "IGLOO-BEG-302",
      identificadorCamara: "REOLINK-BEG-302",
      urlRecorrido360: "https://cdn.example.com/begonias/360/beg-302",
      propietarios: [{ propietarioId: rosa.id, porcentaje: 100, esContacto: true }],
    },
    {
      referencia: "BEG-501",
      planta: "5",
      puerta: "A",
      tipologia: "3 dormitorios",
      superficieM2: 120,
      habitaciones: 3,
      banos: 2,
      precioPedido: 435000,
      precioPublicado: 420000,
      precioMinimo: 400000,
      urgencia: UrgenciaPropietario.baja,
      formaPagoAceptada: "contado_o_credito",
      descripcion: "Esquina. Estar independiente y terraza de 12 m².",
      identificadorCaja: "IGLOO-BEG-501",
      identificadorCamara: "REOLINK-BEG-501",
      urlRecorrido360: "https://cdn.example.com/begonias/360/beg-501",
      propietarios: [
        { propietarioId: rosa.id, porcentaje: 50, esContacto: true },
        { propietarioId: fernando.id, porcentaje: 50, esContacto: false },
      ],
    },
    {
      referencia: "BEG-502",
      planta: "5",
      puerta: "B",
      tipologia: "2 dormitorios",
      superficieM2: 92,
      habitaciones: 2,
      banos: 2,
      precioPedido: 325000,
      precioPublicado: 310000,
      precioMinimo: 295000,
      urgencia: UrgenciaPropietario.media,
      formaPagoAceptada: "contado_o_credito",
      descripcion: "Remodelado en 2025. Closets empotrados.",
      identificadorCaja: "IGLOO-BEG-502",
      identificadorCamara: "REOLINK-BEG-502",
      urlRecorrido360: "https://cdn.example.com/begonias/360/beg-502",
      propietarios: [
        { propietarioId: fernando.id, porcentaje: 100, esContacto: true },
      ],
    },
    {
      referencia: "BEG-801",
      planta: "8",
      puerta: "única",
      tipologia: "3 dormitorios",
      superficieM2: 145,
      habitaciones: 3,
      banos: 3,
      precioPedido: 610000,
      precioPublicado: 580000,
      precioMinimo: 550000,
      urgencia: UrgenciaPropietario.baja,
      formaPagoAceptada: "contado",
      descripcion: "Último piso. Terraza hacia el golf y vista a San Isidro.",
      identificadorCaja: "IGLOO-BEG-801",
      identificadorCamara: "REOLINK-BEG-801",
      urlRecorrido360: "https://cdn.example.com/begonias/360/beg-801",
      propietarios: [
        { propietarioId: fernando.id, porcentaje: 100, esContacto: true },
      ],
    },
  ];

  const publicadaEn = new Date("2026-09-01T14:00:00.000Z");

  for (const unidad of unidades) {
    const { propietarios, ...datos } = unidad;
    await prisma.unidad.create({
      data: {
        ...datos,
        estado: EstadoUnidad.publicada,
        tipoOperacion: TipoOperacion.venta,
        moneda: "USD",
        tipoAcceso: TipoAcceso.caja_codigo,
        camaraConectada: true,
        fotosLineaBase,
        publicadaEn,
        edificioId: edificio.id,
        titulares: { create: propietarios },
      },
    });
  }

  const acreditadoEn = new Date("2026-08-20T15:00:00.000Z");

  await prisma.comprador.createMany({
    data: [
      {
        nombre: "Daniela",
        apellidos: "Torres Salazar",
        email: "daniela.torres@example.com",
        telefono: "+51 990 118 334",
        identidadVerificada: true,
        nivelAcreditacion: NivelAcreditacion.nivel_2,
        acreditadoEn,
        esInversor: false,
        zonaBusqueda: "San Isidro, Miraflores",
        metrosMin: 80,
        metrosMax: 120,
        presupuestoMin: 250000,
        presupuestoMax: 400000,
        monedaBusqueda: "USD",
      },
      {
        nombre: "Diego",
        apellidos: "Paredes Núñez",
        email: "diego.paredes@example.com",
        telefono: "+51 987 220 119",
        identidadVerificada: true,
        nivelAcreditacion: NivelAcreditacion.nivel_1,
        acreditadoEn,
        esInversor: false,
        zonaBusqueda: "San Isidro",
        metrosMin: 50,
        metrosMax: 80,
        presupuestoMin: 180000,
        presupuestoMax: 250000,
        monedaBusqueda: "USD",
      },
      {
        nombre: "Claudia",
        apellidos: "Herrera Palacios",
        email: "claudia.herrera@example.com",
        telefono: "+51 995 441 772",
        identidadVerificada: true,
        nivelAcreditacion: NivelAcreditacion.nivel_2,
        acreditadoEn,
        esInversor: true,
        zonaBusqueda: "San Isidro",
        metrosMin: 70,
        metrosMax: 150,
        presupuestoMin: 300000,
        presupuestoMax: 600000,
        monedaBusqueda: "USD",
        descartes: [{ motivo: "sin_ascensor" }, { motivo: "primer_piso" }],
      },
    ],
  });

  const resumen = {
    edificio: edificio.nombre,
    unidades: await prisma.unidad.count(),
    propietarios: await prisma.propietario.count(),
    compradores: await prisma.comprador.count(),
    inversores: await prisma.comprador.count({ where: { esInversor: true } }),
  };

  console.log("Seed completado:", resumen);
}

main()
  .catch((error) => {
    console.error("Seed falló:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
