const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        orderId: {
            type: String,
            required: false,
            unique: true
        },
        // Amount Area
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        checkoutDate: {
            type: Date,
            required: true
        },
        name: {
            type: String,
            required: false
        },
        images: {
            type: [String],
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
        city: {
            type: String,
            required: false
        },
        district: {
            type: String,
            required: false
        },
        shippingAddress: {
            type: String,
            required: true
        },
        orderNotes: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('PrescriptionOrder', schema);
