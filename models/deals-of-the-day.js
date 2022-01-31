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
        type: String,
        required: true
    },
    endDate: {
        type: String,
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

module.exports = mongoose.model('DealsOfTheDay', schema);
