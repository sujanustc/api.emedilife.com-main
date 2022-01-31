const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: Number,
        comment: "0 inactive, 1 active",
        default: 1
    }

}, {
    timestamps: true
});


module.exports = mongoose.model('MinimumAmount', schema);