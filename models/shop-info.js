const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    siteName: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: false
    },
    siteLogo: {
        type: String,
        required: false
    },
    navLogo: {
        type: String,
        required: false
    },
    footerLogo: {
        type: String,
        required: false
    },
    othersLogo: {
        type: String,
        required: false
    },
    addresses: [{
        type: Object,
        required: false
    }],
    emails: [{
        type: Object,
        required: false
    }],
    phones: [{
        type: Object,
        required: false
    }],
    downloadUrls: [{
        type: Object,
        required: false
    }],
    socialLinks: [{
        type: Object,
        required: false
    }]
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('ShopInfo', schema);
