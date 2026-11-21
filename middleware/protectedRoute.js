import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
export async function protectedRoute(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  try {
    const accessToken = authorization.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized: Invalid access token",
      });
    }
    const { userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(401).json({ message: "Unauthorized: User not found" });
    req.user = user;
    next();
  } catch (err) {
    console.log("error in the protected route ", err);
    if (
      err.name === "TokenExpiredError" ||
      err.name === "JsonWebTokenError" ||
      err.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired access token",
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
}
