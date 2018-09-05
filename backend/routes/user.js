const express = require("express");
const bcrypt= require("bcrypt");
const User = require("../models/user.js");

const router = express.Router();

//handeling all requests for signup
router.post("/signup", (req, res, next)=>{
    bcrypt.hash(req.body.password, 10) 
    .then(hash => {//chain a promise that whill yeald us the hash when it's done
        const user= new User({
            email: req.body.email,
            password: hash
    });
    user.save()//save user to database 
    .then(result => { // create response with status code 201 when user got saved
        res.status(201).json({
            message:'User created!',
            result: result
        });
    })
     .catch(err => {
       res.status(500).json({
           error:err
       });
     });
   });
});



module.exports=router;