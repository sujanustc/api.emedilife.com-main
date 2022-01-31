const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: "District",
        required: true
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: "Area",
        required: true
    },
    fullAddress: {
        type: String,
        required: true
    },
    userNote: {
        type: String,
        required: false
    },
    adminNote: {
        type: String,
        required: false
    },
    prescriptionId: {
        type: Schema.Types.ObjectId,
        ref: "Prescription",
        required: false
    },
    requestedItems: [{
        name: {
            type: String,
            required: true
        },
        strength: {
            type: String,
            required: false
        },
        generic: {
            type: String,
            required: false
        },
        company: {
            type: String,
            required: false
        },
        quantity: {
            type: Number,
            required: false
        }
    }],
    status: {
        type: String,
        default: "pending",
        comment: "pending, processing, comfirm, accepted, done"
    }
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('RequestMedicine', schema);