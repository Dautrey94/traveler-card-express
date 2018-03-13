const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user-model');

const authRoutes = express.Router();

authRoutes.post('/api/signup', (req,res,next) => {
    if(!req.body.signUpUsername || !req.body.signUpPassword){
        res.status(400).json({message: "Please provide both username and password."});
        return;
    }
    User.findOne({username: req.body.signUpUsername}, (err,userFromDb) => {
        if(err){
            res.status(500).json({message: "Username error"});
            return;
        }

        if (userFromDb){
            res.status(400).json({message: "Username takem. Please choose another."});
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const scrambledPassword = bcrypt.hashSync(req.body.signUpPassword, salt);
console.log("heyyyyyyyyyy")
        const theUser = new User({
            username: req.body.signUpUsername,
            password: scrambledPassword
        });
        console.log("heyyyyyyyyyy there")

        theUser.save((err)=> {
            console.log("======")

            if(err){
                res.status(500).json({message: "Saving user went wrong."});
                return;
            }

            req.login(theUser,(err)=> {
                if(err){
                    res.status(500).json({message: "Login error."});
                    return;
                }
                theUser.password = undefined;
            res.status(200).json(theUser);
            });
        });
    });
})

authRoutes.post('/api/login', (req,res,next)=> {
    const authenticateFunction = passport.authenticate('local', (err, theUser, failureDetails) => {

        if(err){
            res.status(500).json({message: "Unknown Error"});
            return;
        }
        if (!theUser) {
            res.status(401).json(failureDetails);
            return;
        }
        req.login(theUser, (err) => {
            if(err){
                res.status(500).json({message:"Session save error."});
                return;
            }
            theUser.password = undefined;
            res.status(200).json(theUser);
        });
    });
    authenticateFunction(req,res,next);
});

authRoutes.post('/api/logout', (req,res,next)=> {
    req.logout();
    res.status(200).json({message: "Successful Logout"});
});

authRoutes.get('/api/checklogin', (req,res,next) => {
    if(req.isAuthenticated()) {
        res.status(200).json(req.user);
        return;
    }

    res.status(401).json({message: "unauthorized"});
});

function ifNotLoggedIn(req,res,next) {
    if(!req.isAuthenticated()){
        res.status(403).json({message: "forbidden"});
        return;
    }

    next();
}

authRoutes.get('/api/private', ifNotLoggedIn, (req,res,next) => {
    res.json({ message: "stop"});
});



module.exports = authRoutes;