import { createUser, getUser } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "../helpers.js";
import { checkPasswordHash, hashPassword, makeJWT } from "../auth/auth.js";
import { config } from "../config.js";
export async function handlerCreateUser(req, res) {
    const input = req.body;
    const hashedPassword = await hashPassword(input.password);
    const user = {
        hashedPassword: hashedPassword,
        email: input.email
    };
    const result = await createUser(user);
    respondWithJSON(res, result, 201);
}
export async function handlerLogin(req, res) {
    const input = req.body;
    if (!input.expiresInSeconds || input.expiresInSeconds > 3600) {
        input.expiresInSeconds = 3600;
    }
    const user = await getUser(input.email);
    const token = makeJWT(user.id, input.expiresInSeconds, config.api.secret);
    if (!user || !await checkPasswordHash(input.password, user.hashedPassword)) {
        respondWithError(res, "Incorrect email or password", 401);
        return;
    }
    const verifiedUser = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token
    };
    respondWithJSON(res, verifiedUser);
}
