const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const InstallationRepair = require('../models/installation-repair');

/**
 *  Offer Product
 */

exports.addNewInstallationRepair = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }
    try {

        const data = req.body;
        const dataSchema = new InstallationRepair(data);
        await dataSchema.save();

        res.status(200).json({
            message: 'Installation and Repair Added Successfully!'
        });
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllInstallationRepair = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = InstallationRepair.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData.populate('products').sort({createdAt: -1});
        const dataCount = await InstallationRepair.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Installation and Repair fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleInstallationRepairById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id};
    const select = req.query.select;


    try {
        const data = await InstallationRepair.findOne(query)
            .populate('products', select ? select : '');
        res.status(200).json({
            data: data
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getInstallationRepairBySlug = async (req, res, next) => {
    const productSlug = req.params.slug;
    try {
        const query = {installationRepairTypeSlug: productSlug};
        const data = await InstallationRepair.find(query)
        .populate('products', '-sku -attributes -filterData -tags -discussion -warrantyServices -shortDescription -description -stockVisibility -productVisibility -deliveryPolicy -paymentPolicy -warrantyPolicy')

        res.status(200).json({
            data: data,
            message: 'Installation and Repair fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteInstallationRepairById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await InstallationRepair.deleteOne(query);

        res.status(200).json({
            message: 'Installation and Repair delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editInstallationRepair = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const updatedData = req.body;
    const query = {_id: updatedData._id}
    const push = {$set: updatedData}

    InstallationRepair.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Installation and Repair Updated Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


