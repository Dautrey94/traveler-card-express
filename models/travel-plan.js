const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const travelPlanSchema = new Schema ({
    place:      String,
    startDate:  Date,
    endDate:    String
});

const travelPlan = mongoose.model('travelPlan', travelPlanSchema);
module.exports = travelPlan;