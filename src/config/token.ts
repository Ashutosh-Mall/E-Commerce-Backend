import jwt from "jsonwebtoken";
import { env } from "./env.js";

const Token = (_id: string): string => {
  const token = jwt.sign({ _id }, env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return token;
};

export default Token;
