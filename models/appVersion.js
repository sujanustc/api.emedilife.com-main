const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true,
        unique: true,
        comment: "Android and IOS"
    },
    versionCode: {
        type: Number,
        required: true
    },
    versionName: {
        type: String,
        required: true
    },
    updateDate: {
        type: Date,
        required: true
    },
    mandatory: {
        type: Boolean,
        required: true,
        comment: "0 for no, 1 for yes"
    },
    description: {
        type: String,
    }   
}, {
    timestamps: true
});


module.exports = mongoose.model('AppVersion', schema);
