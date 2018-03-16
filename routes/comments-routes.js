const express = require('express');
const mongoose = require('mongoose');
const travelCard = require('../models/travel-card-model');

const Comment = require('../models/comments-model');

const commentsRoutes = express.Router();

// GET Request to List Comments for ONE Travel Card
commentsRoutes.get('/api/travelcards/:id/comments', (req, res, next) =>{
    if(!req.user){
        res.status(401).json({message: "Log in to leave comment."});
        return;
    }

    travelCard.findById(req.params.id, (err, travelCard) => {
       // Create the Schema Object to Save the comment
      
        if(err){
            res.status(500).json({message: "Travel Card Not Found"});
            return;
        }
        // req.user.password = undefined;
        // travelCard.user = req.user;

        res.status(200).json(travelCard.comments);
    });
});


// POST Request to Create a Comment
commentsRoutes.post('/api/travelcards/:id/comments', (req, res, next) =>{
    if(!req.user){
        res.status(401).json({message: "Log in to leave comment."});
        return;
    }

    travelCard.findById(req.params.id, (err, travelCard) => {
       // Create the Schema Object to Save the comment
       const newComment = new Comment ({
           comment: req.body.comment,
           owner: req.user._id
       });

       // Add Review to travelcard comments Array
       travelCard.comments.push(newComment);
       newComment.save(err =>{
           console.log(err)

           travelCard.save((err) => {
            if(err){
                // res.status(500).json({message: "Some weird error from DB."});
                res.status(500).json({message: `${err}`});
                return;
            }
            req.user.password = undefined;
            travelCard.user = req.user;
    
            res.status(200).json(travelCard);
           
            });
       })
       
    });
});

commentsRoutes.delete("/api/travelcards/:travelCardId/comments/:id", (req, res, next) => {
    const travelCardId = req.params.travelCardId;
    const commentId = req.params.id;
    if (!req.user) {
      res.status(401).json({ message: "Log in to delete comment." });
      return;
    }
    if ((!mongoose.Types.ObjectId.isValid(req.params.id)) || (!mongoose.Types.ObjectId.isValid(req.params.travelCardId))) {
      res.status(400).json({ message: "ID is not valid." });
      return;
    }

    travelCard.findById(travelCardId, (err, foundcard) => {
        if (err) {
            res.json(err);
            return;
          }

          console.log("travel card before:", foundcard)
          Comment.findByIdAndRemove(commentId, (err, foundComment) => {
            console.log("==============================")
            if (err) {
              res.json("error is:",err);
              return;
            }
            console.log("comment is:", foundComment)
            console.log("==============================")

            foundcard.save((err) => {
                if(err){
                    console.log("err is: ", err)
                }
                // console.log("err while saving card: ", err)
                res.json({
                    message: "Comment has been deleted."
                  });
            })
            console.log("travel card after:", foundcard)
          });   
    })
  });

module.exports = commentsRoutes;