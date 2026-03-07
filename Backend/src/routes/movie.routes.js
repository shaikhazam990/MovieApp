const express = require("express");
const router = express.Router();
const movieController = require("../controller/movie.controller");
const { authUser } = require("../middlewares/auth.middleware"); 
const isAdmin = require("../middlewares/admin.middleware");

// Public — koi bhi dekh sakta hai
router.get("/",    movieController.getAllMovies);
router.get("/:id", movieController.getMovieById);

// Admin only
router.post("/",      authUser, isAdmin, movieController.addMovie);
router.put("/:id",    authUser, isAdmin, movieController.updateMovie);
router.delete("/:id", authUser, isAdmin, movieController.deleteMovie);

module.exports = router;