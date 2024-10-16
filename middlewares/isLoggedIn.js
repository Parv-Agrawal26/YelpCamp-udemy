module.exports = async (req,res,next)=>{
    if(req.cookies.token === "" || req.cookies.token == null){
        res.redirect("/")
    }else{
        next()
    }
}