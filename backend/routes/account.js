const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware');
const { Account } = require('../db');
const router = express.Router();

router.get('/balance', authMiddleware, async(req, res)=>{
    const account = await Account.findOne({userId : req.userId});
    res.json({
        balance : account.balance
    });
});

router.post('/transfer', authMiddleware, async(req, res, next)=>{
    const { to , amount } = req.body; 
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const userAccount = await Account.findOne({userId : req.userId}).session(session);
        if(!userAccount || userAccount.balance < amount) return res.status(400).json({message : "Insufficient Balance"});
        const toAccount = await Account.findOne({userId : to}).session(session);
        if(!toAccount) return res.status(400).json({message : "Invalid Account"});
        await Account.updateOne({userId: req.userId}, {$inc : {balance : -amount}}).session(session);
        await Account.updateOne({userId:to}, {$inc : {balance : amount}}).session(session);
        await session.commitTransaction();
        return res.status(200).json({message : "Transfer Successful"});
    }catch(e){
        session.abortTransaction();
        next(e)
    }finally{
        await session.endSession();
    }
});

module.exports = router;