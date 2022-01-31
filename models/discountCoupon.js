const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema(
    {
        serviceType: {
            type: String,
            required: true,
            comment: "emedicine, doctorConsultancy, labTest"
        },
        type: {
            type: String,
            required: true,
            comment: "discount or coupon"
        },
        status: {
            type: Boolean,
            default: true,
            comment: "true or false"
        },
        title: {
            type: String,
            required: true
        },
        couponCode: {
            type: String,
        },
        globalLimitationType: {
            type: String,
            comment: "limited or unlimited"
        },
        globalLimitaionValue: {
            type: Number,
        },
        perUserLimitationType: {
            type: String,
            comment: "limited or unlimited"
        },
        perUserLimitationValue: {
            type: Number
        },
        calculationType: {
            type: String,
            required: true,
            comment: "amount or persentage"
        },
        calculationValue: {
            type: Number,
        },
        minimumAmountToUse: {
            type: Number,
        },
        maximumAmountGet: {
            type: Number
        },
        startingDateTime: {
            type: Date,
            required: true,
        },
        endingDateTime: {
            type: Date
        },
        applyToUserType: {
            type: String,
            required: true,
            comment: "all or specific or new"
        },
        applyToUserList: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        applyToDistrictType: {
            type: String,
            required: true,
            comment: "all or specific"
        },
        applyToDistrictValue: [{
            type: Schema.Types.ObjectId,
            ref: "District"
        }],
        applyForType: {
            type: String,
            required: true,
            comment: "global or specific"
        },
        //include section
        applyForValue: [{
            type: String,
            comment: "brand,generic,category,subcategory,product"
        }],
        brand: [{
            type: Schema.Types.ObjectId,
            ref: "ProductBrand"
        }],
        generic: [{
            type: Schema.Types.ObjectId,
            ref: "Generic"
        }],
        category: [{
            type: Schema.Types.ObjectId,
            ref: "ProductCategory"
        }],
        subCategory: [{
            type: Schema.Types.ObjectId,
            ref: "ProductSubCategory"
        }],
        product: [{
            type: Schema.Types.ObjectId,
            ref: "Product"
        }],
        //Exclude section
        isExclude: {
            type: Boolean,
            default: false
        },
        excludeValue: [{
            type: String,
            comment: "brand,generic,category,subcategory,product"
        }],
        excludeBrand: [{
            type: Schema.Types.ObjectId,
            ref: "ProductBrand"
        }],
        excludeGeneric: [{
            type: Schema.Types.ObjectId,
            ref: "Generic"
        }],
        excludeCategory: [{
            type: Schema.Types.ObjectId,
            ref: "ProductCategory"
        }],
        excludeSubCategory: [{
            type: Schema.Types.ObjectId,
            ref: "ProductSubCategory"
        }],
        excludeProduct: [{
            type: Schema.Types.ObjectId,
            ref: "Product"
        }],
        deletedAt: {
            type: Date,
            default: null
        }
    }, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('DiscountCoupon', schema);