import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";
export async function createUser(user) {
    const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
    return result;
}
export async function resetUsers() {
    const [result] = await db.delete(users).returning();
    return result;
}
export async function getUser(email) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
}
