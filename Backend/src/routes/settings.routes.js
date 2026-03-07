const express      = require("express");
const router       = express.Router();
const ctrl         = require("../controller/settings.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.get("/profile",    authUser, ctrl.getProfile);
router.put("/profile",    authUser, ctrl.updateProfile);
router.put("/password",   authUser, ctrl.changePassword);
router.delete("/account", authUser, ctrl.deleteAccount);

module.exports = router;