import { todos } from "@/generated/schema1";
import { db1 } from "@/utils/db1";
import { Request, Response } from "express";

export const get = async (req: Request, res: Response) => {
  if (req.method !== "GET") return res.status(405);

  try {
    const id = req.params.id;

    const data = await db1.todos.findUnique({
      where: {
        id: +id,
      },
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "data not found",
      });
    }

    return res.json({
      status: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error,
    });
  }
};

export const put = async (req: Request, res: Response) => {
  if (req.method !== "PUT") return res.status(405);

  try {
    const id = req.params.id;

    const current = await db1.todos.findFirst({
      where: {
        id: +id,
      },
    });

    if (!current) {
      return res.status(404).json({
        status: false,
        message: "data not found",
      });
    }

    const data: Partial<todos> = {
      title: req.body.title || current.title,
      due_date: req.body.due_date
        ? new Date(req.body.due_date)
        : current.due_date,
      description: req.body.description || current.description,
      priority: req.body.priority || current.priority,
      status: req.body.status || current.status,
      category_id: req.body.category_id || current.category_id,
      user_id: req.body.user_id || current.user_id,
    };

    const update = await db1.todos.update({
      where: {
        id: +id,
      },
      data,
    });

    return res.json({
      status: true,
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error,
    });
  }
};

export const del = async (req: Request, res: Response) => {
  if (req.method !== "DELETE") return res.status(405);

  try {
    const id = req.params.id;

    const data = await db1.todos.findUnique({
      where: {
        id: +id,
      },
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "data not found",
      });
    }

    const del = await db1.todos.delete({
      where: {
        id: +id,
      },
    });

    return res.json({
      status: true,
      data: del,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error,
    });
  }
};
