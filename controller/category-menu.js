const {validationResult} = require('express-validator');

const CategoryMenu = require('../models/category-menu');

/**
 * Add Category menu
 * Get Category menu List
 */

exports.addNewCategoryMenu = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const dataModel = new CategoryMenu(req.body);
        await dataModel.save();
        res.status(200).json({
            message: 'CategoryMenu Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllCategoryMenu = async (req, res, next) => {
    try {
        const data = await CategoryMenu.find();
        res.status(200).json({
            data: data,
            message: 'All CategoryMenu fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getCategoryMenuById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        const data  = await CategoryMenu.findOne(query);

        res.status(200).json({
            data: data,
            message: 'CategoryMenu get Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteCategoryMenuById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await CategoryMenu.deleteOne(query);
        res.status(200).json({
            message: 'CategoryMenu delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateCategoryMenu = async (req, res, next) => {
    const id = req.body._id;
    const data = req.body;

    try {
        await CategoryMenu.updateOne(
            {_id: id},
            {$set: data}
        )
        res.status(200).json({
            message: 'CategoryMenu updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

