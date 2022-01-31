const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    title: {
        type: String,
        required: false
    },
    priority: {
        type: Number,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('OfferBanner', schema);