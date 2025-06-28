import { envOrThrow } from "./helpers.js";
process.loadEnvFile();
export const config = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL"),
};
