const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const review = await reviewModel.findById(req.params.delid);
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await userModel.findOne({ email: decoded.email });
  if (user._id.equals(review.userid)) {
    next();
  } else {
    res.redirect("/");
  }
};
