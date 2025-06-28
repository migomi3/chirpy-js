import { envOrThrow } from "./helpers.js";

process.loadEnvFile()

type APIConfig = {
    fileServerHits: number;
    dbURL: string;
}

export const config: APIConfig = {
  fileServerHits: 0,
  dbURL: envOrThrow("DB_URL"),
};
