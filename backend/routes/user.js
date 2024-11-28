const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { JWT_SECRET } = require('../config');
const authMiddleware = require('../middleware');
const { User, Account} = require('../db');
const router = express.Router();

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

const updatePayload = zod.object({
    firstName : zod.string().optional(),
    lastName : zod.string().optional(),
    password : zod.string().min(8, "Password must be atleast least 8 characters long").optional()
});

// retrive everything and then use array.filter -> cost??


router.get('/bulk', authMiddleware, asyncHandler(async(req, res)=>{
    const filter = req.query.filter || "";
    const query = {
        $or : [
            {firstName : { $regex: filter, $options: "i" }},
            {lastName : { $regex: filter, $options: "i" }} 
        ]
    };
    const users = await User.find(query, {userName : 1, firstName : 1, lastName : 1, _id : 1})
    return res.status(200).json({
        users
    });
}));

router.put('/', authMiddleware,async(req, res)=>{
    const {success} = updatePayload.safeParse(req.body);
    if(!success){
        return res.status(409).json({
            message : "Invalid inputs"
        });
    }
    try{
        await User.findByIdAndUpdate(req.userId, req.body);
        return res.status(200).json({
            message : "Updated successfully"
        });
    }catch(error){
        return res.status(409).json({
            message : "Error while updating information"
        });
    }
});

function randomBalance(){
    return 1 + Number((Math.random()*10000).toFixed(2));
}

router.post('/signup', asyncHandler(async(req, res)=>{
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
   
    await Account.create({
        userId : user._id,
        balance : randomBalance()
    });
    await user.save();
    const token = jwt.sign({ userId : user._id }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
    return res.status(200).json({
        message : "User created successfully",
        token,
    });
}));

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

