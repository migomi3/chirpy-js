import { config } from "../config.js";
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
