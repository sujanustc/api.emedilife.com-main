const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        priority: {
            type: Number,
            required: false
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'ProductCategory'
        },
        shortDesc: {
            type: String,
            required: false
        },
        info: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        },
        routerLink: {
            type: String,
            required: true
        },
        cardBackground: {
            type: String,
            required: false
        },
        cardBtnColor: {
            type: String,
            required: false
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('FeaturedCategory', schema);
