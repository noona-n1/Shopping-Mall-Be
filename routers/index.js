const express = require("express");
const router = express.Router();

const userApi = require("./user.api");
const authApi = require("./auth.api");
const productApi = require("./product.api");
const addressListApi = require("./addressList.api");

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/product", productApi);
router.use("/addresses", addressListApi);

module.exports = router;
