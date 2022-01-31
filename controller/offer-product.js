const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const OfferProduct = require('../models/offer-product');

/**
 *  Offer Product
 */

exports.addNewOfferProduct = async (req, res, next) => {
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
        const dataSchema = new OfferProduct(data);
        await dataSchema.save();

        res.status(200).json({
            message: 'Offer Product Added Successfully!'
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


exports.getAllOfferProduct = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = OfferProduct.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData.populate('products').sort({createdAt: -1});
        const dataCount = await OfferProduct.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Offer Product fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleOfferProductById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id};
    const select = req.query.select;


    try {
        const data = await OfferProduct.findOne(query)
            .populate('products', select ? select : '');
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


exports.getOfferProductBySlug = async (req, res, next) => {
    const productSlug = req.params.slug;
    try {
        const query = {promotionalOfferSlug: productSlug};
        const data = await OfferProduct.find(query)
        .populate('products', '-sku -attributes -filterData -tags -discussion -warrantyServices -shortDescription -description -stockVisibility -productVisibility -deliveryPolicy -paymentPolicy -warrantyPolicy')


        res.status(200).json({
            data: data,
            message: 'Offer products fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteOfferProductById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await OfferProduct.deleteOne(query);

        res.status(200).json({
            message: 'Offer Product delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editOfferProduct = (req, res, next) => {
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

    OfferProduct.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Offer Product Updated Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}


