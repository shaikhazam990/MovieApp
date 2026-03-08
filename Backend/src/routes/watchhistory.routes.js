const express = require("express");
const router = express.Router();
const historyController = require('../controller/watchhistory.controller')
const { authUser } = require("../middlewares/auth.middleware"); 

router.get("/",    authUser, historyController.getHistory);
router.post("/",   authUser, historyController.addToHistory);
router.delete("/", authUser, historyController.clearHistory);

module.exports = router;