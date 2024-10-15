const express = require("express")
const path = require("path")
const campgroundRoutes = require("./routes/campgroundRoutes")

require("dotenv").config();
require("./config/mongoose-connect")
const ejsMate = require("ejs-mate")

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))

app.engine("ejs",ejsMate)

app.set("view engine","ejs")

app.use("/campgrounds",campgroundRoutes)


app.listen(3000)