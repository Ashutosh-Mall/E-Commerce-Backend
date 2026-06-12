import User from "../../models/User.js";
import { Request, Response, NextFunction } from "express";
import { apiEnvelope } from "../../utils/ApiEnvelope.js";

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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

    const users = await User.find().select("-password");

    res
      .status(200)
      .json(apiEnvelope(true, "Users fetched successfully", users));
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const admin = await User.findById(userId);

    if (!admin) {
      res.status(404).json(apiEnvelope(false, "User not found"));
      return;
    }

    if (admin.role !== "admin") {
      res.status(403).json(apiEnvelope(false, "Access denied. Admin only."));
      return;
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json(apiEnvelope(false, "User not found"));
      return;
    }

    res.status(200).json(apiEnvelope(true, "User fetched successfully", user));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    const userId = (req as any).userId;
    const admin = await User.findById(userId);

    if (!admin) {
      res.status(404).json(apiEnvelope(false, "User not found"));
      return;
    }

    if (admin.role !== "admin") {
      res.status(403).json(apiEnvelope(false, "Access denied. Admin only."));
      return;
    }

    if (!user) {
      res.status(404).json(apiEnvelope(false, "User not found"));
      return;
    }

    await User.findByIdAndDelete(id);

    res.status(200).json(apiEnvelope(true, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};
