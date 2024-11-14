const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// 사용자와 제품의 조합을 유니크하게 만들어 한 사용자가 동일한 제품에 대해 중복으로 좋아요 누르지 못하게 함
likeSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
