import express from "express";

import { handlerReadiness } from "./api/readiness.js"
import { middlewareErrorHandler, middlewareLogResponses, middlewareMetricsInc } from "./app/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidate } from "./api/validate.js";

import { migrate } from "drizzle-orm/postgres-js/migrator"
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "./config.js";

const app = express();

const migrationClient = postgres(config.db.url, { max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.use(middlewareLogResponses, express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});

app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handlerValidate(req, res)).catch(next);
});

app.use(middlewareErrorHandler);
    
app.listen(config.api.port)
