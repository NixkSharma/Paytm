const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./config');

function authMiddleware(req, res, next){
    const token = req.headers['authorization']?.startsWith('Bearer ') ? req.headers['authorization'].split(' ')[1] : null;
    if(!token) return res.status(403).json({});
    try{
        const verifiedToken = jwt.verify(token, JWT_SECRET, {algorithms : ['HS256']});
        req.userId = verifiedToken.userId;
        next();
    }catch(error){
        return res.status(403).json({error});
    }
}

module.exports = authMiddleware;