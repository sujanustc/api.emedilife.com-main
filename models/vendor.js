const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    vendorName: {
        type: String,
        required: true
    },
    vendorSlug: {
        type: String,
        required: true
    },
    vendorType: {
        type: Number,
        required: true
    },
    vendorPriority: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    phoneNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    hasVendorAccess: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Vendor', schema);