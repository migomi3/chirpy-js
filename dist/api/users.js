import { createUser, getUser } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "../helpers.js";
import { checkPasswordHash, hashPassword, makeJWT, makeRefreshToken } from "../auth/auth.js";
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
    const user = await getUser(input.email);
    if (!user || !await checkPasswordHash(input.password, user.hashedPassword)) {
        respondWithError(res, "Incorrect email or password", 401);
        return;
    }
    const jwtToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
    const refreshToken = await makeRefreshToken(user.id);
    console.log(`JWT/Access Token: ${jwtToken}`);
    console.log(`New Refresh Token's token: ${refreshToken.token}`);
    const verifiedUser = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: jwtToken,
        refreshToken: refreshToken.token,
    };
    respondWithJSON(res, verifiedUser);
}
