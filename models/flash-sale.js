const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
{
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        required: false
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('FlashSale', schema);