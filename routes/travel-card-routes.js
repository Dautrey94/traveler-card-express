const mongoose = require('mongoose');
const express = require('express');
const travelCardRoutes = express.Router();
const travelCard = require('../models/travel-card-model');


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
      travelCard.find({}, (err, allTheCards)=>{
        if (err) {
            res.status(500).json({ message: "Phones find went bad." });
            return;
          }
          res.status(200).json(allTheCards);
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
        number: req.body.number,
        socialMedia: req.body.socialMedia,
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