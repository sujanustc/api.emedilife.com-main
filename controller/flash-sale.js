const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const FlashSale = require('../models/flash-sale');

/**
 * Add Gallery
 * Get Gallery List
 */

exports.addNewFlashSale = async (req, res, next) => {
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
        const dataSchema = new FlashSale(data);
        await dataSchema.save();

        res.status(200).json({
            message: 'Flash Sale Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllFlashSale = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = FlashSale.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData.populate('product').sort({createdAt: -1});
        const dataCount = await FlashSale.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Flash Sale fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleFlashSaleById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id};
    const select = req.query.select;


    try {
        const data = await FlashSale.findOne(query)
            .populate('product', select ? select : '');

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


exports.deleteFlashSaleById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await FlashSale.deleteOne(query);

        res.status(200).json({
            message: 'Flash Sale delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editFlashSale = (req, res, next) => {
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

    FlashSale.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Flash Sale Updated Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}


