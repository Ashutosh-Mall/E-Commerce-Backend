import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { Request, Response, NextFunction } from "express";
import { uploadOnCloudinary } from "../../config/cloudinary.js";
import redis from "../../config/redis.js";
import { apiEnvelope } from "../../utils/ApiEnvelope.js";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, price, stock, category } = req.body;

    const userId = (req as any).userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json(apiEnvelope(false, "user not found"));
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json(apiEnvelope(false, "Access denied. Admin only."));
      return;
    }

    const files = req.files as Express.Multer.File[] | undefined;

    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map(async (file) => {
          const uploaded = await uploadOnCloudinary(file.path);
          return uploaded || "";
        }),
      );
    }

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      images: imageUrls,
      averageRating: 0,
    });

    await redis.del("product:all");

    res
      .status(201)
      .json(apiEnvelope(true, "Product created successfully", product));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json(apiEnvelope(false, "user not found"));
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json(apiEnvelope(false, "Access denied. Admin only."));
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json(apiEnvelope(false, "Product not found"));
      return;
    }

    const { title, description, price, stock, category } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    const files = req.files as Express.Multer.File[] | undefined;

    if (files && files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploaded = await uploadOnCloudinary(file.path);
          return uploaded || "";
        }),
      );

      product.images = [...uploadedImages, ...product.images]
        .filter(Boolean)
        .slice(0, 4);
    }

    await product.save();

    await redis.del("product:all");

    res.status(200).json(apiEnvelope(true, "Product updated successfully", product));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json(apiEnvelope(false, "User not found"));
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json(apiEnvelope(false, "Access denied. Admin only."));
      return;
    }
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json(apiEnvelope(false, "Product not found"));
      return;
    }

    await Product.findByIdAndDelete(id);

    await redis.del("product:all");

    res.status(200).json(apiEnvelope(true, "Product deleted successfully"));
  } catch (error) {
    next(error);
  }
};

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
