import { authenticateToken } from "@/middlewares/auth";
import { CustomRequest } from "@/types";
import { db1 } from "@/utils/db1";
import { Response } from "express";

export const get = [
  authenticateToken,
  async (req: CustomRequest, res: Response) => {
    const userId = req.user.id;
    const userName = req.query.user_name;

    const result = await db1.$queryRaw`
            SELECT todos.*
            FROM todos
            INNER JOIN users
            ON todos.user_id = users.id
            WHERE users.name = ${userName}
        `;

    return res.json({
      data: result,
    });
  },
];
