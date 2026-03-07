const express      = require("express");
const router       = express.Router();
const controller   = require("../controller/watchlist.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.get("/",           authUser, controller.getWatchlist);
router.post("/",          authUser, controller.addToWatchlist);
router.delete("/:tmdbId", authUser, controller.removeFromWatchlist);

module.exports = router;