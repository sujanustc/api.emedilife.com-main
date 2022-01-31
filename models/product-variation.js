const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    attributes: [
        {
            attribute: {
                type: Schema.Types.ObjectId,
                ref: 'ProductAttribute'
            },
            attributeValue: {
                type: String,
                required: false
            }
        }
    ],
    images: [{
        type: String,
        required: false
    }],
    price: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    soldQuantity: {
        type: Number,
        required: false
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('ProductVariation', schema);