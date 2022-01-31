const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('AboutUs', schema);