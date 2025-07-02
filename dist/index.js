import express from "express";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "./config.js";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareErrorHandler, middlewareLogResponses, middlewareMetricsInc } from "./app/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerCreateUser, handlerLogin } from "./api/users.js";
import { handlerCreateChirp, handlerGetAllChirps, handlerGetChirp } from "./api/chirps.js";
const app = express();
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
app.use(middlewareLogResponses, express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerGetAllChirps(req, res).catch(next));
});
app.get("/api/chirps/:chirpID", (req, res, next) => {
    Promise.resolve(handlerGetChirp(req, res).catch(next));
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerCreateChirp(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next);
});
app.use(middlewareErrorHandler);
app.listen(config.api.port);
