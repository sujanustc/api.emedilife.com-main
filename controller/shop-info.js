// Require Main Modules..
const {validationResult} = require('express-validator');

const ShopInfo = require('../models/shop-info');

/**
 * BASIC INFO
 */

exports.addShopInfo = async (req, res, next) => {
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
        const footer = new ShopInfo(data);
        await footer.save();

        res.status(200).json({
            message: 'Shop info Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getShopInfo = async (req, res, next) => {


    try {
        const data = await ShopInfo.findOne();

        res.status(200).json({
            data: data,
            message: 'Shop info Get!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateShopInfo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const id = req.body._id;

        await ShopInfo.findOneAndUpdate({_id: id}, req.body);

        res.status(200).json({
            message: 'Shop Info Updated Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

