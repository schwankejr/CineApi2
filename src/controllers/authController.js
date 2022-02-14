const express = require('express');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const authCfonfig = require('../config/auth.json');

const User = require('../models/user');
const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authCfonfig.secret, {
        expiresIn: 120
    })
}

router.post('/register', async (req, res)=> {
    const { email} = req.body;

    try{

        if (await User.findOne({ email }))
        return res.status(400).send( {error: 'user already exists'});

        const user = await User.create(req.body);

        user.password = undefined;


        res.send({ 
            user,
            token: generateToken({id: user.id})
         });    
    

    } catch (err) {
        return res.status(400).send({error: 'falha no registro -_-'});
    }
});

router.post('/authenticator', async (req, res)=> {
    const { email, password} = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({error: 'User not found'});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'ops: inavalid password -_-'})
    
    user.password = undefined;



    res.send({ 
        user,
        token: generateToken({id: user.id})
     });    

    
})





module.exports = app => app.use('/auth', router);