import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",

  MONGODB_URI: process.env.MONGO_URI!,

  JWT_SECRET: process.env.JWT_SECRET!,

  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,

  FRONTEND_URL: process.env.FRONTEND_URL!,
  REDIS_URL: process.env.REDIS_URL!,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
};
