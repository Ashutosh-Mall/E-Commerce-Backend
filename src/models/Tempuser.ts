import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TempuserSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const TempUser = mongoose.model<IUser>("TempUser", TempuserSchema);

export default TempUser;
