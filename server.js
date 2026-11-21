import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connectToDB.js";
import authRouter from "./routes/authRouter.js";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);

app.use("/api/auth", authRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log("server is running in port " + PORT);
});
