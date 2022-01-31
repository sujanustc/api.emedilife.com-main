// Require Main Modules..
const {validationResult} = require('express-validator');
// Require Post Schema from Model..

const ReviewControl = require('../models/review-control');

exports.addReview = async (req, res, next) => {

    try {
        const userId = req.userData.userId;
        const data = req.body;
        const finalData = {...data, ...{user: userId}};

        const reviewControl = new ReviewControl(finalData);

        await reviewControl.save();

        res.status(200).json({
            message: 'review Added Successfully!'
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


exports.getAllReviews = async (req, res, next) => {

    try {
        const reviews = await ReviewControl.find()
            .populate('user', 'fullName profileImg username')
            .populate('product', 'productName productSlug images categorySlug')
            .sort({createdAt: -1})
        res.status(200).json({
            data: reviews,
            count: reviews.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllReviewsByQuery = async (req, res, next) => {

    try {
        const query = req.body.query;
        const reviews = await ReviewControl.find(query)
            .populate('user', 'fullName profileImg username')
            .populate('product', 'productName productSlug images categorySlug')
            .sort({createdAt: -1})

        res.status(200).json({
            data: reviews,
            count: reviews.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getReviewByReviewId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const reviewId = req.params.reviewId;
    const review = await ReviewControl.findOne({_id: reviewId});

    try {
        res.status(200).json({
            data: review,
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

exports.editReview = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const reviewId = req.body._id;

        await ReviewControl.updateOne(
            {_id: reviewId},
            {$set: bodyData}
        )
        res.status(200).json({
            message: 'Review updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteReviewByReviewId = async (req, res, next) => {

    const reviewId = req.params.reviewId;
    await ReviewControl.deleteOne({_id: reviewId});

    try {
        res.status(200).json({
            message: 'Review Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
