import { getBearerToken, makeJWT } from "../auth/auth.js";
import { getRefeshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { respondWithError, respondWithJSON } from "../helpers.js";
import { config } from "../config.js";
export async function handlerRefresh(req, res) {
    const tokenString = getBearerToken(req);
    console.log(`TokenString: ${tokenString}`);
    const refreshToken = await getRefeshToken(tokenString);
    if (!refreshToken) {
        respondWithError(res, "Refresh token not found", 401);
        return;
    }
    if (refreshToken.expiresAt < new Date() || refreshToken.revokedAt) {
        respondWithError(res, "Refresh token expired or revoked", 401);
        return;
    }
    const newAccessToken = makeJWT(refreshToken.userId, config.jwt.defaultDuration, config.jwt.secret);
    respondWithJSON(res, { token: newAccessToken });
}
export async function handlerRevoke(req, res) {
    const tokenString = getBearerToken(req);
    const refreshToken = await getRefeshToken(tokenString);
    if (!refreshToken) {
        respondWithError(res, "Refresh token not found", 401);
    }
    if (refreshToken.expiresAt < new Date() || refreshToken.revokedAt) {
        respondWithError(res, "Refresh token is already expired or revoked", 401);
    }
    await revokeRefreshToken(refreshToken.token);
    respondWithJSON(res, {}, 204);
}
