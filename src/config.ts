import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile()

type Config = {
  api: APIConfig;
  db: DBConfig;
}

type APIConfig = {
  fileServerHits: number;
  port: number;
}

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations"
}

export const config: Config = {
  api: {
    fileServerHits: 0,
    port: Number(envOrThrow("PORT")),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};

function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}