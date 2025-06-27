import { config } from "../config.js";
import { respondWithError } from "../helpers.js";
export function middlewareLogResponses(req, res, next) {
    console.log("Logging responses...");
    res.on("finish", () => {
        if (res.statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    console.log("responses logged");
    next();
}
export function middlewareMetricsInc(req, res, next) {
    console.log("updating server hits...");
    config.fileserverHits++;
    next();
}
export function middlewareErrorHandler(err, req, res, next) {
    console.log(err.message);
    respondWithError(res, "Something went wrong on our end", 500);
}
