const express = require("express")
const router = express.Router()
const campgroundModel = require("../models/campgroundModel")

router.get("/",async (req,res)=>{
  let campgrounds = await campgroundModel.find({})
  res.render("./campgrounds/index",{campgrounds})
})

router.get("/show/:id",async (req,res)=>{
  const campground = await campgroundModel.findById(req.params.id)
  res.render("./campgrounds/showCamp",{campground})
})

router.get("/create", (req, res) => {
  res.render("./campgrounds/newCampground");
});

router.post("/create",async (req,res)=>{
  let {title, location} = req.body
  await campgroundModel.create({
    title:title,
    location:location
  })
  res.redirect("/campgrounds")
})

router.get("/edit/:id", async (req, res) => {
  const campground = await campgroundModel.findById(req.params.id);
  res.render("./campgrounds/editCamp", { campground });
});

router.post("/edit/:id", async (req, res) => {
  let {title, location} = req.body
  await campgroundModel.findByIdAndUpdate(req.params.id,{title:title, location:location})
  res.redirect("/campgrounds")
});

router.get("/delete/:id", async (req, res)=>{
  await campgroundModel.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds")
})

module.exports = router