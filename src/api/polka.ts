import { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js";
import { respondWithJSON } from "../helpers.js";

export async function handlerUpgradeUser(req: Request, res: Response) {
    type webhook = {
        event: string;
        data: {
            userId: string
        }
    };

    const reqBody: webhook = req.body;

    if (reqBody.event !== "user.upgraded") {
        respondWithJSON(res, {}, 204);
        return;
    }

    const result = await upgradeUser(reqBody.data.userId);

    respondWithJSON(res, result, 204)
}