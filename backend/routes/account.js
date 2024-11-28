const express = require('express');
const authMiddleware = require('../middleware');
const { Account } = require('../db');
const router = express.Router();

router.get('/balance', authMiddleware, async(req, res)=>{
    const user = await Account.findOne({userId : req.userId});
    console.log(user.balance);
    res.json({
        balance : user.balance
    });
});

module.exports = router;