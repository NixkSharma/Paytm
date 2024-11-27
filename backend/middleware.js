const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./config');

function authMiddleware(req, res, next){
    console.log(req.headers.authorization);
    console.log(JWT_SECRET);
    const token = req.headers['authorization']?.startsWith('Bearer ') ? req.headers['authorization'].split(' ')[1] : null;
    console.log(token);
    if(!token) return res.status(403).json({});
    console.log("here")
    try{
        const verifiedToken = jwt.verify(token, JWT_SECRET, {algorithms : ['HS256']});
        console.log(verifiedToken);
        req.userId = verifiedToken.userId;
        next();
    }catch(error){
        return res.status(403).json({error});
    }
}

module.exports = authMiddleware;