const Like = require("../models/Like");

const likeController = {};

likeController.addLike = async (req, res) => {
  try {
    const { userId } = req;
    const { productId } = req.body;

    const newLike = await Like({ userId, productId });
    await newLike.save();
    return res
      .status(200)
      .json({ status: "success", message: "Like added successfully." });
  } catch (error) {
    if (error.code === 11000) {
      // 중복 좋아요인 경우
      return res.status(400).json({
        status: "fail",
        message: "You have already liked this product.",
      });
    }
    return res.status(500).json({ status: "fail", error: error.message });
  }
};

module.exports = likeController;
