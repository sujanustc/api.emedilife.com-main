const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    imei: {
        type: String,
        required: false
    },
    sn: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('ProductAuthenticator', schema);
