const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    unitValue: {
        type: Number,
        required: false
    },
    unitQuantity: {
        type: Number,
        required: false
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('UnitType', schema);
