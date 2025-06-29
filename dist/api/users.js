import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "../helpers.js";
export async function handlerUsers(req, res) {
    const input = req.body;
    let user = {
        email: input.email
    };
    const result = await createUser(user);
    console.log(result);
    respondWithJSON(res, result, 201);
}
