import { readUsersDB, writeUsersDB } from "../../../backendLibs/dbLib";
import bcrypt from "bcrypt";
import { checkToken } from "../../../backendLibs/checkToken";

export default function userRegisterRoute(req, res) {
  if (req.method === "POST") {
    const { username, password, isAdmin } = req.body;

    //if we try to add admin account
    //but token is not admin or token is not attached with request at all
    //we reject request
    const user = checkToken(req);
    if (!user || !user.isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to create account",
      });
    }

    //validate body request
    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0 ||
      typeof isAdmin !== "boolean"
    )
      return res
        .status(400)
        .json({ ok: false, message: "Invalid request body" });

    //check if username is already in database
    const users = readUsersDB();
    const foundUser = users.find((x) => x.username === username);
    if (foundUser)
      return res
        .status(400)
        .json({ ok: false, message: "Username is already taken" });

    const newUser = {
      username,
      password: bcrypt.hashSync(password, 12),
      isAdmin,
      money: isAdmin ? null : 0,
    };

    users.push(newUser);
    writeUsersDB(users);

    //send username back when successfully registered
    return res.json({ ok: true, username, isAdmin });
  }
}
