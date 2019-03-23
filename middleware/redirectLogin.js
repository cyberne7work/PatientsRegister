module.exports=(req,res,next)=>{
     // if req.session have no patient then this will redirect to the login page

    if(!req.session.patient){
        res.redirect("/patient/login");
        return next();
    }
    return next();
}