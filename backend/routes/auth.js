const express = require ('express')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User= require('../models/User')
var fetchuser = require('../middleware/fetchuser')
const saltRounds = 10;
const jwtsecret = "YOwassupMyMan"
//Importing express validator from exrpess validator to validate the inputs given by the users
const { body, validationResult } = require('express-validator');

const router = express.Router()
//defining the url and what'll be in the body of request for registering
//Route 1: 
router.post('/registration',[
    body('email').isEmail(),
    body('password').isLength({ min: 3 }),
    body('phone_number').isLength({ min: 10 }),
    body('name').isLength({ min: 3 }),
    body('city')
],async (req,res)=>{                              //Incase validation errors occurs then create an error array and show them to users
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {                                                         
      let user = await User.findOne({email:req.body.email})         //Checking whether an user with same email put by new user already exists or not
      if(user){
        return res.status(400).json({success,error:"Sorry a user with the same email is already existing"})   //if yes return the error message
      }
                                                                  //New User created with these attributes
    const hpass = bcrypt.hashSync(req.body.password, saltRounds);                                                        
    user= await User.create({
      name: req.body.name,
      password: hpass,
      email:req.body.email,
      phone_number:req.body.phone_number,
      city:req.body.city
    })
    const data=({
        id:user.id
    })
    var token = jwt.sign(data,jwtsecret);
    success = true
    res.json({success,token})                                                    
    } catch (error) {
      console.log(error.message);
      res.status(500).send({success,error:"Some error Occured"})
    }
})

// Route:2    Logging in the with the credentials
router.post('/login',[
    body('email').isEmail(),
    body('password').exists()
],async (req,res)=>{                              //Incase validation errors occurs then create an error array and show them to users
    const errors = validationResult(req);
    let success = false
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    const {email,password}= req.body
    try {                                                         
      let user = await User.findOne({email})         //Checking whether the given email is there in the database or not
      if(!user){
        return res.status(400).json({success,error:"Wrong Email Entered, Please check you credentials"})   //Email wrong given
      }
      
      const passcompare =await bcrypt.compare(password,user.password)
      if(!passcompare){
        return res.status(400).json({success,error:"Wrong Password Entered ,Please check your credentials"})   //Password wrong given
      }
      const data=({
        id:user.id
    })


    var token = jwt.sign(data,jwtsecret);
    success =true;
    res.json({success,token})       
    }
     catch(error)
    {
      console.log(error.message);
      return res.status(500).send({success,error:"Internal Server Error"})
    }
    
    })

    //Route 3: Fetching user details from the database
    router.post('/fetchuser',fetchuser, async (req,res)=>{                              //Incase validation errors occurs then create an error array and show them to users
     
      try {
       let userid=req.id
        const user = await User.findById(userid).select("-password")
        res.send(user)
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error from authentication")
      }
    })

    router.get('/fetchemail',fetchuser,async(req,res)=>{
      try {
        const user = await User.distinct("email")
        res.send(user)
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error from authentication")
      }
    })



module.exports= router