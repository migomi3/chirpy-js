import express from "express";
import { config } from "../config.js";

export function handlerReset(req: express.Request, res: express.Response) {
    config.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("Reset Done");
}