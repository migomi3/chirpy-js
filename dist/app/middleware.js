import { config } from "../config.js";
import { respondWithError } from "../helpers.js";
import { BadRequestError, ForbiddenError, NotFoundError, UserNotAuthenticatedError } from "../api/errors.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (!(res.statusCode <= 299 && res.statusCode >= 200)) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function middlewareMetricsInc(req, res, next) {
    config.api.fileServerHits++;
    next();
}
export function middlewareErrorHandler(err, req, res, next) {
    switch (err.constructor) {
        case BadRequestError:
            respondWithError(res, err.message, 400);
            break;
        case UserNotAuthenticatedError:
            respondWithError(res, err.message, 401);
            break;
        case ForbiddenError:
            respondWithError(res, err.message, 403);
            break;
        case NotFoundError:
            respondWithError(res, err.message, 404);
            break;
        default:
            console.log(err.message);
            respondWithError(res, "Something went wrong on our end", 500);
    }
}
