const mongoose = require('mongoose');
const subSchema = require('./sub-schema-model');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    discussionDate: {
        type: Date,
        required: false,
        default: Date.now()
    },
    profileImage: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    reply: [subSchema.discussionReply],
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('Discussion', schema);
