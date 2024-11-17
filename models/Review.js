const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
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
    content: { type: String },
    score: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

ReviewSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
