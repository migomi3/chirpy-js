import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithJSON } from "../helpers.js";

export async function handlerUsers(req: Request, res: Response) {
    type Input = {
        email: string;
    }

    const input: Input = req.body;
    let user: NewUser = {
        email: input.email
    }
    
    const result = await createUser(user)
    console.log(result)
    respondWithJSON(res, result, 201) 
}