const express = require("express");
const router = express.Router();

const userApi = require("./user.api");
const authApi = require("./auth.api");
const productApi = require("./product.api");
const addressListApi = require("./addressList.api");
const likeApi = require("./like.api");
const reviewApi = require("./review.api");

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/product", productApi);
router.use("/addresses", addressListApi);
router.use("/like", likeApi);
router.use("/review", reviewApi);

module.exports = router;
