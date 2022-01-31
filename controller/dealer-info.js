// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const DealerInfo = require('../models/dealer-info');



exports.addDealerInfo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const dealerInfo = new DealerInfo(data);

    try {
        const response = await dealerInfo.save();
        res.status(200).json({
            response,
            message: 'Dealer Information Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllDealersInfo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const dealersInfo = await DealerInfo.find();

    try {
        res.status(200).json({
            data: dealersInfo,
            message: 'Dealers Information Retrieved Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getDealerInfoByDealerInfoId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const dealerInfoId = req.params.dealerInfoId;
    const dealerInfo = await DealerInfo.findOne({_id: dealerInfoId});

    try {
        res.status(200).json({
            data: dealerInfo,
            // message: 'Dealer Info Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editDealerInfo = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await DealerInfo.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            message: 'Dealer Information Updated Successfully!'
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

exports.getDealerInfoBySearch = async (req, res, next) => {
    try {

        const search = req.body.search;
        const paginate = req.body.paginate;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({name: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        dealersInfo = DealerInfo.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (paginate) {
            dealersInfo.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
        }

        const results = await dealersInfo;
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

exports.deleteDealerInfoByDealerInfoId = async (req, res, next) => {

    const dealerInfoId = req.params.dealerInfoId;
    await DealerInfo.deleteOne({_id: dealerInfoId});

    try {
        res.status(200).json({
            message: 'Dealer Information Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}