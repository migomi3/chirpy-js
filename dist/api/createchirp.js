import { BadRequestError } from "./errors.js";
import { CleanMessage, respondWithJSON } from "../helpers.js";
import { createChirp } from "../db/queries/chirps.js";
export async function handlerChirps(req, res) {
    const input = req.body;
    if (input.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const chirp = {
        body: CleanMessage(input.body),
        userId: input.userId,
    };
    const result = await createChirp(chirp);
    respondWithJSON(res, result, 201);
}
