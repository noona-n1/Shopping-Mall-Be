const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const reviewController = require("../controllers/review.controller");

router.post("/", authController.authenticate, reviewController.createReview);
router.get("/:productId", reviewController.getProductReview);
router.get("/", authController.authenticate, reviewController.getMyReview);
router.put(
  "/:reviewId",
  authController.authenticate,
  reviewController.updateReview
);

module.exports = router;
