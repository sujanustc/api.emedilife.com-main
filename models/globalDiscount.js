const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    newUserDiscount: {
        type: Number,
        required: true
    },
    generalDiscount: {
        type: Number,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('GlobalDiscount', schema);
