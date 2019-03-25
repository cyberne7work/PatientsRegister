const express = require('express');
const Joi      =require('joi');
const router  = express.Router();
const Patient = require("../models/patient");
const PasswordComplexity = require('joi-password-complexity');

router.get("/newpatient",async (req,res)=>{
    res.render("newPatient");
});
router.post("/newpatient",async (req,res)=>{
    const { error } =isValidate(req.body);
        // Use Flash to show error
    if(error){
        res.flash("error",error.details[0].message);
        res.redirect("/patient/newpatient");
        return;
    }
        const foundResult = validPassword(req.body.password);
        if(foundResult){
            req.flash("error",foundResult);
             res.redirect("/patient/newpatient");
             return;
        }
        const foundEmail = await Patient.findOne({email:req.body.email});
            if(foundEmail){
                req.flash("error","Email Already Register");
                res.redirect("/patient/newpatient");
                return;
            }
        const {name,phone,email,password,address}=req.body;
        const newPatient = new Patient({
            name,phone,address,email,password
        });
        const result = await newPatient.save();
        if(!result){
            res.redirect("/patient/newpatient");
            return 
        }
        req.flash("success","New Patient Added");
        res.redirect("/");
});
router.get("/edit/:id",async (req,res)=>{
    const patient = await Patient.findById(req.params.id);
    res.render("updatePatient",{patient:patient})
})
// Update route
router.put("/update/:id",async (req,res)=>{
    const { error } =updateValid(req.body.patient);
        if(error){
                console.log(error)
                req.flash("error",error.details[0].message);
                res.redirect("/");
                return;
        }
    const patient = await Patient.findByIdAndUpdate(req.params.id,{$set:req.body.patient});
    req.flash("success","Successfully Updated")
    res.redirect("/")
})
// Delete Route
router.delete("/delete/:id",async (req,res)=>{
    const result = await Patient.findByIdAndDelete(req.params.id);
    req.flash("error","Deleted")
    res.redirect("/")
});

function validPassword(password){
    const {error} =Joi.validate(password, new PasswordComplexity());
    if(error){
        console.log("From function ..........",error.details[0].message)
        return error.details[0].message;
    }
}

function isValidate(patient){
    const Schema = {
        name:Joi.string().min(3).required(),
        phone:Joi.number().min(10).required(),
        address:Joi.string().min(10).required(),
        email:Joi.string().required().email(),
        password:Joi.string().required().min(8)
    }
    return Joi.validate(patient,Schema);
}
function updateValid(patient){
    const Schema = {
        name:Joi.string().min(3),
        phone:Joi.number().min(10),
        address:Joi.string().min(10),
        email:Joi.string().email(),
        password:Joi.string().min(8)
    }
    return Joi.validate(patient,Schema);
}
module.exports=router;