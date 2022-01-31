const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    readOnly: {
        type: Boolean,
        required: false
    },
    brandName: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: false
    },
    isFeatured: {
        type: String,
        required: false
    },
    brandSlug: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    phoneNo: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('ProductBrand', schema);
