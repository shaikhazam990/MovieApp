const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.controller");
const { authUser } = require("../middlewares/auth.middleware"); 
const isAdmin = require("../middlewares/admin.middleware");

router.get("/users",           authUser, isAdmin, adminController.getAllUsers);
router.put("/users/:id/ban",   authUser, isAdmin, adminController.banUser);
router.put("/users/:id/unban", authUser, isAdmin, adminController.unbanUser);
router.delete("/users/:id",    authUser, isAdmin, adminController.deleteUser);

module.exports = router;