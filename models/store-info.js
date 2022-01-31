const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema(
    {
        storeName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        map: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('StoreInfo', schema);
