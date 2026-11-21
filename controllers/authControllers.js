import UserModel from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function signUpController(req, res) {
  const { email, name, password } = req.body;
  if (!email.trim() || !name?.trim() || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    let user = await UserModel.findOne({ email });
    if (user) return res.status(409).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await UserModel.create({ name, email, password: hashedPassword });
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const { password: _, ...safeUser } = user.toObject();
    return res.status(201).json({
      message: "User created successfully",
      accessToken,
      user: safeUser,
    });
  } catch (err) {
    console.log("error in the sign controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// login controller
export async function loginController(req, res) {
  const { email, password } = req.body;
  if (!email?.trim() || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const { password: _, ...safeUser } = user.toObject();
    return res
      .status(200)
      .json({ message: "Logged in successfully", accessToken, user: safeUser });
  } catch (err) {
    console.log("error in login controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// logout controller
export async function logoutController(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "logged successfully" });
}
