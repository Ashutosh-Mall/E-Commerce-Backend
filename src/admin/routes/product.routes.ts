import express from "express";
import { upload } from "../../middleware/multer.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} from "../controllers/product.controller.js";
import { isAuth } from "../../middleware/isAuth.js";

const adminProductRouter = express.Router();
adminProductRouter.post("/add", isAuth, upload.array("images", 4), addProduct);

adminProductRouter.put(
  "/update/:id",
  isAuth,
  upload.array("images", 4),
  updateProduct,
);

adminProductRouter.delete("/delete/:id", isAuth, deleteProduct);

adminProductRouter.get("/get", isAuth, getAllProducts);

adminProductRouter.get("/get/:id", isAuth, getProduct);
export default adminProductRouter;
