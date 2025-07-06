import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BadRequestError, UserNotAuthenticatedError } from "../api/errors.js";
import { randomBytes } from "node:crypto";
import { createRefreshToken } from "../db/queries/refreshTokens.js";
const TOKEN_ISSUER = "chirpy";
export async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}
export async function checkPasswordHash(password, hash) {
    return bcrypt.compare(password, hash);
}
export function makeJWT(userID, expiresIn, secret) {
    const iat = Math.floor(Date.now() / 1000);
    return jwt.sign({
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: iat,
        exp: iat + expiresIn
    }, secret, { algorithm: "HS256" });
}
export function validateJWT(tokenString, secret) {
    let token;
    try {
        token = jwt.verify(tokenString, secret);
    }
    catch (err) {
        throw new UserNotAuthenticatedError("Invalid token");
    }
    if (token.iss !== TOKEN_ISSUER) {
        throw new UserNotAuthenticatedError("Invalid Issuer");
    }
    if (!token.sub) {
        throw new UserNotAuthenticatedError("Missing User ID in token");
    }
    return token.sub;
}
export function getBearerToken(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new BadRequestError("Bearer token missing from header");
    }
    return extractBearerToken(authHeader);
}
export function extractBearerToken(header) {
    const splitToken = header.split(" ");
    if (splitToken.length < 2 || splitToken[0] !== "Bearer") {
        throw new BadRequestError("Invalid token");
    }
    return splitToken[1];
}
export function makeRefreshToken(userId) {
    const bytes = 32;
    const tokenString = randomBytes(bytes).toString('hex');
    const token = {
        token: tokenString,
        userId: userId
    };
    return createRefreshToken(token);
}
