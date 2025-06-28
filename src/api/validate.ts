import {Request, Response} from "express"
import { CleanMessage } from "../helpers.js";
import { BadRequestError } from "./errors.js";

export async function handlerValidate(req: Request, res: Response) {
    console.log("validating...")

    type Input = {
        body: string;
    };

    const input: Input = req.body;

    if (input.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }
    
    res.send({"cleanedBody": CleanMessage(input.body)})

    console.log("validation finished")
}