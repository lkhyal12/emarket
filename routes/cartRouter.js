import express from "express";
import { getCartController } from "../controllers/cartControllers";

const cartRouter = express();
cartRouter.get("/", getCartController);
export default cartRouter;
