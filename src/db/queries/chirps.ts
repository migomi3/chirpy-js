import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning();
    return result;
}

export async function resetChirps() {
    const [result] = await db.delete(chirps).returning()
    return result
}