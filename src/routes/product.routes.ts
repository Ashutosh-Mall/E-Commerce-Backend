import { Router } from "express";
import { getAllProducts } from "../controllers/product.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const productRouter = Router();
productRouter.get("/", isAuth, getAllProducts);

export default productRouter;