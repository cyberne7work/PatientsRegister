const express = require('express');
const Joi      =require('joi');
const router  = express.Router();
const Patient = require("../models/patient");
const redhome   = require("../middleware/redirectHome");
const redlogin   = require("../middleware/redirectLogin");

// Render the Login Page
router.get("/login",redhome,async (req,res)=>{
    res.render("login");
});
// Login Post Route
router.post("/login",async (req,res)=>{
    const found = await Patient.findOne({email:req.body.email});
    if(!found){
        req.flash("error","Email or Password is incorrect")
        return res.redirect("/patient/login")
    }
    if(found.password !== req.body.password){
        req.flash("error","Email or Password is incorrect")
        return res.redirect("/patient/login")
    }
    req.session.patient=found._id;
    return res.render("patientProfile",{patient:found});
});

// Route to schedules appointment
router.post("/sappointment/:id",async (req,res)=>{
    const patient = await Patient.findById(req.params.id);
        if(!patient){
            res.redirect("/");
            return;
        }
        patient.date=req.body.date;
        const result = await patient.save();
        req.flash("success"," An Appointment Scheduled")
        return res.redirect("/patient/viewappointments");
});
router.get("/viewappointments",redlogin,async (req,res)=>{
        const patients = await Patient.find({date:{$ne:null}}).sort({date:1});
        res.render("viewAppointment",{patients:patients});

})
router.post("/logout",async (req,res)=>{
    res.clearCookie();
    req.session.destroy((err)=>{
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("/patient/viewappointment");
        }
    });
    res.redirect("/");
});

module.exports=router;