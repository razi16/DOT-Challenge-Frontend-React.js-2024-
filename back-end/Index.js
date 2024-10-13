require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const userData = require("./src/schema/userSchema");

mongoose.connect(process.env.DB_HOST);

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json(), urlencodedParser);
app.use(cors());

const verifyJWT = (req, res, next) => {
  const token = req.headers["token"]?.split(" ")[1];
  if (!token) {
    res.json({
      isLoggedIn: false,
      message: "Incorrect token given",
    });
  } else {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.json({
          isLoggedIn: false,
          message: "Authentication failed",
        });
      } else {
        req.user = {};
        req.user.username = decoded.username;
        req.user.id = decoded.id;
        next();
      }
    });
  }
};

app.post("/register", async (req, res) => {
  const checkEmail = await userData.findOne({ email: req.body.email });
  if (checkEmail) {
    console.log(checkEmail);
    res.json({
      message: "This email is already registered",
    });
  } else {
    const cryptedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await userData.create({
      email: req.body.email,
      username: req.body.username,
      password: cryptedPassword,
    });
    await newUser.save();
    res.json({
      message: "User created",
    });
  }
});

app.post("/login", async (req, res) => {
  const checkUser = await userData.findOne({ email: req.body.email });
  if (!checkUser) {
    res.json({
      message: "This email doesn't exist in our database",
    });
  } else {
    const checkPassword = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!checkPassword) {
      res.json({
        message: "The password you entered is incorrect",
      });
    } else {
      const payload = {
        id: checkUser._id,
        username: checkUser.username,
      };
      jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: 86400 },
        (err, token) => {
          if (err) {
            res.json({
              message: err,
            });
          } else {
            res.json({ message: "Success", token: "Bearer " + token });
          }
        }
      );
    }
  }
});

app.get("/auth", verifyJWT, (req, res) => {
  res.json({
    isLoggedIn: true,
    id: req.user.id,
    username: req.user.username,
  });
});

app.post("/score", verifyJWT, async (req, res) => {
  let date = new Date();
  const user = await userData.findById(req.user.id);
  user.history.push({ score: req.body.score, time: new Date() });
  if (user.history.length > 5) {
    user.history.shift();
  }
  await user.save();
});

app.get("/score", verifyJWT, async (req, res) => {
  const user = await userData.findById(req.user.id);
  res.json({
    history: user.history,
  });
});

app.post("/save/questions", verifyJWT, async (req, res) => {
  const user = await userData.findById(req.user.id);
  user.lastQuiz.questions = req.body.questions;
  await user.save();
});

app.post("/save/question-count", verifyJWT, async (req, res) => {
  console.log(req.body.questionCount);
  /* const user = await userData.findById(req.user.id);
  user.lastQuiz.questionCount = req.body.questionCount;
  await user.save(); */
});

app.listen(4000);
