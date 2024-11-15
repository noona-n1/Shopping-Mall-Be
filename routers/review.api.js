const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const reviewController = require("../controllers/review.controller");

router.use(authController.authenticate);

router.post("/", reviewController.createReview);

module.exports = router;
