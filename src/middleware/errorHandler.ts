import { Request, Response, NextFunction } from "express";
import { apiEnvelope } from "../utils/ApiEnvelope.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("ERROR LOG:", err);
  const statusCode = err?.statusCode || 500;
  res
    .status(statusCode)
    .json(apiEnvelope(false, err?.message || "Server Error"));
};
