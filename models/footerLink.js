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
    },
    body:{
        type: String,
        required: true,
    },
    footerLinkHeaderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "FooterLinkHeader"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FooterLink', schema);