import { config } from "../config.js";
import { respondWithError, respondWithJSON } from "../helpers.js";
import { resetUsers } from "../db/queries/users.js";
import { resetChirps } from "../db/queries/chirps.js";
export function handlerReset(req, res) {
    config.api.fileServerHits = 0;
    if (config.api.platform != "dev") {
        respondWithError(res, "Reset not allowed from this system", 403);
    }
    resetUsers();
    resetChirps();
    respondWithJSON(res, "Data Reset");
}
