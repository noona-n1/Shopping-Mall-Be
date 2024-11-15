const Review = require("../models/Review");

const reviewController = {};

reviewController.createReview = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, content, score } = req.body;

    if (!productId || score == undefined || score === null) {
      return res
        .status(400)
        .json({ status: "fail", message: "Missing required fields" });
    }

    if (score < 1 || score > 5) {
      return res
        .status(400)
        .json({ status: "fail", message: "Score between 1 and 5" });
    }

    const newReview = await Review({ userId, productId, content, score });
    await newReview.save();
    return res.status(200).json({ status: "success", data: newReview });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = reviewController;
