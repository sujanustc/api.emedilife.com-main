const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        title: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        appUrl: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)
module.exports = mongoose.model('Carousel', schema);
