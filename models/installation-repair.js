const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    installationRepairType: {
        type: Schema.Types.ObjectId,
        ref: 'InstallationRepairType',
        required: true
    },
    installationRepairTypeSlug: {
        type: String,
        required: false
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, 
{
    timestamps: true
});


module.exports = mongoose.model('InstallationRepair', schema);