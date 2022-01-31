const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            require: true,
            default: 1,
            comment: "0 for false, 1 for active",
        },
        serial: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("HeaderMenu", schema);
