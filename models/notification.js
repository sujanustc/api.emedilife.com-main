const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    url: {
        type: String
    },
    status: {
        type: Number,
        comment: "0 for deactive 1 for active",
        default: 1
    },
    platformType: {
        type: Number,
        comment: "0 for web, 1 for app, 2 for both",
        required: true
    },
    roleType: {
        type: Number,
        comment: "0=user, 1=editor, 2=admin, 3=super admin, 4=doctor",
        required: true
    },
    sendingType: {
        type: Number,
        comment: "0 for specific users, 1 for global",
        required: true
    },
    receivers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model('Notification', schema);