import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";
export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || !user.isAdmin)
      return res.status(403).json({ ok: false, message: "Permission denied" });
    //compute DB summary
    const users = readUsersDB();
    let userCount = 0;
    let adminCount = 0;
    let totalMoney = 0;
    users.forEach((x) => {
      if (x.isAdmin) adminCount++;
      else {
        userCount++;
        totalMoney += x.money;
      }
    });
    //return response
    return res.status(200).json({
      ok: true,
      userCount: userCount,
      adminCount: adminCount,
      totalMoney: totalMoney,
    });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
