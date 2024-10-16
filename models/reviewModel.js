const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    review:String,
    rating: Number,
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

module.exports = mongoose.model("review",reviewSchema)