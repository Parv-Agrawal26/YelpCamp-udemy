const express = require("express");
const router = express.Router();
require("dotenv").config();
const campgroundModel = require("../models/campgroundModel");
const reviewModel = require("../models/reviewModel");
const reviewRoutes = require("../routes/reviewRoutes");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const isAuthor = require("../middlewares/isAuthor");

const { cloudinary, storage } = require("../config/cloudinary");
const multer = require("multer");
const upload = multer({ storage});


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

router.post("/create",upload.single('image'), async (req, res) => {
  let { title, location, price, image, description } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await userModel.findOne({ email: decoded.email });
  const response = await fetch(
    `https://api.maptiler.com/geocoding/${location}.json?key=${process.env.MAPTILER_API_KEY}`
  );
  const data = await response.json();
  await campgroundModel.create({
    title: title,
    location: location,
    price: price,
    description: description,
    image: req.file.path,
    author: user._id,
    long: data.features[0].geometry.coordinates[0],
    lat: data.features[0].geometry.coordinates[1],
  });
  res.redirect("/campgrounds");
});

router.get("/edit/:id", isAuthor, async (req, res) => {
  const campground = await campgroundModel.findById(req.params.id);
  res.render("./campgrounds/editCamp", { campground });
});

router.post("/edit/:id", isAuthor,upload.single('image'), async (req, res) => {
  let { title, location, price, image, description } = req.body;
  await campgroundModel.findByIdAndUpdate(req.params.id, {
    title: title,
    location: location,
    price: price,
    description: description,
  });
  if(req.file){
    await campgroundModel.findByIdAndUpdate(req.params.id, {
      image: req.file.path,
    });
  }
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
