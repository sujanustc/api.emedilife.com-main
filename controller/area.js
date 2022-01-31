// Require Main Modules..
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const Area = require('../models/area');
const District = require('../models/district');
const Vendor = require('../models/vendor');
const moment = require('moment')

exports.addArea = async (req, res, next) => {

    const data = req.body

    try {
        const area = new Area(data);
        const saveData = await area.save();

        await District.findOneAndUpdate({ _id: data.district }, {
            "$push": {
                areas: saveData._id
            }
        })

        res.status(200).json({
            message: 'Area added Successfully!'
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

exports.getAllAreas = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const areas = await Area.find({ status: true });

    try {
        res.status(200).json({
            data: areas,
            count: areas.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllAreasForAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const areas = await Area.find();

    try {
        res.status(200).json({
            data: areas,
            count: areas.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllAreaByDistrict = async (req, res, next) => {

    try {

        const filter = req.body.filter;
        const area = await Area.find({ ...filter, status: true });

        res.status(200).json({
            data: area,
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

exports.getAllAreaByDistrictForRequestMedicine = async (req, res, next) => {
    try {
        const { districtId } = req.query
        if(!districtId) return res.status(400).json({status: false, error: "Bad Request!"})
        const area = await Area.find({ district: districtId });

        return res.json({
            status: true,
            data: area,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, error: err.message})
    }
}

exports.getAreaByAreaId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const areaId = req.params.areaId;
    const area = await Area.findOne({ _id: areaId });

    try {
        res.status(200).json({
            data: area,
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


exports.editAreaData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await Area.updateOne({ _id: updatedData._id }, { $set: updatedData })
        res.status(200).json({
            message: 'Area Updated Successfully!'
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

exports.deleteAreaByAreaId = async (req, res, next) => {

    try {
        const areaId = req.params.areaId;
        const districtId = req.params.districtId;

        await District.updateOne({ _id: districtId }, { $pull: { areas: areaId } })
        await Area.deleteOne({ _id: areaId });

        res.status(200).json({
            message: 'Area Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
