import fs from "fs";
import path from "path";
import { todos } from "@/generated/schema1";
import { authenticateToken } from "@/middlewares/auth";
import { CustomRequest } from "@/types";
import { db1 } from "@/utils/db1";
import { Response } from "express";

export const get = [
  authenticateToken,
  async (req: CustomRequest, res: Response) => {
    if (req.method !== "GET") return res.status(405);

    try {
      const data = await db1.todos.findMany({
        where: {
          user_id: req.user.id,
        },
      });

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
  async (req: CustomRequest, res: Response) => {
    try {
      const uploadDir = path.join(process.cwd(), "uploads/todos");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploaded = req.files?.file;

      let filePath: string | null = null;

      if (uploaded) {
        const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

        const ext = path.extname(file.name);
        const filename = `${Date.now()}${ext}`;
        const savePath = path.join(uploadDir, filename);

        await file.mv(savePath);

        filePath = `uploads/todos/${filename}`;
      }
      const data: Partial<todos> = {
        title: req.body.title,
        due_date: req.body.due_date ? new Date(req.body.due_date) : null,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        category_id: req.body.category_id ? Number(req.body.category_id) : null,
        user_id: req.user.id,
        file: filePath,
      };

      await db1.todos.create({ data });

      return res.json({
        status: true,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        error,
      });
    }
  },
];
