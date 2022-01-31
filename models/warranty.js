const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    invoiceNumber: {
        type: String,
        required: true
    },
    activationDate: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    warrantyPeriod: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhoneNo: {
        type: String,
        required: true
    },
    lastDownload: {
        type: String,
        required: false
    },
    totalDownload: {
        type: Number,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Warranty', schema);
