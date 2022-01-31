const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Carousel = require('../models/carousel');
const PageInfo = require('../models/page-info');
/**
 * Add Author
 * Get Author List
 */

exports.addNewCarousel = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const dataModel = new Carousel(req.body);
        await dataModel.save();
        res.status(200).json({
            message: 'Carousel Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllCarousel = async (req, res, next) => {
    try {
        let select = req.query.select;
        const data = await Carousel.find().select(select ? select : '');

        res.status(200).json({
            data: data
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

exports.getSingleCarouselById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        const data = await Carousel.findOne(query);

        res.status(200).json({
            data: data,
            message: 'Carousel get Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteCarouselById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await Carousel.deleteOne(query);
        res.status(200).json({
            message: 'Carousel delete Successfully!'
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

exports.editCarouselById = async (req, res, next) => {
    const data = req.body;
    const query = {_id: req.body._id}

    try {
        await Carousel.updateOne(query, {$set: data});

        res.status(200).json({
            message: 'Carousel updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


/**
 * Add PAGE INFO
 * Get PAGE INFO
 */

exports.addNewPageInfo = async (req, res, next) => {
    try {
        const id = req.body._id;

        if (!id) {
            const data = new PageInfo(req.body);
            await data.save();
        } else {
            await PageInfo.findOneAndUpdate({_id: id}, req.body)
        }

        res.status(200).json({
            message: 'Data Set Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getPageInfoBySlug = async (req, res, next) => {
    try {
        const data = await PageInfo.findOne({slug: req.params.slug});
        res.status(200).json({
            data: data
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


