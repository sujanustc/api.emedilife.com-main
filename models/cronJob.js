const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        status: {
            type: Number,
            default: 1
        },
        error: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('CronJob', schema);
