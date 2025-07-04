import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile()

type Config = {
  api: APIConfig;
  db: DBConfig;
}

type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
  secret: string;
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
    platform: envOrThrow("PLATFORM"),
    secret: envOrThrow("SECRET")
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};

//I'd rather have this in the helpers.ts file but apperently the compilation
//order is stupid so for now this will live here.
//For more details, time travel to when I'm writing this as I'm
//not gonna remember logic behind this shit by the time it matters
function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}