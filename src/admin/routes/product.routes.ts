import express from "express";
import { upload } from "../../middleware/multer.js";
import { addProduct } from "../controllers/product.controller.js";
import { isAuth } from "../../middleware/isAuth.js";

const adminProductRouter = express.Router();
adminProductRouter.post(
  "/add",
  isAuth,
  upload.array("images", 4),
  addProduct
);

export default adminProductRouter;