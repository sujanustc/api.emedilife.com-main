const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    readOnly: {
        type: Boolean,
        required: false
    },
    promoName: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    },
    routerLink: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('PromoPage', schema);