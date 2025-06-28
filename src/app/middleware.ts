import {Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "../helpers.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../api/errors.js";

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

export function middlewareErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    switch (err.constructor) {
        case BadRequestError:
            respondWithError(res, err.message, 400);
            break;
        case UnauthorizedError:
            respondWithError(res, err.message, 401);
            break;
        case ForbiddenError:
            respondWithError(res, err.message, 403);
            break;
        case NotFoundError:
            respondWithError(res, err.message, 404);
            break;
        default:
            respondWithError(res, "Something went wrong on our end", 500);
    }
}