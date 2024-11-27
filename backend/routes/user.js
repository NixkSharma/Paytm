const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { JWT_SECRET } = require('../config');
const { User } = require('../db');


const signupPayload = zod.object({
    userName : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string().min(8, "Password must be atleast least 8 characters long")
});

const signinPayload = zod.object({
    userName : zod.string().email(),
    password : zod.string().min(8, "Password must be atleast least 8 characters long")
});

router.post('/signup', async(req, res)=>{
    const { success, error } = signupPayload.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message: "Invalid inputs",
            error
        });
    }

    const {userName, firstName, lastName, password} = req.body;
    const userExists = await User.findOne({ userName });
    if(userExists) return res.status(409).json({
        message : "Email already taken"
    });

    const user = new User({userName, firstName, lastName, password});
    hashedPassword = await user.createHash(user.password);
    user.password = hashedPassword;
    await user.save();
    const token = jwt.sign({ userId : user._id }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
    return res.status(200).json({
        message : "User created successfully",
        token
    });
});

router.post('/signin', asyncHandler(async(req, res)=>{
    const { success } = signinPayload.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Invalid inputs"
        });
    }
    const user = await User.findOne({userName: req.body.userName});
    if(user){
        if(await user.validatePassword(req.body.password)){
            const token = jwt.sign({userId: user._id}, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
            return res.status(200).json({
                token
            });
        }else{
            return res.status(401).json({
                message : "Wrong Password"
            });
        }
    }else{
        return res.status(404).json({
            message : "User not found"
        });
    }
}));


module.exports = router;

