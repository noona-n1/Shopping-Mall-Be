const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const reviewController = require("../controllers/review.controller");

router.post("/", authController.authenticate, reviewController.createReview);
router.get("/:product_id", reviewController.getProductReview);

module.exports = router;
