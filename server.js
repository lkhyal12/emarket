import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connectToDB.js";
dotenv.config();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log("server is running in port " + PORT);
});
