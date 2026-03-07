const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../model/blacklist.model");
const redis = require("../config/cache");

// ─────────────────────────────────────────
// Helper — token banao
// isAdmin bhi JWT mein daalo taaki middleware check kar sake
// ─────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    {
      id:       user._id,
      username: user.username,
      isAdmin:  user.isAdmin,  // ✅ isAdmin add kiya
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
}

// ─────────────────────────────────────────
// Cookie options
// ─────────────────────────────────────────
function cookieOptions() {
  return {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };
}

// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────
async function registerController(req, res) {
  const { username, email, password } = req.body;

  const isAllExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAllExist) {
    return res.status(400).json({
      message:
        isAllExist.email === email
          ? "Email already exists"
          : "Username already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = generateToken(user); // ✅ isAdmin included now
  res.cookie("token", token, cookieOptions());

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id:       user._id,
      username: user.username,
      email:    user.email,
      isAdmin:  user.isAdmin,  // ✅ frontend ko bhi pata chale
    },
  });
}

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
async function loginController(req, res) {
  const { email, username, password } = req.body;

  const user = await userModel
    .findOne({ $or: [{ username }, { email }] })
    .select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Banned user check
  if (user.isBanned) {
    return res.status(403).json({ message: "Your account has been banned" });
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user); // ✅ isAdmin included now
  res.cookie("token", token, cookieOptions());

  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      id:       user._id,
      username: user.username,
      email:    user.email,
      isAdmin:  user.isAdmin,  // ✅ frontend ko bhi pata chale
    },
  });
}

// ─────────────────────────────────────────
// GET ME — logged in user ki info
// ─────────────────────────────────────────
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User fetched successfully",
    user: {
      id:       user._id,
      username: user.username,
      email:    user.email,
      isAdmin:  user.isAdmin,
      isBanned: user.isBanned,
    },
  });
}

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
async function logoutController(req, res) {
  const token = req.cookies.token;
  res.clearCookie("token");

  // Token blacklist mein daalo — 1 ghante ke liye
  await redis.set(token, Date.now().toString(), "EX", 60 * 60);

  res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
  registerController,
  loginController,
  getMeController,
  logoutController,
};