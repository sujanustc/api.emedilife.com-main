const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
{
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        comment: "HOME/OFFICE/OTHERS"
    },
    othersTitle: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    districtId: {
        type: Schema.Types.ObjectId,
        ref: 'District',
        required: true
    },
    areaId: {
        type: Schema.Types.ObjectId,
        ref: 'Area',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('DeliveryAddress', schema);
