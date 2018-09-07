const express = require("express");
const bcrypt= require("bcrypt");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

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
         message: "Invalid authentication credentials!"
       });
     });
   });
});


router.post("/login" , (req,res,next) => {
    let fetchedUser;
    //check is the email address exists
    User.findOne({email: req.body.email })
    //chain then to handle the req when we get the response
    .then( user => {

      if(!user){
          return res.status(401).json({message:'Invalid email!'});
      }
      //compare an imput to an encripted value so bycript will find if the inp will yeald the same value
      fetchedUser=user;
     return bcrypt.compare(req.body.password, user.password);//return a promise
    })
    .then(result => {
        if(!result) {
            return res.status(401).json({message: "Invalid password!"});
        }
       // if we have a valid password
    const token = jwt.sign(
        {email: fetchedUser.email ,userId: fetchedUser._id},
        'secret_this_should_be_longer',
        {expiresIn:"1h"}
      );
      res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id
      })   
    })
    .catch(err =>{
        return res.status(401).json({message: "Invalid credentials."});
    })
});
module.exports=router;