import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
export async function createRefreshToken(token) {
    const [result] = await db.insert(refreshTokens).values(token).onConflictDoNothing().returning();
    return result;
}
export async function getRefeshToken(tokenString) {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, tokenString));
    return result;
}
export async function revokeRefreshToken(tokenString) {
    const currTime = sql `NOW()`;
    const [result] = await db.update(refreshTokens).set({ revokedAt: currTime, updatedAt: currTime }).where(eq(refreshTokens.token, tokenString));
    return result;
}
