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