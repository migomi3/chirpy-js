import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken"
import { BadRequestError, UserNotAuthenticatedError } from "../api/errors.js";
import { Request } from "express"

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

const TOKEN_ISSUER = "chirpy";

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
        iss: TOKEN_ISSUER,
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

    if (token.iss !== TOKEN_ISSUER) {
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
        throw new BadRequestError("Bearer token missing from header")
    }

    return extractBearerToken(authHeader)
}

export function extractBearerToken(header: string) {
    const splitToken = header.split(" ");
    if (splitToken.length < 2 || splitToken[0] !== "Bearer") {
        throw new BadRequestError("Invalid token")
    }

    return splitToken[1]
}