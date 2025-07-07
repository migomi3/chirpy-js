import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken"
import { BadRequestError, UserNotAuthenticatedError } from "../api/errors.js";
import { Request } from "express"
import { randomBytes } from "node:crypto";
import { NewRefreshToken } from "../db/schema.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";
import { config } from "../config.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

export async function checkPasswordHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

export function makeJWT(userID: string, expiresIn: number, secret: string) {
    const iat = Math.floor(Date.now() / 1000)

    return jwt.sign({
        iss: config.jwt.issuer,
        sub: userID,
        iat: iat,
        exp: iat + expiresIn
    } satisfies payload,
    secret,
    { algorithm: "HS256"});
}

export function validateJWT(tokenString: string, secret: string) {
    let token: payload;
    try {
        token = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (err) {
        throw new UserNotAuthenticatedError("Invalid token");
    }

    if (token.iss !== config.jwt.issuer) {
        throw new UserNotAuthenticatedError("Invalid Issuer")
    }

    if (!token.sub) {
        throw new UserNotAuthenticatedError("Missing User ID in token")
    }

    return token.sub;
}

export function getBearerToken(req: Request) {
    const authHeader = req.get("Authorization")

    if (!authHeader) {
        throw new UserNotAuthenticatedError("Bearer token missing from header");
    }

    return extractBearerToken(authHeader);
}

export function extractBearerToken(header: string) {
    const splitToken = header.split(" ");
    if (splitToken.length < 2 || splitToken[0] !== "Bearer") {
        throw new BadRequestError("Invalid token")
    }

    return splitToken[1]
}

export function makeRefreshToken(userId: string) {
    const bytes = 32;
    const tokenString = randomBytes(bytes).toString('hex');
    
    const token: NewRefreshToken = {
        token: tokenString,
        userId: userId,
        expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
        revokedAt: null,
    };

    return createRefreshToken(token);
}

export function getAPIKey(req: Request) {
    const authHeader = req.get("Authorization")

    if (!authHeader) {
        throw new UserNotAuthenticatedError("Bearer token missing from header");
    }

    return extractAPIKey(authHeader);
}

export function extractAPIKey(header: string) {
    const splitToken = header.split(" ");
    if (splitToken.length < 2 || splitToken[0] !== "ApiKey") {
        throw new BadRequestError("Invalid token")
    }

    return splitToken[1]
}
