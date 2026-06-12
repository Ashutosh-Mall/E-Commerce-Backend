import { Router } from "express";
import { sendOtp, verifyOtp, login, logout, getMe } from "../controllers/Auth.controller.js";
import { isAuth } from "../middleware/isAuth.js";


const authRouter = Router();
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/login", login);
authRouter.post("/logout",logout);
authRouter.get("/getme",isAuth, getMe);

export default authRouter;