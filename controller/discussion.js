// Require Main Modules..
const {validationResult} = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;
// Require Post Schema from Model..

const Discussion = require('../models/discussion');
const Tag = require("../models/product-tag");

exports.addDiscussion = async (req, res, next) => {

    try {
        const discussionControl = new Discussion(req.body);

        await discussionControl.save();

        res.status(200).json({
            message: 'discussion Added Successfully!'
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


exports.getAllDiscussions = async (req, res, next) => {

    try {

        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = Discussion.find();

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }


        const results = await query
            .populate('user', 'fullName profileImg username')
            .populate('product', 'productName productSlug images categorySlug brandSlug')
            .sort({createdAt: -1});

        const count = await Discussion.countDocuments();

        res.status(200).json({
            data: results,
            count: count
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllDiscussionsByQuery = async (req, res, next) => {

    try {
        const query = req.body.query;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;


        let docData = Discussion.find(query);

        if (pageSize && currentPage) {
            docData.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        //
        const discussions = await docData
            .populate('user', 'fullName profileImg username')
            .populate('product', 'productName productSlug images categorySlug brandSlug')
            .sort({createdAt: -1});

        const countDoc = await Discussion.countDocuments(query);

        res.status(200).json({
            data: discussions,
            count: countDoc
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


exports.getDiscussionByDiscussionId = async (req, res, next) => {

    try {
        const discussionId = req.params.discussionId;
        const discussion = await Discussion.findOne({_id: discussionId});

        res.status(200).json({
            data: discussion,
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

exports.editDiscussion = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const discussionId = req.body._id;

        await Discussion.updateOne(
            {_id: discussionId},
            {$set: bodyData}
        )
        res.status(200).json({
            message: 'Discussion updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.addDiscussionReplyLv1 = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const discussionId = bodyData._id;

        await Discussion.updateOne(
            {_id: discussionId},
            { $push: { reply: bodyData.reply } },
        )
        res.status(200).json({
            message: 'Discussion reply added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.addDiscussionReplyLv2 = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const discussionId = bodyData._id;
        const discussionReplyId = bodyData.replyId; //

        await Discussion.findOneAndUpdate(
            {_id: discussionId},
            { $push: {
                    "reply.$[e1].reply": bodyData.reply,
                } },
            {
                arrayFilters: [
                    { "e1._id": new ObjectId(discussionReplyId) }
                ],
            }
        )
        res.status(200).json({
            message: 'Discussion reply added Successfully!'
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

exports.deleteDiscussionByDiscussionId = async (req, res, next) => {

    const discussionId = req.params.discussionId;
    await Discussion.deleteOne({_id: discussionId});

    try {
        res.status(200).json({
            message: 'Discussion Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
