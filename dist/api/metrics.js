import { config } from "../config.js";
export function handlerMetrics(req, res) {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(`Hits: ${config.fileserverHits}`);
}
