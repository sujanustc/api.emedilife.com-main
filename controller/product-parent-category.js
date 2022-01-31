// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const ProductCategory = require('../models/product-brand');
const ProductParentCategory = require('../models/product-parent-category');
const ProductSubCategory = require('../models/product-sub-category');
const Product = require('../models/product');

exports.addParentCategory = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;

    const productParentCategory = new ProductParentCategory(data);

    try {
        await productParentCategory.save();
        res.status(200).json({
            message: 'ParentCategory Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllParentCategory = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const productParentCategories = await ProductParentCategory.find();

    try {
        res.status(200).json({
            data: productParentCategories,
            count: productParentCategories.length
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

exports.getParentCategoryByParentCategoryId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const parentCategoryId = req.params.parentCategoryId;
    const productParentCategory = await ProductParentCategory.findOne({_id: parentCategoryId});

    try {
        res.status(200).json({
            data: productParentCategory,
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

exports.getParentCategoriesBySearch = async (req, res, next) => {
    try {

        const search = req.body.search;
        const paginate = req.body.paginate;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({name: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        let productParentCategory;
        productParentCategory = ProductParentCategory.find({
            $or: [
                {$and: queryArray}
            ]
        });

        if (paginate) {
            productParentCategory = productParentCategory.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
        }

        const results = await productParentCategory;
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


exports.deleteParentCategoryByParentCategoryId = async (req, res, next) => {

    const parentCategoryId = req.params.parentCategoryId;

    const defaultParentCategory = await ProductParentCategory.findOne({readOnly: true});
    const defaultCategory = await ProductCategory.findOne({readOnly: true});
    const defaultSubCategory = await ProductSubCategory.findOne({readOnly: true});
    await Product.updateMany({parentCategory: parentCategoryId}, {
        $set: {
            parentCategory: defaultParentCategory._id,
            parentCategorySlug: defaultParentCategory.parentCategorySlug,
            category: defaultCategory._id,
            categorySlug: defaultCategory.categorySlug,
            subCategory: defaultSubCategory._id,
            subCategorySlug: defaultSubCategory.subCategorySlug
        }
    })
    await ProductSubCategory.deleteMany({parentCategory: parentCategoryId});
    await ProductCategory.deleteMany({parentCategory: parentCategoryId});
    await ProductParentCategory.deleteOne({_id: parentCategoryId});

    try {
        res.status(200).json({
            message: 'Parent Category Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
