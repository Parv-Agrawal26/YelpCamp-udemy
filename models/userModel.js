const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number,
    nationality: String,
    state : String,
    city: String,
    pincode: Number
})

module.exports = mongoose.model("user",userSchema)