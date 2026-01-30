import { categories } from "@/generated/schema1";
import { authenticateToken } from "@/middlewares/auth";
import { db1 } from "@/utils/db1";
import { Request, Response } from "express";

export const get = [
  authenticateToken,
  async (req: Request, res: Response) => {
    if (req.method !== "GET") return res.status(405);

    try {
      const data = await db1.categories.findMany();

      return res.json({
        status: true,
        data,
      });
    } catch (error) {
      return res.json({
        status: false,
        error,
      });
    }
  },
];

export const post = [
  authenticateToken,
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    try {
      const data: Partial<categories> = {
        name: req.body.name,
        user_id: req.body.user_id,
      };

      await db1.categories.create({
        data,
      });

      return res.json({
        status: true,
      });
    } catch (error) {
      return res.json({
        status: false,
        error,
      });
    }
  },
];
