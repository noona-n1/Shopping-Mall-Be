const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const generateToken = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client, auth } = require("google-auth-library");
const {
  randomBcryptjsPasswordGenerator,
} = require("../utils/randomBcryptjsPasswordGenerator");
const axios = require("axios");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

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

authController.loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      const newPassword = await randomBcryptjsPasswordGenerator();

      user = new User({
        name,
        email,
        password: newPassword,
      });
      await user.save();
    }
    const sessionToken = await user.generateToken();
    return res
      .status(200)
      .json({ status: "success", user, token: sessionToken });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

authController.loginWithKakao = async (req, res) => {
  try {
    const { token } = req.body;

    // 카카오 사용자 정보 요청
    const kakaoUserResponse = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { id, properties, kakao_account } = kakaoUserResponse.data;
    const email = kakao_account.email;
    const name = properties.nickname;

    let user = await User.findOne({ email });
    if (!user) {
      const newPassword = await randomBcryptjsPasswordGenerator();
      user = new User({
        name,
        email,
        password: newPassword,
        kakaoId: id, // 카카오 사용자 고유 ID 저장
      });
      await user.save();
    }

    const sessionToken = await user.generateToken();
    return res
      .status(200)
      .json({ status: "success", user, token: sessionToken });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

const qs = require("qs");
authController.handleKakaoCallback = async (req, res) => {
  try {
    // 1. 카카오가 전달한 인증 코드 추출
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code not provided" });
    }
    console.log("카카오 인증 코드:", code);

    // 2. 카카오에 액세스 토큰 요청
    const payload = qs.stringify({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_CLIENT_ID, // 카카오 REST API 키
      redirect_uri: "http://localhost:5001/api/auth/kakao/callback",
      code,
    });

    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      payload,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token } = tokenResponse.data;
    console.log("카카오 액세스 토큰:", access_token);

    // 3. 액세스 토큰으로 카카오 사용자 정보 요청
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userInfo = userResponse.data;
    console.log("카카오 사용자 정보:", userInfo);

    // 4. 사용자 정보로 로그인 처리 또는 신규 회원가입
    // 예: 데이터베이스에 사용자 저장 또는 JWT 발급
    const user = {
      id: userInfo.id,
      email: userInfo.kakao_account.email,
      nickname: userInfo.properties.nickname,
    };

    // 5. 클라이언트에 응답
    return res.status(200).json({
      message: "로그인 성공",
      user,
      tokens: {
        access_token,
        refresh_token,
      },
    });
  } catch (error) {
    console.error(
      "카카오 콜백 처리 중 오류:",
      error.response?.data || error.message
    );
    return res.status(400).json({
      status: "fail",
      error: error.response?.data || error.message,
    });
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (user.level !== "admin") {
      throw new Error("User is not admin");
    }
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = authController;
