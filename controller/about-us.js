// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const AboutUs = require('../models/about-us');

exports.addAboutUs = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    console.log(data)

    const aboutUs = new AboutUs(data);

    try {
        const response = await aboutUs.save();
        res.status(200).json({
            response,
            message: 'About us Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAboutUsPages = async (req, res, next) => {

    try {
        const select = req.query.select;

        const aboutUs = await AboutUs.find().select(select ? select : '');
        res.status(200).json({
            data: aboutUs,
            count: aboutUs.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAboutUsByAboutUsId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const aboutUsId = req.params.aboutUsId;
    const aboutUs = await AboutUs.findOne({_id: aboutUsId});

    try {
        res.status(200).json({
            data: aboutUs,
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

exports.getSingleAboutUsBySlug = async (req, res, next) => {
    console.log(req.params.slug);
    const slug = req.params.slug;
    try {
        const query = {slug: slug};
        const data = await AboutUs.findOne(query)

        console.log(data);

        res.status(200).json({
            data: data,
            message: 'About us fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editAboutUsData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await AboutUs.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            message: 'About us Updated Successfully!'
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

exports.deleteAboutUsByAboutUsId = async (req, res, next) => {

    const aboutUsId = req.params.aboutUsId;
    await AboutUs.deleteOne({_id: aboutUsId});

    try {
        res.status(200).json({
            message: 'About us Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
