const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
{
    name: {
        type: String,
        required: true
    },
    slug:{
        type: String
    },
    priority: {
        type: Number,
        required: false
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, {
    timestamps: false
});

module.exports = mongoose.model('FeaturedProduct', schema);