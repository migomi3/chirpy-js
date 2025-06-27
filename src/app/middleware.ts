import {Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    console.log("Logging responses...")

    res.on("finish", () => {
        if (res.statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    });
    console.log("responses logged")
    next()
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    console.log("updating server hits...")

    config.fileserverHits++;
    next()
}