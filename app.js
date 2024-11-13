const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routers/index");
const app = express();

require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let dbConnected = false; // MongoDB 연결 상태를 추적하기 위한 변수

// MongoDB 연결
const mongoURI = process.env.MONGODB_URI_PROD;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongoose connected");
    dbConnected = true; // 연결 성공 시 상태 변경
  })
  .catch((err) => {
    console.log("DB connection fail", err);
    dbConnected = false; // 연결 실패 시 상태 변경
  });

// 루트 경로 응답 - MongoDB 연결 상태 포함
app.get("/", (req, res) => {
  const statusMessage = dbConnected
    ? "MongoDB is connected."
    : "MongoDB is not connected.";
  res.status(200).send(`Welcome to the API! ${statusMessage}`);
});

// 라우터 설정
app.use("/api", indexRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

