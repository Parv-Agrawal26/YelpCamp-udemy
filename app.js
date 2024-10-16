const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const campgroundRoutes = require("./routes/campgroundRoutes")
const userRoutes = require("./routes/userRoutes")
const isLoggedIn = require("./middlewares/isLoggedIn");
const jwt = require("jsonwebtoken")

require("dotenv").config();
require("./config/mongoose-connect")
const ejsMate = require("ejs-mate")
const userModel = require("./models/userModel")

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser())

app.engine("ejs",ejsMate)

app.set("view engine","ejs")

app.use(async (req,res,next)=>{
    const token = req.cookies.token
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email });
        res.locals.logged = user
    }else{
        res.locals.logged = ""
    }
    next()
})

app.use("/campgrounds",isLoggedIn,campgroundRoutes)
app.use("/user",userRoutes)
app.get("/",async (req,res)=>{
    const token = req.cookies.token
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email });
        res.redirect(`/campgrounds`)
    }else{
        res.render("home")
    }
})
app.listen(3000)