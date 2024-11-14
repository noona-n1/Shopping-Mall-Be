const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const likeController = require("../controllers/like.controller");

router.post("/", authController.authenticate, likeController.addLike);

module.exports = router;
