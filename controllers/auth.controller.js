const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const generateToken = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcryptjs.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateToken();
        return res.status(200).json({ status: "success", user, token });
      }
    }
    throw new Error("invaild email or password");
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) throw new Error("token not found");
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) throw new Error("invaild token");
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = authController;
