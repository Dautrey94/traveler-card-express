const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema ({
    owner:          { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: "User" 
    },
    comment: String
});

const Comments = mongoose.model('Comments', commentsSchema);
module.exports = Comments;



