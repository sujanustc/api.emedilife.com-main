const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    readOnly: {
        type: Boolean,
        required: false
    },
    district: {
        type: String,
        required: true
    },
    districtbn: {
        type: String,
        required: false
    },
    coordinates: {
        type: String,
        required: false
    },
    areas: [{
        type: Schema.Types.ObjectId,
        ref: 'Area'
    }],
    status: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('District', schema);
