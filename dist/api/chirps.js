import { BadRequestError } from "./errors.js";
import { CleanMessage, respondWithError, respondWithJSON } from "../helpers.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";
export async function handlerCreateChirp(req, res) {
    const input = req.body;
    const tokenString = getBearerToken(req);
    const userID = validateJWT(tokenString, config.api.secret);
    if (input.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const chirp = {
        body: CleanMessage(input.body),
        userId: userID,
    };
    const result = await createChirp(chirp);
    respondWithJSON(res, result, 201);
}
export async function handlerGetAllChirps(req, res) {
    const results = await getAllChirps();
    respondWithJSON(res, results);
}
export async function handlerGetChirp(req, res) {
    const id = req.params.chirpID;
    const result = await getChirp(id);
    if (!result) {
        respondWithError(res, "Chirp not found", 404);
        return;
    }
    respondWithJSON(res, result);
}
