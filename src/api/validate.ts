import {Request, Response} from "express"
import { CleanMessage } from "../helpers.js";

export function handlerValidate(req: Request, res: Response) {
    console.log("validating...")

    try {
        type Input = {
            body: string;
        };

        const input: Input = req.body;

        if (input.body.length > 140) {
            throw new Error("Chirp is too long")
        }
        
        res.send({"cleanedBody": CleanMessage(input.body)})

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send({"error": error.message})
        }
    }

    console.log("validation finished")
}