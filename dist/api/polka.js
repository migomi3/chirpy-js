import { upgradeUser } from "../db/queries/users.js";
import { respondWithJSON } from "../helpers.js";
import { getAPIKey } from "../auth/auth.js";
import { config } from "../config.js";
import { UserNotAuthenticatedError } from "./errors.js";
export async function handlerUpgradeUser(req, res) {
    const key = getAPIKey(req);
    if (key !== config.api.polkaKey) {
        throw new UserNotAuthenticatedError("polka access denied");
    }
    const reqBody = req.body;
    if (reqBody.event !== "user.upgraded") {
        respondWithJSON(res, {}, 204);
        return;
    }
    const result = await upgradeUser(reqBody.data.userId);
    respondWithJSON(res, result, 204);
}
