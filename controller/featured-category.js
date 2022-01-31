const { validationResult } = require("express-validator");

// Require Post Schema from Model..
const FeaturedCategory = require("../models/featured-category");
const { shuffle, convertToSlug } = require("../utils/utils");
const { v4: uuidv4 } = require('uuid');
/**
 * Add Gallery
 * Get Gallery List
 */

exports.addNewFeaturedCategory = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error("Input Validation Error! Please complete required information.");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
        return;
    }
    try {
        const data = req.body;
        const dataSchema = new FeaturedCategory(data);
        const x = await dataSchema.save();

        // console.log("request:", req.body);
        // console.log("response:", x);
        res.status(200).json({
            message: "Featured Category Added Successfully!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getAllFeaturedCategory = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = FeaturedCategory.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize));
        }

        const data = await queryData.populate("products").sort({ createdAt: -1 });
        const dataCount = await FeaturedCategory.countDocuments();
        // console.log("request:", req.query);
        // console.log("response:", data);
        var newData = []
        for (let index = 0; index < data.length; index++) {
            newData[index] = data[index];
            newData[index].products = shuffle(newData[index].products)
        }
        res.status(200).json({
            data: newData,
            count: dataCount,
            message: "Featured Category fetch Successfully!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getSingleFeaturedCategoryById = async (req, res, next) => {
    const id = req.params.id;
    const query = { _id: id };
    const select = req.query.select;

    try {
        const data = await FeaturedCategory.findOne(query).populate("products", select ? select : "");

        // console.log("request:", req.query);
        // console.log("response:", data);
        res.status(200).json({
            data: data,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.deleteFeaturedCategoryById = async (req, res, next) => {
    const id = req.params.id;
    const query = { _id: id };

    try {
        await FeaturedCategory.deleteOne(query);

        res.status(200).json({
            message: "Featured Category delete Successfully!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.editFeaturedCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Input Validation Error! Please complete required information.");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
        return;
    }

    try {
        const updatedData = req.body;
        const query = { _id: updatedData._id };
        const push = { $set: updatedData };

        const data = await FeaturedCategory.findOneAndUpdate(query, push);
        // console.log("request:", req.body);
        // console.log("response:", data);
        res.status(200).json({
            message: "Featured Category delete Successfully!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};
