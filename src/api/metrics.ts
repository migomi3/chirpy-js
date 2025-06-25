import express from "express"
import { config } from "../config.js";

export function handlerMetrics(req: express.Request, res: express.Response) {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(`Hits: ${config.fileserverHits}`);
}