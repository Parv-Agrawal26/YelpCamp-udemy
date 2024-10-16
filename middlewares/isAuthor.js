const jwt = require("jsonwebtoken");
const campgroundModel = require("../models/campgroundModel");
const userModel = require("../models/userModel")

module.exports = async (req,res,next)=>{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findOne({ email: decoded.email });
    const campground = await campgroundModel.findById(req.params.id).populate("author")
    if(user._id.equals(campground.author._id)){
        next()
    }else{
        res.redirect("/")
    }
}