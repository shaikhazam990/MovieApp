const express = require("express");
const router = express.Router();
const favoriteController = require("../controller/favorite.controller");
const { authUser } = require("../middlewares/auth.middleware"); 

router.get("/",           authUser, favoriteController.getFavorites);
router.post("/",          authUser, favoriteController.addFavorite);
router.delete("/:tmdbId", authUser, favoriteController.removeFavorite);

module.exports = router;