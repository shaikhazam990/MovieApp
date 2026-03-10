const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../model/blacklist.model");
const redis = require("../config/cache");

function generateToken(user) {
  return jwt.sign(
    {
      id:       user._id,
      username: user.username,
      isAdmin:  user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };
}

async function registerController(req, res) {
  try {
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

    // ✅ Yeh line add karo
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,  // ✅ plain nahi, hashed save karo
    });

    const token = generateToken(user);
    res.cookie("token", token, cookieOptions());

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
        isAdmin:  user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// LOGIN
async function loginController(req, res) {
  try {
    const { email, username, password } = req.body;

    const user = await userModel
      .findOne({ $or: [{ username }, { email }] })
      .select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Your account has been banned" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.cookie("token", token, cookieOptions());

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
        isAdmin:  user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET ME
async function getMeController(req, res) {
  try {
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
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// LOGOUT
async function logoutController(req, res) {
  try {
    const token = req.cookies.token;
    res.clearCookie("token");
    await redis.set(token, Date.now().toString(), "EX", 60 * 60);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function guestLoginController(req, res) {
  try {
    let guest = await userModel.findOne({ email: "guest@movieverse.com" });

    // Agar guest account nahi hai toh banao
    if (!guest) {
      const hashedPassword = await bcrypt.hash("guest123456", 10);
      guest = await userModel.create({
        username: "Guest User",
        email:    "guest@movieverse.com",
        password: hashedPassword,
      });
    }

    const token = generateToken(guest);
    res.cookie("token", token, cookieOptions());

    return res.status(200).json({
      message: "Guest login successful",
      user: {
        id:       guest._id,
        username: guest.username,
        email:    guest.email,
        isAdmin:  guest.isAdmin,
        isGuest:  true,
      },
    });
  } catch (error) {
    console.error("Guest login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  registerController,
  loginController,
  getMeController,
  logoutController,
  guestLoginController
};