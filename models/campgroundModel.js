const mongoose = require("mongoose")

const campgroundSchema = new mongoose.Schema({
    image:String,
    title: String,
    price: Number,
    description: String,
    location: String,
    reviews : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

module.exports = mongoose.model("campground",campgroundSchema)