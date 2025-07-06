import { Request, Response } from "express";
import { createUser, getUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithError, respondWithJSON } from "../helpers.js";
import { checkPasswordHash, hashPassword, makeJWT, makeRefreshToken } from "../auth/auth.js";
import { LoginInput, SecureUser } from "./types.js";
import { config } from "../config.js";
import { BadRequestError } from "./errors.js";



export async function handlerCreateUser(req: Request, res: Response) {
    const input: LoginInput = req.body;
    
    const hashedPassword = await hashPassword(input.password)
    const user: NewUser = {
        hashedPassword: hashedPassword,
        email: input.email
    }
    
    const result = await createUser(user)
    respondWithJSON(res, result, 201) 
}

export async function handlerLogin(req: Request, res: Response) {
    const input: LoginInput = req.body;

    const user = await getUser(input.email);
    
    if (!user || !await checkPasswordHash(input.password, user.hashedPassword)) {
        respondWithError(res, "Incorrect email or password", 401)
        return;
    }

    const jwtToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
    const refreshToken = await makeRefreshToken(user.id);

    const verifiedUser: SecureUser = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: jwtToken,
        refreshToken: refreshToken.token,
    }

    respondWithJSON(res, verifiedUser);
}

