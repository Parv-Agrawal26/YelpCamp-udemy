const express = require("express")
const campgroundModel = require("../models/campgroundModel")
const reviewModel = require("../models/reviewModel")
const router = express.Router({ mergeParams: true });

router.get("/add",(req,res)=>{
    let {id} = req.params
    res.render("./reviews/newReview",{id})
})

router.post("/add",async (req,res)=>{
    let campground = await campgroundModel.findById(req.params.id)
    let {review, rating} = req.body;
    const newReview = await reviewModel.create({review,rating})
    await campground.reviews.push(newReview._id)
    await campground.save()
    res.redirect(`/campgrounds/show/${campground._id}`);
})

router.get("/delete/:delid", async(req, res)=>{
    let campid = req.params.id;
    let campground = await campgroundModel.findById(campid)
    let delid = req.params.delid
    await campgroundModel.findByIdAndUpdate(campid, {$pull:{reviews: delid}})
    await reviewModel.findByIdAndDelete(delid)
    res.redirect(`/campgrounds/show/${campground._id}`)
} )

module.exports = router