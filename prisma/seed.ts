import { config } from "dotenv";
import { PrismaClient, EstadoUnidad } from "@prisma/client";

config({ path: ".env.local" });
config();

const prisma = new PrismaClient();

async function main() {
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
      nombre: "Edificio Recoletos 8",
      direccion: "Calle de Recoletos 8",
      ciudad: "Madrid",
      codigoPostal: "28001",
      latitud: 40.4215,
      longitud: -3.6906,
      instruccionesAcceso:
        "Portería en horario laboral. Fuera de horario, usar la caja de llaves del portal (código de la reserva).",
    },
  });

  const elena = await prisma.propietario.create({
    data: {
      nombre: "Elena",
      apellidos: "Vargas Ruiz",
      email: "elena.vargas@example.com",
      telefono: "+34 611 220 118",
      documentoIdentidad: "45221890L",
    },
  });

  const miguel = await prisma.propietario.create({
    data: {
      nombre: "Miguel",
      apellidos: "Herrera Soto",
      email: "miguel.herrera@example.com",
      telefono: "+34 622 447 903",
      documentoIdentidad: "38100412H",
    },
  });

  const unidades = [
    {
      referencia: "REC8-1A",
      planta: "1",
      puerta: "A",
      tipologia: "2 dormitorios",
      superficieM2: 68,
      habitaciones: 2,
      banos: 1,
      precioPedido: 425000,
      precioPublicado: 419000,
      descripcion: "Exterior a calle Recoletos, reformada en 2023.",
      propietarios: [{ propietarioId: elena.id, porcentaje: 100, esContacto: true }],
    },
    {
      referencia: "REC8-1B",
      planta: "1",
      puerta: "B",
      tipologia: "1 dormitorio",
      superficieM2: 48,
      habitaciones: 1,
      banos: 1,
      precioPedido: 310000,
      precioPublicado: 305000,
      descripcion: "Interior luminoso con patio de manzana.",
      propietarios: [{ propietarioId: elena.id, porcentaje: 100, esContacto: true }],
    },
    {
      referencia: "REC8-2A",
      planta: "2",
      puerta: "A",
      tipologia: "3 dormitorios",
      superficieM2: 92,
      habitaciones: 3,
      banos: 2,
      precioPedido: 560000,
      precioPublicado: 545000,
      descripcion: "Esquina. Salón independiente y terraza de 8 m².",
      propietarios: [
        { propietarioId: elena.id, porcentaje: 50, esContacto: true },
        { propietarioId: miguel.id, porcentaje: 50, esContacto: false },
      ],
    },
    {
      referencia: "REC8-2B",
      planta: "2",
      puerta: "B",
      tipologia: "2 dormitorios",
      superficieM2: 71,
      habitaciones: 2,
      banos: 2,
      precioPedido: 440000,
      precioPublicado: 435000,
      descripcion: "Cocina abierta y armarios empotrados.",
      propietarios: [{ propietarioId: miguel.id, porcentaje: 100, esContacto: true }],
    },
    {
      referencia: "REC8-ATICO",
      planta: "ático",
      puerta: "única",
      tipologia: "3 dormitorios ático",
      superficieM2: 110,
      habitaciones: 3,
      banos: 2,
      precioPedido: 780000,
      precioPublicado: 765000,
      descripcion: "Ático con terraza de 28 m² y vistas al Retiro.",
      propietarios: [{ propietarioId: miguel.id, porcentaje: 100, esContacto: true }],
    },
  ];

  const publicadaEn = new Date("2026-09-01T09:00:00.000Z");

  for (const unidad of unidades) {
    const { propietarios, ...datos } = unidad;
    await prisma.unidad.create({
      data: {
        ...datos,
        estado: EstadoUnidad.publicada,
        publicadaEn,
        edificioId: edificio.id,
        titulares: { create: propietarios },
      },
    });
  }

  const acreditadoEn = new Date("2026-08-20T10:00:00.000Z");

  await prisma.comprador.createMany({
    data: [
      {
        nombre: "Lucía",
        apellidos: "Navarro Gil",
        email: "lucia.navarro@example.com",
        telefono: "+34 600 112 334",
        acreditado: true,
        acreditadoEn,
      },
      {
        nombre: "Pablo",
        apellidos: "Ortega León",
        email: "pablo.ortega@example.com",
        telefono: "+34 655 889 221",
        acreditado: true,
        acreditadoEn,
      },
      {
        nombre: "Sara",
        apellidos: "Jiménez Prado",
        email: "sara.jimenez@example.com",
        telefono: "+34 617 440 558",
        acreditado: true,
        acreditadoEn,
      },
    ],
  });

  const resumen = {
    edificio: edificio.nombre,
    unidades: await prisma.unidad.count(),
    propietarios: await prisma.propietario.count(),
    compradoresAcreditados: await prisma.comprador.count({
      where: { acreditado: true },
    }),
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
