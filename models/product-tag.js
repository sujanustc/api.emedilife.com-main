const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    tagName: {
        type: String,
        required: true
    },
    tagSlug: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Tag', schema);