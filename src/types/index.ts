import type { Request } from "express";
import { users } from "@/generated/schema1";

export interface CustomRequest extends Request {
  user: users;
}
