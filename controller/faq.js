// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const Faq = require('../models/faq');

exports.addFaq = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;


    const faq = new Faq(data);

    try {
        const response = await faq.save();
        res.status(200).json({
            response,
            message: 'FAQ Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllFaq = async (req, res, next) => {
    try {
        const faq = await Faq.find();
        res.status(200).json({
            data: faq,
            count: faq.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getFaqByFaqId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const faqId = req.params.faqId;
    const faq = await Faq.findOne({_id: faqId});

    try {
        res.status(200).json({
            data: faq,
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

exports.getSingleFaqBySlug = async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const query = {slug: slug};
        const data = await Faq.findOne(query)

        res.status(200).json({
            data: data,
            message: 'FAQ fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editFaqData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await Faq.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            message: 'FAQ Updated Successfully!'
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

exports.deleteFaqByFaqId = async (req, res, next) => {

    const faqId = req.params.faqId;
    await Faq.deleteOne({_id: faqId});

    try {
        res.status(200).json({
            message: 'FAQ Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
