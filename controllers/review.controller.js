const Review = require("../models/Review");

const reviewController = {};

const validateReviewData = (score, productId = null) => {
  if (score === undefined || score === null) {
    throw new Error("Missing required fields");
  }
  if (productId === null) {
    throw new Error("Missing required field: productId");
  }
  if (score < 1 || score > 5) {
    throw new Error("Score must be between 1 and 5");
  }
};

reviewController.createReview = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, content, score } = req.body;

    validateReviewData(score, productId);

    const newReview = await Review({ userId, productId, content, score });
    await newReview.save();
    return res.status(200).json({ status: "success", data: newReview });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

reviewController.getProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    return res
      .status(200)
      .json({ status: "success", count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

reviewController.getMyReview = async (req, res) => {
  try {
    const { userId } = req;
    const reviews = await Review.find({ userId });
    return res
      .status(200)
      .json({ status: "success", count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

reviewController.updateReview = async (req, res) => {
  try {
    const { userId } = req;
    const { content, score } = req.body;
    const { reviewId } = req.params;

    validateReviewData(score, "dummy");

    const existingReview = await Review.findOne({ _id: reviewId, userId });

    if (!existingReview) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found or you don't have permission to update it.",
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: { content, score } },
      { new: true, runValidators: true }
    );

    if (updatedReview) {
      return res.status(200).json({
        status: "success",
        message: "Review updated successfully.",
        data: updatedReview,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Review not found or no changes made.",
      });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = reviewController;
