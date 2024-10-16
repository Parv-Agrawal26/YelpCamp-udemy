const express = require("express")
const campgroundModel = require("../models/campgroundModel")
const reviewModel = require("../models/reviewModel")
const router = express.Router({ mergeParams: true });
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const canDeleteReview = require("../middlewares/isReviewOwner")


router.get("/add",(req,res)=>{
    let {id} = req.params
    res.render("./reviews/newReview",{id})
})

router.post("/add",async (req,res)=>{
    let campground = await campgroundModel.findById(req.params.id)
    let {review, rating} = req.body;
    const token = req.cookies.token
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await userModel.findOne({ email: decoded.email });
    const newReview = await reviewModel.create({review,rating,userid:user._id})
    await campground.reviews.push(newReview._id)
    await campground.save()
    res.redirect(`/campgrounds/show/${campground._id}`);
})

router.get("/delete/:delid", canDeleteReview ,async(req, res)=>{
    let campid = req.params.id;
    let campground = await campgroundModel.findById(campid)
    let delid = req.params.delid
    await campgroundModel.findByIdAndUpdate(campid, {$pull:{reviews: delid}})
    await reviewModel.findByIdAndDelete(delid)
    res.redirect(`/campgrounds/show/${campground._id}`)
} )

module.exports = router