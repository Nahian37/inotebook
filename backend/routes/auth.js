const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "thisIsSafeIPresumeHaHa";

//ROUTE 1: Create a User using: POST "/api/auth/register". Doesn't require authentication
router.post('/register',[
    body('name','Name must be at least 3 characters.').isLength({ min: 3 }),
    body('email','Enter a valid email.').isEmail(),
    body('password','Password must be at least 5 characters.').isLength({ min: 5 })
],async (req,res)=>{
    // If there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
        //Check whether the email exists already
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "Email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password,salt);
        //Create a new user
        user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash,
        });

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        //res.json(user);
        res.json({authToken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

//ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login',[
    body('email','Enter a valid email.').isEmail(),
    body('password','Password cannot be blank.').exists()
],async (req,res)=>{
    // If there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;

    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Invalid login credentials"});
        }
        const passwordCompare = bcrypt.compare(password,user.password);
        if(!passwordCompare)
        {
            return res.status(400).json({error: "Invalid login credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 3: Get logged in user details: POST "/api/auth/getuser". login required
router.post('/getuser',fetchuser,async (req,res)=>{
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } 
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router