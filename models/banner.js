const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        bannerType: {
            type: String,
            required: true
        },
        priority: {
            type: Number,
            required: false
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
            required: false
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Banner', schema);