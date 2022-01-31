const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    parentCategoryName: {
        type: String,
        required: true
    },
    parentCategorySlug: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('ProductParentCategory', schema);