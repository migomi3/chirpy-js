import { Response } from "express";

export function CleanMessage(message: string) {
    const sentence = message.split(" ");
    const badWords = ["kerfuffle", "sharbert", "fornax"]

    for (let word of badWords) {
        removeBadWords(sentence, word);
    }
    
    return sentence.join(" ");
}

function removeBadWords(sentence: string[], badWord: string) {
    const loweredSentence = sentence.map(word => word.toLowerCase());

    if (loweredSentence.includes(badWord)) {
        const index = loweredSentence.indexOf(badWord)
        sentence[index] = "****";
    }
}

export function respondWithError(res: Response, message: string, code: number) {
    respondWithJSON(res, { error: message }, code);
}

export function respondWithJSON(res: Response, payload: any,  code = 200) {
    res.header("Content-Type", "application/json");
    res.status(code).send(JSON.stringify(payload));
    res.end()
}
