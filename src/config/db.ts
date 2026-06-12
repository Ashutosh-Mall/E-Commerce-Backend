import mongoose from "mongoose";
import { env } from "./env.js";
const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDb;
