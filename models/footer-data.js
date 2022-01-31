const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    readOnly: {
        type: Boolean,
        required: false
    },
    // shortDes: {
    //     type: String,
    //     required: false
    // },
    // address: {
    //     type: String,
    //     required: false
    // },
    // phone: {
    //     type: String,
    //     required: false
    // },
    // email: {
    //     type: String,
    //     required: false
    // },
    // aboutEmediLife: {
    //     type: String,
    //     required: false
    // },
    title1: {
        type: String,
        required: false
    },
    title1Des: {
        type: String,
        required: false
    },
    title2: {
        type: String,
        required: false
    },
    title2Des: {
        type: String,
        required: false
    },
    title3: {
        type: String,
        required: false
    },
    title3Des: {
        type: String,
        required: false
    },
    socialLinks: [{
        type: Object,
        required: false
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model('FooterData', schema);
