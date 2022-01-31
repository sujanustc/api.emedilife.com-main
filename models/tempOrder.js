const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subSchema = require('./sub-schema-model');

const schema = new Schema(
    {
        confirmStatus: {
            type: Boolean,
            default: false
        },
        // Amount Area
        subTotal: {
            type: Number,
            // required: true
        },
        shippingFee: {
            type: Number,
            // required: true
        },
        discount: {
            type: Number,
            required: false
        },
        totalAmount: {
            type: Number,
            // required: true
        },
        totalAmountWithDiscount: {
            type: Number,
            // required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // User Address
        address: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
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
        district: {
            type: String,
            required: false
        },
        area: {
            type: String,
            required: false
        },
        shippingAddress: {
            type: String,
            // required: true
        },
        orderedItems: [subSchema.orderItem],
        orderType: {
            type: String,
            required: false
        },
        prescriptionId: {
            type: Schema.Types.ObjectId,
            ref: "Prescription",
            required: false
        },
        orderFrom: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', schema);
