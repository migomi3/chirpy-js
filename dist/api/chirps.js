import { BadRequestError } from "./errors.js";
import { CleanMessage, respondWithError, respondWithJSON } from "../helpers.js";
import { createChirp, deleteChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";
export async function handlerCreateChirp(req, res) {
    const input = req.body;
    const tokenString = getBearerToken(req);
    const userID = validateJWT(tokenString, config.jwt.secret);
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
    let authorId = "";
    const authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }
    let sortBy = "";
    const sortQuery = req.query.sort;
    if (typeof sortQuery === "string" && (sortQuery === "asc" || sortQuery === "desc")) {
        sortBy = sortQuery;
    }
    let chirps = results.filter((chirp) => chirp.userId === authorId || authorId === "");
    chirps = chirps.sort((chirpA, chirpB) => {
        const timeA = chirpA.createdAt;
        const timeB = chirpB.createdAt;
        if (timeA < timeB || sortBy === "desc") {
            return -1;
        }
        if (timeA > timeB || sortBy === "desc") {
            return 1;
        }
        return 0;
    });
    respondWithJSON(res, chirps);
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
export async function handlerDeleteChirp(req, res) {
    const tokentString = getBearerToken(req);
    const userId = validateJWT(tokentString, config.jwt.secret);
    const chirpId = req.params.chirpID;
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        respondWithError(res, "Chirp not found", 404);
        return;
    }
    if (chirp.userId !== userId) {
        respondWithError(res, "Can not delete another user's chirp", 403);
        return;
    }
    const result = await deleteChirp(chirpId);
    respondWithJSON(res, result, 204);
}
