import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp, users } from "../schema.js";
import { uuid } from "drizzle-orm/pg-core/index.js";

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

export async function getChirp(id: string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id))
    return result
}