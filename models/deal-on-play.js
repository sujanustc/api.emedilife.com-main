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
        shortDesc: {
            type: String,
            required: true
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
            required: false
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

module.exports = mongoose.model('DealOnPlay', schema);
