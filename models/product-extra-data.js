const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    return: {
        type: String,
        required: false
    },
    warranty: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('ProductExtraData', schema);