import { authenticateToken } from "@/middlewares/auth";
import { CustomRequest } from "@/types";
import { db1 } from "@/utils/db1";
import { Response } from "express";
import { emit } from "@/websocket";
import { saveUpload } from "@/utils/upload";

export const get = [
  // authenticateToken,
  async (req: CustomRequest, res: Response) => {
    if (req.method !== "GET") return res.status(405);

    try {
      const data = await db1.todos.findMany({
        // where: {
        //   user_id: req.user.id,
        // },
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
  // authenticateToken,
  async (req: CustomRequest, res: Response) => {
    try {
      const uploaded = req.files?.file;
      // console.log(req.body);
      // console.log(req.files);

      if (!uploaded) {
          req.body.filePath = null;
      } else{
        const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
        req.body.filePath = await saveUpload(file, "storage/uploads/todos");
      }

      await db1.todos.create({
        data: {
          title: req.body.title,
          due_date: req.body.due_date ? new Date(req.body.due_date) : null,
          description: req.body.description,
          priority: req.body.priority,
          status: req.body.status,
          category_id: req.body.category_id ? Number(req.body.category_id) : null,
          // user_id: req.user.id,
          user_id: req.body.user_id ? Number(req.body.user_id) : null,
          file: req.body.filePath,
        },
      });

      // emit({
      //   type: "todo.created",
      //   data: {
      //     title: req.body.title,
      //     userId: req.user.id,
      //   },
      // });

      return res.json({ status: true });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: false,
        error,
      });
    }
  },
]