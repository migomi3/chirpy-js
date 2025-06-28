import { CleanMessage } from "../helpers.js";
import { BadRequestError } from "./errors.js";
export async function handlerValidate(req, res) {
    console.log("validating...");
    const input = req.body;
    if (input.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    res.send({ "cleanedBody": CleanMessage(input.body) });
    console.log("validation finished");
}
