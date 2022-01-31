const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subSchema = require('./sub-schema-model')


const schema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productSlug: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: false
    },
    images: [{
        type: String,
        required: false
    }],
    price: {
        type: Number,
        required: false
    },
    discountType: {
        type: Number,
        required: false
    },
    discountAmount: {
        type: Number,
        required: false
    },
    prices: [
        subSchema.priceWithUnit
    ],
    // quantity: {
    //     type: Number,
    //     required: false
    // },
    // soldQuantity: {
    //     type: Number,
    //     required: false
    // },

    brand: {
        type: Schema.Types.ObjectId,
        ref: 'ProductBrand'
    },
    brandSlug: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory'
    },
    categorySlug: {
        type: String
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'ProductSubCategory'
    },
    subCategorySlug: {
        type: String
    },
    generic: {
        type: Schema.Types.ObjectId,
        ref: 'Generic'
    },
    genericSlug: {
        type: String
    },
    // attributes: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'ProductAttribute'
    // }],
    // filterData: [{
    //     _id: {
    //         type: Schema.Types.ObjectId,
    //         ref: 'ProductAttribute'
    //     },
    //     attributeName: {
    //         type: String,
    //         required: false
    //     },
    //     attributeValues: {
    //         type: String,
    //         required: false
    //     }
    // }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    ratingReview: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductRatingReview'
    }],
    // discussion: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Discussion'
    // }],
    // warrantyServices: {
    //     type: String,
    //     required: false
    // },
    // shortDescription: {
    //     type: String,
    //     required: false
    // },
    description: {
        type: String,
        required: false
    },
    stockVisibility: {
        type: Boolean,
        required: false
    },
    productVisibility: {
        type: Boolean,
        required: false,
        default: true
    },
    deliveryPolicy: {
        type: String,
        required: false
    },
    paymentPolicy: {
        type: String,
        required: false
    },
    // warrantyPolicy: {
    //     type: String,
    //     required: false
    // },
    // campaignStartDate: {
    //     type: Date,
    //     required: false
    // },
    // campaignEndDate: {
    //     type: Date,
    //     required: false
    // },
    // emiStatus: [{
    //     type: [Number],
    //     required: false
    // }],
    seoTitle: {
        type: String,
    },
    seoDescription: {
        type: String
    },
    seoTags: [{
        type: String
    }],
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    versionKey: false,
    timestamps: true
});

//new
schema.virtual("brandDetails", {
    ref: "ProductBrand",
    localField: "brand",
    foreignField: "_id",
})

schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });


module.exports = mongoose.model('Product', schema);
