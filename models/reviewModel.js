const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    review:String,
    rating: Number,
})

module.exports = mongoose.model("review",reviewSchema)