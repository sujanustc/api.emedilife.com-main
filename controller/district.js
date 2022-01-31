// Require Main Modules..
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const District = require('../models/district');
const Area = require("../models/area");
const moment = require('moment');
const { getOffset, getMetaData } = require('../utils/utils');

exports.addDistrict = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;


    const district = new District(data);

    try {
        const response = await district.save();
        res.status(200).json({
            response,
            message: 'District Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllDistricts = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const districts = await District.find({ status: true })
    try {
        res.status(200).json({
            data: districts,
            count: districts.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllDistrictsForRequestMedicine = async (req, res, next) => {
    try {
        const districts = await District.find()
        return res.json({
            status: true,
            data: districts,
            count: districts.length
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
}

exports.getAllDistrictsForAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const districts = await District.find()
    try {
        res.status(200).json({
            data: districts,
            count: districts.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getDistrictByDistrictId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const districtId = req.params.districtId;
    const district = await District.findOne({ _id: districtId })

    try {
        res.status(200).json({
            data: district,
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

exports.editDistrictData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await District.updateOne({ _id: updatedData._id }, { $set: updatedData })
        res.status(200).json({
            message: 'District Updated Successfully!'
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

exports.deleteDistrictByDistrictId = async (req, res, next) => {

    const districtId = req.params.districtId;
    await District.deleteOne({ _id: districtId });

    try {
        res.status(200).json({
            message: 'District Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.oneTimeDistrictApi = async (req, res) => {
    try {
        const { districtName } = req.body;
        await District.updateOne({ district: districtName }, { status: true })
        await District.updateMany({ district: { $ne: districtName } }, { status: false })
        const district = await District.findOne({ district: districtName })
        await Area.updateMany({ district: district._id }, { status: true })
        await Area.updateMany({ district: { $ne: district._id } }, { status: false })

        return res.json({
            status: true,
            message: "All Task Done Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error
        })
    }
}

exports.getAllDistrictList = async (req, res) => {
    try {
        const { searchString, pageSize = 10, page = 1 } = req.query

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        var data, count
        if (!searchString) {
            data = await District.find({ status: true }).select("_id district districtbn areas").populate({
                path: "areas",
                model: "Area",
                select: "_id area areabn"
            }).skip(offset).limit(limit).sort({ name: 1 })
            count = await District.countDocuments({ status: true })
        } else {
            const search = searchString.replace(/[^A-Za-z0-9]/g, " ");
            // Build Regex Query
            const newQuery = search.split(/[ ,]+/);
            const queryArray = newQuery.map((str) => ({ district: RegExp(str, "i") }));

            data = await District.find({
                $or: [
                    { $and: queryArray },
                ],
                status: true
            }).populate({
                path: "areas",
                model: "Area",
                select: "_id area areabn"
            }).select("_id district districtbn areas").skip(offset).limit(limit).sort({ name: 1 })
            count = await District.countDocuments({
                $or: [
                    { $and: queryArray },
                ],
                status: true
            });
        }

        return res.json({
            status: true,
            data: {
                districts: data,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Get Districts Successfully!"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, error: err.message })
    }
}
