const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    serial: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('FooterLinkHeader', schema);
