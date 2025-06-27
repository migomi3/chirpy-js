import { CleanMessage } from "../helpers.js";
export async function handlerValidate(req, res) {
    console.log("validating...");
    const input = req.body;
    if (input.body.length > 140) {
        throw new Error("Chirp is too long");
    }
    res.send({ "cleanedBody": CleanMessage(input.body) });
    console.log("validation finished");
}
