import { categories } from "@/generated/schema1";
import { db1 } from "@/utils/db1";
import { Request, Response } from "express";

export const get = async (req: Request, res: Response) => {
  if (req.method !== "GET") return res.status(405);

  try {
    const id = req.params.id;

    const data = await db1.categories.findUnique({
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

    const current = await db1.categories.findFirst({
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

    const data: Partial<categories> = {
      name: req.body.name || current.name,
      user_id: req.body.user_id || current.user_id,
    };

    const update = await db1.categories.update({
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

    const data = await db1.categories.findUnique({
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

    const del = await db1.categories.delete({
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
