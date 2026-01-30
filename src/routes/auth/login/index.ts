import { config } from "@/config";
import { db1 } from "@/utils/db1";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const post = async (req: Request, res: Response) => {
  if (req.method !== "POST") return res.status(405);

  const { username, password } = req.body;

  const user = await db1.users.findFirst({
    where: {
      email: username,
    },
  });

  if (!user) {
    return res.json({
      status: false,
      error: "User not found",
    });
  }

  const userCopy = { ...user };
  delete userCopy.password_hash;

  const token = jwt.sign(userCopy, config.jwtSecret, {
    expiresIn: "24h",
  });

  return res.json({
    status: true,
    data: { ...userCopy, token },
  });
};
