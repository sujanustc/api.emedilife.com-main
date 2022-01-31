// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const CareerEsquire = require('../models/career-esquire');

exports.addCareerEsquire = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;


    const careerEsquire = new CareerEsquire(data);

    try {
        const response = await careerEsquire.save();
        res.status(200).json({
            response,
            message: 'Career at Esquire Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllCareerEsquire = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const careerEsquire = await CareerEsquire.find();

    try {
        res.status(200).json({
            data: careerEsquire,
            count: careerEsquire.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getCareerEsquireById = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const careerEsquireId = req.params.careerEsquireId;
    const careerEsquire = await CareerEsquire.findOne({_id: careerEsquireId});

    try {
        res.status(200).json({
            data: careerEsquire,
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

exports.getCareerEsquireBySlug = async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const query = {slug: slug};
        const data = await CareerEsquire.findOne(query)

        res.status(200).json({
            data: data,
            message: 'Career at Esquire fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editCareerEsquireData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await CareerEsquire.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            message: 'Career at Esquire Updated Successfully!'
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

exports.deleteCareerEsquireById = async (req, res, next) => {

    const careerEsquireId = req.params.careerEsquireId;
    await CareerEsquire.deleteOne({_id: careerEsquireId});

    try {
        res.status(200).json({
            message: 'Career at Esquire Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
