const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: false
        },
        hasChild: {
            type: [Object],
            required: false
        },
        priority: {
            type: Number,
            required: false
        },
        iconType: {
            type: String,
            required: false
        },
        iconName: {
            type: String,
            required: false
        }
    }
)

module.exports = mongoose.model('CategoryMenu', schema);
