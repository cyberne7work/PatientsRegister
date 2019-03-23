const express = require('express');
const Joi      =require('joi');
const router  = express.Router();
const Patient = require("../models/patient");
const redhome   = require("../middleware/redirectHome");
const redlogin   = require("../middleware/redirectLogin");


router.get("/login",redhome,async (req,res)=>{
    res.render("login");
});
router.post("/login",async (req,res)=>{
    const found = await Patient.findOne({email:req.body.email});
    if(!found){
        return res.send("Patient Not found")
    }
    if(found.password === req.body.password){
        req.session.patient=found._id;
        return res.render("patientProfile",{patient:found});
    }else{
        return res.redirect("/");
    }
});

router.post("/sappointment/:id",async (req,res)=>{
    const patient = await Patient.findById(req.params.id);
        if(!patient){
            return res.redirect("/");
        }
        patient.date=req.body.date;
        const result = await patient.save();
        return res.redirect("/patient/viewappointments");
});
router.get("/viewappointments",redlogin,async (req,res)=>{
        const patients = await Patient.find({date:{$ne:null}}).sort({date:1});
        console.log(patients);
        res.render("viewAppointment",{patients:patients});

})
router.post("/logout",async (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log("cant");
        }
    });
    res.clearCookie();
    res.redirect("/");
});

module.exports=router;