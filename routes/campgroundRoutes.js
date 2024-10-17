const express = require("express");
const router = express.Router();
const campgroundModel = require("../models/campgroundModel");
const reviewModel = require("../models/reviewModel");
const reviewRoutes = require("../routes/reviewRoutes");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const isAuthor = require("../middlewares/isAuthor");

router.get("/", async (req, res) => {
  let campgrounds = await campgroundModel.find({}).populate("author");
  res.render("./campgrounds/index", { campgrounds });
});

router.get("/show/:id", async (req, res) => {
  const campground = await campgroundModel
    .findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "userid",
        select: "name email",
      },
    })
    .populate("author");
  res.render("./campgrounds/showCamp", { campground });
});

router.get("/create", (req, res) => {
  res.render("./campgrounds/newCampground");
});

router.post("/create", async (req, res) => {
  let { title, location, price, image, description } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await userModel.findOne({ email: decoded.email });
  await campgroundModel.create({
    title: title,
    location: location,
    price: price,
    description: description,
    image: image,
    author: user._id,
  });
  res.redirect("/campgrounds");
});

router.get("/edit/:id", isAuthor, async (req, res) => {
  const campground = await campgroundModel.findById(req.params.id);
  res.render("./campgrounds/editCamp", { campground });
});

router.post("/edit/:id", isAuthor, async (req, res) => {
  let { title, location, price, image, description } = req.body;
  await campgroundModel.findByIdAndUpdate(req.params.id, {
    title: title,
    location: location,
    price: price,
    description: description,
    image: image,
  });
  res.redirect("/campgrounds");
});

router.get("/delete/:id", isAuthor, async (req, res) => {
  let campground = await campgroundModel.findById(req.params.id);
  let reviews = campground.reviews;
  await reviewModel.deleteMany({ _id: { $in: reviews } });
  await campgroundModel.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
});

router.use("/:id/review", reviewRoutes);

module.exports = router;
