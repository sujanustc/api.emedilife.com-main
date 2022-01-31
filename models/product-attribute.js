const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    attributeName: {
        type: String,
        required: true
    },
    attributeSlug: {
        type: String,
        required: true
    },
    attributeValues: [{
        type: String,
        required: false
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model('ProductAttribute', schema);