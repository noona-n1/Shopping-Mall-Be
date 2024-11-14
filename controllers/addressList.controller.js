const AddressList = require("../models/AddressList");

const addressListController = {};

addressListController.addAddress = async (req, res) => {
  try {
    const { userId } = req;
    const { shipto } = req.body;
    const newAddress = new AddressList({ userId, shipto });
    await newAddress.save();
    return res.status(200).json({ status: "success", data: newAddress });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = addressListController;
