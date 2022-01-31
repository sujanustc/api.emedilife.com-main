// Require Main Modules..
const {validationResult} = require('express-validator');

const PromoPage = require('../models/promo-page');

/**
 * BASIC INFO
 */

exports.addPromoPage = async (req, res, next) => {
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
        const promoPage = new PromoPage(data);
        await promoPage.save();

        res.status(200).json({
            message: 'Promo Page Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getPromoPage = async (req, res, next) => {


    try {
        const data = await PromoPage.findOne();

        res.status(200).json({
            data: data,
            message: 'Promo Page info Get!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updatePromoPageInfo = async (req, res, next) => {
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

        await PromoPage.findOneAndUpdate({_id: id}, req.body);

        res.status(200).json({
            message: 'Promo Page Info Updated Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deletePromoPage = async (req, res, next) => {
    try {
        const id = req.params.id;

        await PromoPage.deleteOne({_id: id});

        res.status(200).json({
            message: 'Promo Page Deleted Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

