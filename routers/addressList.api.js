const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const addressListController = require("../controllers/addressList.controller");

router.post("/", authController.authenticate, addressListController.addAddress);
router.get("/", authController.authenticate, addressListController.getAddress);
router.delete(
  "/",
  authController.authenticate,
  addressListController.deleteAddress
);

module.exports = router;
