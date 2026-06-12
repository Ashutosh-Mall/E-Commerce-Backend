import { Request, Response, NextFunction } from "express";
import Product from "../models/Product.js";
import redis from "../config/redis.js";
import { apiEnvelope } from "../utils/ApiEnvelope.js";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cachedProduct = await redis.get("product:all");
    if (cachedProduct) {
      res.status(200).json(
        apiEnvelope(
          true,
          "Products fetched from cache",
          JSON.parse(cachedProduct),
        ),
      );
      return;
    }

    const products = await Product.find();

    await redis.set(
      "product:all",
      JSON.stringify(products),
      "EX",
      24 * 60 * 60
    );
    
    res.status(200).json(
      apiEnvelope(true, "Products fetched from DB", products)
    );
  } catch (error) {
    next(error);
  }
};