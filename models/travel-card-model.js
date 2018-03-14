const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user-model');
const Comments = require('../models/comments-model');

const travelCardSchema = new Schema ({
    owner:          { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: "User" 
    },
    number:         String,
    socialMedia:    String,
    travelPlan:     String,
    comments:       [Comments.schema]

});

const travelCard = mongoose.model('travelCard', travelCardSchema);
module.exports = travelCard;