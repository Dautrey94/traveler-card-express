const mongoose = require('mongoose');
const express = require('express');
const travelCardRoutes = express.Router();
const travelCard = require('../models/travel-card-model');
const User = require('../models/user-model');


travelCardRoutes.post('/api/travelcards/new', (req,res,next) => {
    if(!req.user){
        res.status(401).json({message: "Log in to create travel plan."});
        return;
    }
    
    const newTravelCard = new travelCard ({
        owner: req.user._id,
        number: req.body.number,
        socialMedia: req.body.socialMedia,
        travelPlan: req.body.travelPlan
    })

    newTravelCard.save((err) => {
        if(err){
            res.status(500).json({message: "Some weird error from DB."});
            return;
        }
        req.user.password = undefined;
        newTravelCard.user = req.user;

        res.status(200).json(newTravelCard);
       
    });
});

travelCardRoutes.get('/api/travelcards', (req, res, next)=>{
    if (!req.user) {
        res.status(401).json({ message: "Log in to see travelcards." });
        return;
      }
      travelCard.find().populate('owner').exec((err, allTheCards)=>{
        if (err) {
            res.status(500).json({ message: "Travel cards find went bad." });
            return;
          }
          res.status(200).json(allTheCards);
      });
});

travelCardRoutes.post('/api/user/:id/addCards', (req, res, next) => {
  const isAdded = true;
  if (!req.user) {
    res.status(401).json({ message: "Log in to see travelcards." });
    return;
  }
// console.log("body from frontend: ", req.body)
  const cardId = req.body.theId;
  console.log("cardId: ===================", cardId)
  travelCard.findById(cardId, (err, foundcard) => {
    // console.log("card in the backend: ", foundcard)
    // push the foundCard into savedCards array of currently logged in user
    req.user.savedCards.push(foundcard);
    const isAdded = false;
    // save the changes in the user (save the card in savedCards array inside the logged in user)
    req.user.save(err => {
      if(err){
        res.status(500).json({message: "Some weird error from DB."});
        return;
      }

    });
    res.status(200).json(isAdded)
    // console.log("saved user: ", req.user)
  })
})

// get route for above

travelCardRoutes.get("/api/users/:id/savedCards", (req, res, next) => {
  const userId = req.params.id;
  if (!req.user) {
    res.status(401).json({ message: "Log in to see travelcards." });
    return;
  }
  User.findById(userId, (err, foundUser) => {
    if(err){
      res.json(err);
      return;
    }
    res.status(200).json(foundUser);
  })
})


travelCardRoutes.get('/api/travelcards/:id', (req, res, next)=>{
  const travelcardId = req.params.id;
  if (!req.user) {
      res.status(401).json({ message: "Log in to see travelcards." });
      return;
    }
    travelCard.findById(travelcardId, (err, theOneCard)=>{
      if (err) {
          res.status(500).json({ message: "Card find went bad." });
          return;
        }
        res.status(200).json(theOneCard);
    })
  });
travelCardRoutes.put('/api/travelcards/:id', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to update travel plan." });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }
    const updates = {
        number: req.body.travelCardNum,
        socialMedia: req.body.travelCardSocial,
        travelPlan: req.body.travelPlan
    };

  travelCard.findByIdAndUpdate(req.params.id, updates, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Travel plan updated successfully."
    });
  });
});

travelCardRoutes.delete("/api/travelcards/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to delete travel plan." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  travelCard.remove({ _id: req.params.id }, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Travel plan has been deleted."
    });
  });
});


module.exports = travelCardRoutes;