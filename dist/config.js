process.loadEnvFile();
const migrationConfig = {
    migrationsFolder: "./src/db/migrations"
};
export const config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM")
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
    jwt: {
        defaultDuration: 60 * 60, // 1 hour in seconds
        refreshDuration: 60 * 60 * 24 * 60 * 1000, // 60 days in milliseconds
        secret: envOrThrow("SECRET"),
        issuer: "chirpy",
    },
};
//I'd rather have this in the helpers.ts file but apperently the compilation
//order is stupid so for now this will live here.
//For more details, time travel to when I'm writing this as I'm
//not gonna remember logic behind this shit by the time it matters
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}
