module.exports=(req,res,next)=>{
    // if req.session have a patient then this will redirect to the appointement page
    if(req.session.patient){
        res.redirect("/patient/viewappointments");
        return next();
    }
    return next();
}