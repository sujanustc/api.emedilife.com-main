// Require Main Modules..
const {validationResult} = require('express-validator');


// Require Post Schema from Model..
const Brand = require('../models/product-brand');

exports.getPromotionalBrands = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        queryProduct = Brand.find({priority: {$gt: 0}}).sort({priority: 1});

    const data = await queryProduct
    // console.log(data);

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


exports.getAllBrands = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        let queryProduct;
        let count = await Brand.countDocuments();

        if (pageSize && currentPage) {
            queryProduct = Brand.find({
                $or: [
                    {priority: {$exists: false}}, 
                    {priority: {$eq: 0}}
                ]
            }).skip(pageSize * (currentPage - 1)).limit(pageSize)
        } else queryProduct = Brand.find({
            $or: [
                {priority: {$exists: false}}, 
                {priority: {$eq: 0}}
            ]
        });

    const data = await queryProduct

    res.status(200).json({
        data: data,
        count: count
    });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}