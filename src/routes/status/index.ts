import { todos_status } from "@/generated/schema1";
import { Request, Response } from "express";

export const get = async (req: Request, res: Response) => {
  if (req.method !== "GET") return res.status(405);

  try {
    return res.json({
      status: true,
      data: Object.values(todos_status),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error,
    });
  }
};
