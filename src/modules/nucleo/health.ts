import { getPrisma } from "./db";

export type HealthStatus = {
  ok: boolean;
  service: string;
  db: "ok" | "error";
  timestamp: string;
  error?: string;
};

export async function checkHealth(): Promise<HealthStatus> {
  const timestamp = new Date().toISOString();

  try {
    await getPrisma().$queryRaw`SELECT 1`;
    return {
      ok: true,
      service: "nucleo-operativo",
      db: "ok",
      timestamp,
    };
  } catch (error) {
    return {
      ok: false,
      service: "nucleo-operativo",
      db: "error",
      timestamp,
      error: error instanceof Error ? error.message : "Error de base de datos",
    };
  }
}
