const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

const userSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unipue: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, requierd: true },
    name: { type: String, required: true },
    level: {
      type: String,
      requierd: true,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
