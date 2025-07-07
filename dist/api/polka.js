import { upgradeUser } from "../db/queries/users.js";
import { respondWithJSON } from "../helpers.js";
import { NotFoundError } from "./errors.js";
export async function handlerUpgradeUser(req, res) {
    const reqBody = req.body;
    if (reqBody.event !== "user.upgraded") {
        respondWithJSON(res, {}, 204);
        return;
    }
    try {
        const result = await upgradeUser(reqBody.data.userId);
        respondWithJSON(res, result, 204);
    }
    catch (err) {
        throw new NotFoundError("User not found");
    }
}
