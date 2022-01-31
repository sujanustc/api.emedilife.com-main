const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const PromotionalOffer = require('../models/promotional-offer');

/**
 * Add PromotionalOffer
 * Get PromotionalOffer List
 */

exports.addNewPromotionalOffer = async (req, res, next) => {
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

        const dataExists = await PromotionalOffer.findOne({slug: data.slug}).lean();

        if (dataExists) {
            const error = new Error('A Promotional Offer with this name already registered!');
            error.statusCode = 406;
            next(error)
        } else {
            const dataSchema = new PromotionalOffer(data);
            await dataSchema.save();

            res.status(200).json({
                message: 'Promotional Offer Image Added Successfully!'
            });
        }
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.addNewPromotionalOfferMulti = async (req, res, next) => {

    try {

        const data = req.body.data;
        await PromotionalOffer.insertMany(data);

        res.status(200).json({
            message: 'Multiple Product Added to Promotional Offer Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllPromotionalOffer = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        const select = req.query.select;

        let queryData;
        queryData = PromotionalOffer.find().select(select ? select : '');

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData.sort({createdAt: -1});
        const dataCount = await PromotionalOffer.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSinglePromotionalOfferById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        const data = await PromotionalOffer.findOne(query);
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

exports.getSinglePromotionalOfferBySlug = async (req, res, next) => {
    const slug = req.params.slug;
    const query = {slug: slug}

    try {
        const data = await PromotionalOffer.findOne(query);
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


exports.deletePromotionalOfferById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await PromotionalOffer.deleteOne(query);
        res.status(200).json({
            message: 'Promotional Offer delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deletePromotionalOfferMulti = async (req, res, next) => {
    const ids = req.body.data;

    try {
        await PromotionalOffer.deleteMany({_id: ids});
        res.status(200).json({
            message: 'Promotional Offers delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editPromotionalOfferData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const updatedData = req.body;
    const query = {_id: updatedData._id}
    const push = {$set: updatedData}

    PromotionalOffer.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Promotional Offer Updated Success!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}


