const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const likeController = require("../controllers/like.controller");

router.use(authController.authenticate);

router.post("/", likeController.toggleLike);
router.get("/", likeController.getLikeList);

module.exports = router;
