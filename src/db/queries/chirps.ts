import { asc } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp, users } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning();
    return result;
}

export async function resetChirps() {
    const [result] = await db.delete(chirps).returning()
    return result
}

export async function getAllChirps() {
    const results = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
    return results
}