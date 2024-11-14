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

addressListController.getAddress = async (req, res) => {
  try {
    const { userId } = req;
    const addresses = await AddressList.find({ userId });
    if (addresses.length > 0) {
      return res.status(200).json({ status: "success", data: addresses });
    } else {
      return res
        .status(200)
        .json({ status: "success", message: "저장된 주소가 없습니다." });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = addressListController;
