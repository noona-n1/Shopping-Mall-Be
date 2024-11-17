const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const addressListController = require("../controllers/addressList.controller");

router.use(authController.authenticate);

router.post("/", addressListController.addAddress);
router.get("/", addressListController.getAddress);
router.delete("/", addressListController.deleteAddress);
router.put("/", addressListController.updateAddress);

module.exports = router;
