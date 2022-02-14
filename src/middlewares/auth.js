const jwt= require('jsonwebtoken');
const authCfonfig = require('../config/auth.json');


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({error: 'no token provideer'});

    const parts = authHeader.split(' ');
    
    if (!parts.length == 2)
        return res.status(401).send({error: 'token error'});

    const [ scheme, token] = parts;
    
    if(!/^Bearer$/i.test(scheme))
    return res.status(401).send({error: 'token ivalid'})

    jwt.verify(token, authCfonfig.secret, (err, decoded)=>{
        if(err) return res.status(401).send({error: 'token does not exist'})
    
        req.userId = decoded.id;
        return next();
    })
}