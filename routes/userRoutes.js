const express = require("express");
const router = express.Router({ mergeParams: true });
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/register", (req, res) => {
  res.render("./users/registerForm");
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const checkUser = await userModel.findOne({ email: email });
  if (checkUser) {
    res.redirect("/user/login");
  } else {
    bcrypt.hash(password, 10, async function (err, hash) {
      const user = await userModel.create({
        name: name,
        email: email,
        password: hash,
      });
      let token = await jwt.sign({ email: user.email }, process.env.JWT_KEY);
      res.cookie("token", token);
      res.redirect("/");
    });
  }
});

router.get("/login", (req, res) => {
  res.render("./users/loginForm");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const check = await userModel.findOne({ email: email });
  if (!check) {
    res.redirect("/");
  } else {
    const user = await userModel.findOne({ email: email });
    bcrypt.compare(password, user.password, async function (err, result) {
      if (result == true) {
        let token = await jwt.sign({ email: user.email }, process.env.JWT_KEY);
        res.cookie("token", token);
        res.redirect("/");
      } else {
        res.redirect("/user/login");
      }
    });
  }
});

router.get("/profile/:userid", isLoggedIn, async (req, res) => {
  const user = await userModel.findById(req.params.userid);
  res.render("profile", { user });
});

router.get("/logout/:userid", isLoggedIn, (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

module.exports = router;
