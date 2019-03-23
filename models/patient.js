const mongoose = require('mongoose');
const Joi      = require('joi');

const PatientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
    },
    phone:{
        type:String,
        required:true,
        min:10
    },
    address:{
        type:String,
        min:10
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:String,
    }
});

module.exports=mongoose.model("patient",PatientSchema);