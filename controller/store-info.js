// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const StoreInfo = require('../models/store-info');



exports.addStoreInfo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const storeInfo = new StoreInfo(data);

    try {
        const response = await storeInfo.save();
        res.status(200).json({
            response,
            message: 'Store Information Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllStoresInfo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const storesInfo = await StoreInfo.find();

    try {
        res.status(200).json({
            data: storesInfo,
            message: 'Stores Information Retrieved Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getStoreInfoByStoreInfoId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const storeInfoId = req.params.storeInfoId;
    const storeInfo = await StoreInfo.findOne({_id: storeInfoId});

    try {
        res.status(200).json({
            data: storeInfo,
            // message: 'Store Info Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editStoreInfo = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await StoreInfo.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            message: 'Store Information Updated Successfully!'
        });

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getStoreInfoBySearch = async (req, res, next) => {
    try {

        const search = req.body.search;
        const paginate = req.body.paginate;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({name: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        storesInfo = StoreInfo.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (paginate) {
            storesInfo.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
        }

        const results = await storesInfo;
        const count = results.length;

        res.status(200).json({
            data: results,
            count: count
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteStoreInfoByStoreInfoId = async (req, res, next) => {

    const storeInfoId = req.params.storeInfoId;
    await StoreInfo.deleteOne({_id: storeInfoId});

    try {
        res.status(200).json({
            message: 'Store Information Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}