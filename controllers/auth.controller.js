const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const generateToken = require("../models/User");

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

module.exports = authController;
