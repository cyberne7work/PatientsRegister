const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session      = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const Flash         =require('connect-flash');
const Patient = require("./models/patient");
const curdPatient = require("./routes/patient");
const authPatient = require("./routes/authPatient");

const index   = express();




// middleware used to use static file, like image,stylesheet etc.
index.use(express.static("public"));
// Set to view templetes in ejs file format
index.set("view engine","ejs");
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
index.use(bodyParser.urlencoded({extended:true}));
index.use(methodOverride("_method"));

mongoose.connect("mongodb://vishal:vishal123@ds123196.mlab.com:23196/patientregister",{useNewUrlParser:true,useCreateIndex: true,})
    .then(()=>{
        console.log("Connected to the database");
    })
    .catch((err)=>{
        console.log(err);
    });

index.use(session({
    name:'Patient',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store:new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { 
            sameSite:true,
            secure:false
    }
}));
index.use(Flash());

index.use(async (req,res,next)=>{
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next()
})

index.use(async (req,res,next)=>{
        if(req.session.patient){
            const localPatient= await Patient.findById(req.session.patient);
            res.locals.currentPatient=localPatient;
            return next();
        }
        return next();
    })

//Routes
index.use("/patient",curdPatient);
index.use("/patient",authPatient);



index.get("/",async (req,res)=>{
    const patient = await Patient.find({});
    res.render("home",{patients:patient,user:req.session.patient})
})



const port = process.env.PORT || 4000;

index.listen(port,(err)=>{
    if(err){
        console.log(err);
    }
    console.log(`Sever is Started at Port ${port}`)
})