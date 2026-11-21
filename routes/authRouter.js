import express from "express";
import {
  getProfile,
  loginController,
  logoutController,
  signUpController,
} from "../controllers/authControllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const authRouter = express.Router();

authRouter.post("/sign-up", signUpController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/profile", protectedRoute, getProfile);
export default authRouter;
