const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const DealOnPlay = require('../models/deal-on-play');

/**
 * Add Gallery
 * Get Gallery List
 */

exports.addNewDealOnPlay = async (req, res, next) => {
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
        const dataSchema = new DealOnPlay(data);
        await dataSchema.save();

        res.status(200).json({
            message: 'Deal On Play Added Successfully!'
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


exports.getAllDealOnPlay = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = DealOnPlay.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData.populate('products').sort({createdAt: -1});
        const dataCount = await DealOnPlay.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Deal On Play fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleDealOnPlayById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id};
    const select = req.query.select;


    try {
        const data = await DealOnPlay.findOne(query)
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


exports.deleteDealOnPlayById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await DealOnPlay.deleteOne(query);

        res.status(200).json({
            message: 'Deal On Play delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editDealOnPlay = (req, res, next) => {
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

    DealOnPlay.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Deal On Play Updated Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}


