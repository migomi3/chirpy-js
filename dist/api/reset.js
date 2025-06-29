import { config } from "../config.js";
import { respondWithError, respondWithJSON } from "../helpers.js";
import { resetUsers } from "../db/queries/users.js";
export function handlerReset(req, res) {
    config.api.fileServerHits = 0;
    if (config.api.platform != "dev") {
        respondWithError(res, "Reset not allowed from this system", 403);
    }
    respondWithJSON(res, resetUsers());
}
