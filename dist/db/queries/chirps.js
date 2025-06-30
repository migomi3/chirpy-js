import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function createChirp(chirp) {
    const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning();
    return result;
}
export async function resetChirps() {
    const [result] = await db.delete(chirps).returning();
    return result;
}
