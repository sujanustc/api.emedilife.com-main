// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const ProductAttribute = require('../models/product-attribute');

exports.addAttribute = async (req, res, next) => {
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
        const dataExists = await ProductAttribute.findOne({attributeSlug: data.attributeSlug}).lean();
        if (dataExists) {
            const error = new Error('A product attribute with this name/slug already exists');
            error.statusCode = 406;
            next(error)
        } else {
            const productAttribute = new ProductAttribute(data);
            const response = await productAttribute.save();
            res.status(200).json({
                response,
                message: 'Attribute Added Successfully!'
            });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.insertManyAttribute = async (req, res, next) => {

    try {
        const data = req.body;
        await ProductAttribute.deleteMany({});
        const result = await ProductAttribute.insertMany(data);

        res.status(200).json({
            message: `${result && result.length ? result.length : 0} Attributes imported Successfully!`
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllAttributes = async (req, res, next) => {

    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = ProductAttribute.find();

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }
        const count = await ProductAttribute.countDocuments();
        const data = await query

        res.status(200).json({
            count: count,
            data: data,
            message: 'Attribute Retrieved Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAttributeByAttributeId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const attributeId = req.params.attributeId;
    const productAttribute = await ProductAttribute.findOne({_id: attributeId});

    try {
        res.status(200).json({
            data: productAttribute,
            message: 'Attribute Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editAttributeData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await ProductAttribute.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            message: 'Attribute Updated Successfully!'
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

exports.getAttributesBySearch = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({attributeName: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        let productAttributes = ProductAttribute.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productAttributes.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productAttributes;
        const count = results.length;


        res.status(200).json({
            data: results,
            count: count
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

exports.deleteAttributeByAttributeId = async (req, res, next) => {

    const attributeId = req.params.attributeId;
    await ProductAttribute.deleteOne({_id: attributeId});

    try {
        res.status(200).json({
            message: 'Attribute Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
