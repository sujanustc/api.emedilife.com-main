// Require Main Modules..
const {validationResult} = require('express-validator');

const FooterData = require('../models/footer-data');

/**
 * Footer Data
 */

exports.addFooterData = async (req, res, next) => {
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
        const footer = new FooterData(data);
        await footer.save();

        res.status(200).json({
            message: 'Footer Data Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getFooterData = async (req, res, next) => {


    try {
        const data = await FooterData.findOne();

        res.status(200).json({
            data: data,
            message: 'Footer Data Get!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateFooterData = async (req, res, next) => {
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

        await FooterData.findOneAndUpdate({_id: id}, req.body);

        res.status(200).json({
            message: 'Footer Data Updated Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

