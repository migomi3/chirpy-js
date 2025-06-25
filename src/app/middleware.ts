import express, { NextFunction } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.on("finish", () => {
        if (res.statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    });
    next()
}

export function middlewareMetricsInc(req: express.Request, res: express.Response, next: express.NextFunction) {
    config.fileserverHits++;
    next()
}