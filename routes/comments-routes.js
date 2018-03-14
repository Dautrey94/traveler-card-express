const express = require('express');
const mongoose = require('mongoose');
const travelCard = require('../models/travel-card-model');

const Comments = require('../models/comments-model');

const commentsRoutes = express.Router();

commentsRoutes.post('/api/travelcards/:id/comments', (req, res, next) =>{
    if(!req.user){
        res.status(401).json({message: "Log in to leave comment."});
        return;
    }

   travelCard.findById(req.params.id, (err, travelCard) => {
       // Create the Schema Object to Save the comment
       const newComment = new Comments ({
           comment: req.body.comment
       });

       // Add Review to travelcard comments Array
       travelCard.comments.push(newComment);

       travelCard.save((err) => {
        if(err){
            res.status(500).json({message: "Some weird error from DB."});
            return;
        }
        req.user.password = undefined;
        travelCard.user = req.user;

        res.status(200).json(travelCard);
       
    });
});
});

module.exports = commentsRoutes;