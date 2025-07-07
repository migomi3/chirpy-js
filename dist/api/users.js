import { createUser, getUser, updateUserLogin } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "../helpers.js";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";
import { BadRequestError } from "./errors.js";
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
    const user = await getUser(input.email);
    if (!user || !await checkPasswordHash(input.password, user.hashedPassword)) {
        respondWithError(res, "Incorrect email or password", 401);
        return;
    }
    const jwtToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
    const refreshToken = await makeRefreshToken(user.id);
    const verifiedUser = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: jwtToken,
        refreshToken: refreshToken.token,
        isChirpyRed: user.isChirpyRed
    };
    respondWithJSON(res, verifiedUser);
}
export async function handlerUpdateLoginInfo(req, res) {
    const input = req.body;
    if (!input.password || !input.email) {
        throw new BadRequestError("Missing required fields");
    }
    const tokenString = getBearerToken(req);
    const userID = validateJWT(tokenString, config.jwt.secret);
    const hashedPassword = await hashPassword(input.password);
    const user = await updateUserLogin(input.email, hashedPassword, userID);
    const safeUser = {
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        id: user.id,
        isChirpyRed: user.isChirpyRed,
    };
    respondWithJSON(res, safeUser);
}
