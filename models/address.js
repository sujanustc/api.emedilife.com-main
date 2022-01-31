const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const addressSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        addressType: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        },
        alternativePhoneNo: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: false
        },
        zone: {
            type: String,
            required: false
        },
        postCode: {
            type: String,
            required: false
        },
        shippingAddress: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Address', addressSchema);
