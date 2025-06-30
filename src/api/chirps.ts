import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { CleanMessage, respondWithJSON } from "../helpers.js";
import { NewChirp } from "src/db/schema.js";
import { createChirp, getAllChirps } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {
    type Input = {
        body: string;
        userId: string;
    }
    
    const input: Input = req.body;
    
    if (input.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }

    const chirp: NewChirp = {
        body: CleanMessage(input.body),
        userId: input.userId,
    }

    const result = await createChirp(chirp)
    respondWithJSON(res, result, 201)
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    const results = await getAllChirps()
    console.log(results)
    respondWithJSON(res, results)
}