const User = require("../model/user.model");

// ─────────────────────────────────────────
// GET all users — /api/admin/users
// ─────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    // Password field return mat karo
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// PUT ban user — /api/admin/users/:id/ban
// ─────────────────────────────────────────
const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Admin ko ban nahi kar sakte
    if (user.isAdmin) return res.status(400).json({ message: "Cannot ban an admin" });

    user.isBanned = true;
    await user.save();

    res.json({ message: "User banned" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// PUT unban user — /api/admin/users/:id/unban
// ─────────────────────────────────────────
const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = false;
    await user.save();

    res.json({ message: "User unbanned" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// DELETE user — /api/admin/users/:id
// ─────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isAdmin) return res.status(400).json({ message: "Cannot delete an admin" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllUsers, banUser, unbanUser, deleteUser };