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
    if(error){return res.send(error.details[0].message)}
    Joi.validate(req.body.password, new PasswordComplexity(),(err,value)=>{
        if(err){
            return res.send(err.details[0].message) 
        }
    })
        const {name,phone,email,password,address}=req.body;
        const newPatient = new Patient({
            name,phone,address,email,password
        });
        const result = await newPatient.save();
        if(!result){
            return res.redirect("/patient/newpatient");
        }
        res.redirect("/");
});
router.get("/edit/:id",async (req,res)=>{
    const patient = await Patient.findById(req.params.id);
    res.render("updatePatient",{patient:patient})
})
// Update route
router.put("/update/:id",async (req,res)=>{
    const { error } =isValidate(req.body);
    // Use Flash to show error
        if(error){return res.send(error.details[0].message)}
    const patient = await Patient.findByIdAndUpdate(req.params.id,{$set:req.body.patient});
    res.redirect("/")
})
// Delete Route
router.delete("/delete/:id",async (req,res)=>{
    const result = await Patient.findByIdAndDelete(req.params.id);
    res.redirect("/")
})

function isValidate(patient){
    const Schema = {
        name:Joi.string().min(3).required(),
        phone:Joi.number().min(10).required(),
        address:Joi.string().min(10).required(),
        email:Joi.string().required(),
        password:Joi.string().required()
    }
    return Joi.validate(patient,Schema);
}
module.exports=router;