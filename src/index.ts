import express, { Application, Request, Response } from "express";
import { env } from "./config/env.js";
import cors from "cors";
import connectDb from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/Auth.route.js";
import adminProductRouter from "./admin/routes/product.routes.js";
import cookieParser from "cookie-parser";
import { apiEnvelope } from "./utils/ApiEnvelope.js";

const startServer = async () => {
  await connectDb();

  const app: Application = express();
  const port = env.PORT || 3000;

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.send("Backend Running");
  });

  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminProductRouter);

  app.use((req: Request, res: Response) => {
    res.status(404).json(apiEnvelope(false, "Route not found"));
  });

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
