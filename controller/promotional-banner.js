// Require Main Modules..
const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const PromotionalBanner = require('../models/promotional-banner');

exports.addBanner = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;

    const promotionalBanner = new PromotionalBanner(data);

    try {

        await promotionalBanner.save();
        res.status(200).json({
            message: 'Promotional Banner Added Successfully!'
        });
    } catch (err) {
        // console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllBanners = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const promotionalBanners = await PromotionalBanner.find().sort({priority: 1});

    try {
        res.status(200).json({
            data: promotionalBanners,
            // message: 'Category Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getBannerByTag = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    // const categoryId = req.params.categoryId;
    const promotionalBanners = await PromotionalBanner.find({tag: req.body.tag}).sort({priority: 1});

    try {
        res.status(200).json({
            data: promotionalBanners,
            // message: 'Brand Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateBanner = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const id = req.body.id;
        // const data = req.body.images.length === 0 ? null : req.body.images

        await PromotionalBanner.findOneAndUpdate({_id: id}, req.body);
        res.status(200).json({
            message: 'Promotional banner Updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteBanner = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const id = req.body.id;
        // const data = req.body.images.length === 0 ? null : req.body.images

        await PromotionalBanner.findOneAndDelete({_id: id});
        res.status(200).json({
            message: 'Promotional Banner deleted Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
