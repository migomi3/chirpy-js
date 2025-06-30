import {Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "../helpers.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../api/errors.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (res.statusCode !== 200 && res.statusCode !== 201) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    });
    next()
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.api.fileServerHits++;
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
            console.log(err.message)
            respondWithError(res, "Something went wrong on our end", 500);
    }
}