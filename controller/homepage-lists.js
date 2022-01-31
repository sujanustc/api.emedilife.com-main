const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const HomepageLists = require('../models/homepage-lists');

exports.addList = async (req, res, next) => {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //     const error = new Error('Input Validation Error! Please complete required information.');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     next(error)
    //     return;
    // }

    const data = req.body;

    try {

        const homepageList = new HomepageLists(data);
        await homepageList.save();


        res.status(200).json({
            message: 'Product Added Successfully!'
        });

    } catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllLists = async (req, res, next) => {
    try {

        const data = await HomepageLists.findOne()
            .populate({path: 'shopByCategory', populate: {path: 'category'}})
            .populate({path: 'dealsOfTheDayList', populate: {path: 'product'}})
            .populate({path: 'brandList', populate: {path: 'brand'}})
            .populate({path: 'dealsOnPlay', populate: {path: 'product'}})
            .populate({path: 'selectedCategory1', populate: {path: 'products'}})
            .populate({path: 'selectedCategory2', populate: {path: 'products'}})
            .populate({path: 'selectedCategory3', populate: {path: 'products'}})
            .populate({path: 'featured', populate: {path: 'product'}})
            .populate({path: 'bestSeller', populate: {path: 'product'}})
            .populate({path: 'specialProduct', populate: {path: 'product'}})
            .populate({path: 'recommendedForYou', populate: {path: 'product'}});
        // .populate({path: 'variation', populate: {path: 'attributes.attribute'} });

        res.status(200).json({
            data: data,
            message: 'All Product fetch Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editListByListId = async (req, res, next) => {

    const listData = req.body.data;

    try {

        await HomepageLists.findOneAndUpdate({_id: req.params.listId},
            {
                $set: listData
            }
        );

        res.status(200).json({
            message: 'Product Updated Success!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteListByListName = async (req, res, next) => {

    const listName = req.params.listName;
    const listData = [];

    try {

        await HomepageLists.findOneAndUpdate({},
            {
                $set: {
                    [listName]: listData
                }
            }
        );

        res.status(200).json({
            message: 'Product deleted Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}
