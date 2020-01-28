const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var imageSchema = new Schema({
    userHash: {type: String, trim: false, required: [true, "can't be blank"]},
    imageData: {type: String, trim: false, required: [true, "can't be blank"]},
    isProfile: {type: Boolean, required: [true, "can't be blank"]},
// firstname: {type: String, trim:true, required: [true, "can't be blank"]},
});
module.exports = mongoose.model('image', imageSchema);