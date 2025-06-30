import { getAllChirps } from "../db/queries/chirps.js";
import { respondWithJSON } from "../helpers.js";
export async function handlerGetAllChirps(req, res) {
    const results = await getAllChirps();
    console.log(results);
    respondWithJSON(res, results);
}
