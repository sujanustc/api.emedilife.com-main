const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const InstallationRepairType = require('../models/installation-repair-type');

/**
 * Add InstallationRepairType
 * Get InstallationRepairType List
 */

exports.addNewInstallationRepairType = async (req, res, next) => {
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

        const dataExists = await InstallationRepairType.findOne({slug: data.slug}).lean();

        if (dataExists) {
            const error = new Error('A Promotional Offer with this name already registered!');
            error.statusCode = 406;
            next(error)
        } else {
            const dataSchema = new InstallationRepairType(data);
            await dataSchema.save();

            res.status(200).json({
                message: 'Installation and Repair Type Image Added Successfully!'
            });
        }
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.addNewInstallationRepairTypeMulti = async (req, res, next) => {

    try {

        const data = req.body.data;
        await InstallationRepairType.insertMany(data);

        res.status(200).json({
            message: 'Multiple Product Added to Installation and Repair Type Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllInstallationRepairType = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let queryData;
        queryData = InstallationRepairType.find().select(select ? select : '');

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData.sort({createdAt: -1});
        const dataCount = await InstallationRepairType.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleInstallationRepairTypeById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        const data = await InstallationRepairType.findOne(query);
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

exports.getSingleInstallationRepairTypeBySlug = async (req, res, next) => {
    const slug = req.params.slug;
    const query = {slug: slug}

    try {
        const data = await InstallationRepairType.findOne(query);
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


exports.deleteInstallationRepairTypeById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await InstallationRepairType.deleteOne(query);
        res.status(200).json({
            message: 'Installation and Repair Type delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteInstallationRepairTypeMulti = async (req, res, next) => {
    const ids = req.body.data;

    try {
        await InstallationRepairType.deleteMany({_id: ids});
        res.status(200).json({
            message: 'Installation and Repair Types deleted Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editInstallationRepairTypeData = (req, res, next) => {
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

    InstallationRepairType.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Installation and Repair Type Updated Success!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}


