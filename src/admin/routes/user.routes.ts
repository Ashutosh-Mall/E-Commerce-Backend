import express from "express";
import {
  getAllUser,
  getUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { isAuth } from "../../middleware/isAuth.js";

const adminUserRouter = express.Router();

adminUserRouter.get("/all", isAuth, getAllUser);
adminUserRouter.get("/:id", isAuth, getUser);
adminUserRouter.delete("/:id", isAuth, deleteUser);

export default adminUserRouter;
