import {Request, Response} from "express"
import { CleanMessage } from "../helpers.js";

export async function handlerValidate(req: Request, res: Response) {
    console.log("validating...")

    type Input = {
        body: string;
    };

    const input: Input = req.body;

    if (input.body.length > 140) {
        throw new Error("Chirp is too long")
    }
    
    res.send({"cleanedBody": CleanMessage(input.body)})

    console.log("validation finished")
}