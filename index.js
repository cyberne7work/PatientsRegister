const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session      = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const Patient = require("./models/patient");
const curdPatient = require("./routes/patient");
const authPatient = require("./routes/authPatient");

const index   = express();




// middleware used to use static file, like image,stylesheet etc.
index.use(express.static("public"));
// Set to view templetes in ejs file format
index.set("view engine","ejs");
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
index.use(bodyParser({Urlencoded:true}));
index.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/patientregister",{useNewUrlParser:true})
    .then(()=>{
        console.log("Server is Started");
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