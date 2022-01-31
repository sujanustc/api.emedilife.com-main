const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema(
    {
        discountCouponId: {
            type: Schema.Types.ObjectId,
            ref: "DiscountCoupon",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('DiscountCouponUsedHistory', schema);