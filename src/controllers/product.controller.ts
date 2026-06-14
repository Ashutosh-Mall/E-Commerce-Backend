import { Request, Response, NextFunction } from "express";
import Product from "../models/Product.js";
import redis from "../config/redis.js";
import { apiEnvelope } from "../utils/ApiEnvelope.js";
import Cart from "../models/Cart.js";
import mongoose from "mongoose";
import Order from "../models/Order.js";
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cachedProduct = await redis.get("product:all");
    if (cachedProduct) {
      res
        .status(200)
        .json(
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
      24 * 60 * 60,
    );

    res
      .status(200)
      .json(apiEnvelope(true, "Products fetched from DB", products));
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const { quantity } = req.body;

    if (!userId) {
      res.status(401).json(apiEnvelope(false, "Unauthorized"));
      return;
    }

    if (!id) {
      res.status(400).json(apiEnvelope(false, "Product ID missing"));
      return;
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: id as any,
            quantity: 1,
          },
        ],
      });

      res
        .status(201)
        .json(apiEnvelope(true, "Cart created and item added", cart));
      return;
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: id as any,
        quantity: 1,
      });
    }

    await cart.save();

    res.status(200).json(apiEnvelope(true, "Cart updated", cart));
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json(apiEnvelope(false, "Unauthorized"));
      return;
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      res.status(400).json(apiEnvelope(false, "Cart is empty"));
      return;
    }

    let totalAmount = 0;

    const orderItems = cart.items.map((item: any) => {
      const price = item.product.price; 
      totalAmount += price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price,
      };
    });

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      orderStatus: "pending",
      paymentStatus: "pending",
    });

    cart.items = [];
    await cart.save();

    res
      .status(201)
      .json(apiEnvelope(true, "Order created successfully", order));
  } catch (error) {
    next(error);
  }
};
