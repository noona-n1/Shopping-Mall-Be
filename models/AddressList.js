const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false } // 하위 스키마가 될 현재 스키마에 id개 생성되지 않도록 설정
);

const AddressListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shipto: {
      type: AddressSchema,
      required: true,
    },
  },
  { timestamps: true }
);

AddressListSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

const AddressList = mongoose.model("AddressList", AddressListSchema);
module.exports = AddressList;
