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
        .status(404)
        .json({ status: "fail", message: "No addresses found." });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

addressListController.deleteAddress = async (req, res) => {
  try {
    const { userId } = req;
    const { addressId } = req.body;

    const deleteAddress = await AddressList.deleteOne({
      _id: addressId,
      userId,
    });
    if (deleteAddress.deletedCount > 0) {
      return res.status(200).json({
        status: "success",
        message: "The address has been successfully deleted.",
      });
    } else {
      return res
        .status(404)
        .json({ status: "fail", message: "Address not found." });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

addressListController.updateAddress = async (req, res) => {
  try {
    const { addressId, shipto } = req.body;

    const existingAddress = await AddressList.findById(addressId);
    if (!existingAddress) {
      return res
        .status(404)
        .json({ status: "fail", message: "Address not found." });
    }

    const updateAddress = await AddressList.updateOne(
      { _id: addressId },
      {
        $set: {
          "shipto.address": shipto.address,
          "shipto.city": shipto.city,
          "shipto.zip": shipto.zip,
        },
      }
    );
    if (updateAddress.modifiedCount > 0) {
      return res
        .status(200)
        .json({ status: "success", message: "Address updated successfully." });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Address not found or no changes made.",
      });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = addressListController;
