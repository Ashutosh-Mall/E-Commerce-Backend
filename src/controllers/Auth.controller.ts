import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import TempUser from "../models/Tempuser.js";
import { apiEnvelope } from "../utils/ApiEnvelope.js";
import User from "../models/User.js";
import Token from "../config/token.js";
import { emailContent } from "../utils/mail.js";
import { emailQueue } from "../config/bullmq.js";
import redis from "../config/redis.js";

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userName, email, password, role } = req.body;

    if (!userName || !email || !password) {
      res.status(400).json(apiEnvelope(false, "All fields are required"));
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json(apiEnvelope(false, "User already exists"));
      return;
    }

    await TempUser.findOneAndDelete({ email });

    const hashedPassword = await bcrypt.hash(password, 8);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await TempUser.create({
      userName,
      email,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      role,
    });

    const htmlContent = emailContent(otp.toString());
    let emailStr: string = email.toString();

    await emailQueue.add(
      "send-email",
      { emailStr, htmlContent },
      { attempts: 3, removeOnComplete: true, removeOnFail: 20 },
    );

    res.status(200).json(apiEnvelope(true, "OTP sent successfully"));

    return;
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json(apiEnvelope(false, "Email and OTP required"));
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json(apiEnvelope(false, "User already exists"));
      return;
    }

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      res.status(400).json(apiEnvelope(false, "OTP expired or not found"));
      return;
    }

    if (tempUser.otp !== otp) {
      res.status(400).json(apiEnvelope(false, "Invalid OTP"));
      return;
    }

    if (tempUser.otpExpires! < new Date()) {
      res.status(400).json(apiEnvelope(false, "OTP expired"));
      return;
    }

    const newUser = await User.create({
      userName: tempUser.userName,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      isVerified: true,
    });

    const { password, ...userObj } = newUser.toObject();

    await TempUser.deleteOne({ email });

    await redis.set(`user:${newUser._id}`, JSON.stringify(userObj), "EX", 3600);

    const token = Token(newUser._id.toString());

    res.cookie("abctoken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json(apiEnvelope(true, "User verified & created", userObj));

    return;
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json(apiEnvelope(false, "Email and Password required"));
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json(apiEnvelope(false, "Invalid credentials"));
      return;
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      res.status(401).json(apiEnvelope(false, "Invalid credentials"));
      return;
    }

    const token = Token(user._id.toString());

    res.cookie("abctoken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...userObj } = user.toObject();

    await redis.set(`user:${user._id}`, JSON.stringify(userObj), "EX", 3600);

    res.status(200).json(apiEnvelope(true, "Login successful", userObj));
    return;
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.clearCookie("abctoken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json(apiEnvelope(true, "Logout successful"));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
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

    const cachedUser = await redis.get(`user:${userId}`);

    if (cachedUser) {
      res
        .status(200)
        .json(
          apiEnvelope(true, "User fetched from cache", JSON.parse(cachedUser)),
        );
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json(apiEnvelope(false, "User not found"));
      return;
    }

    const { password, ...userObj } = user;

    await redis.set(`user:${userId}`, JSON.stringify(userObj), "EX", 3600);

    res
      .status(200)
      .json(apiEnvelope(true, "User fetched successfully", userObj));
  } catch (error) {
    next(error);
  }
};
