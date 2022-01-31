// Require Main Modules..
const {validationResult} = require('express-validator');
const UnitType = require('../models/product-unit-type');


exports.addSingleUnitType = async (req, res, next) => {

    try {

        const data = req.body;
        const dataExists = await UnitType.findOne({name: data.name}).lean();

        if (dataExists) {
            const error = new Error('A product unitType with this name already exists');
            error.statusCode = 406;
            next(error)
        } else {
            const unitType = new UnitType(data);
            const tagRes = await unitType.save();
            res.status(200).json({
                response: tagRes,
                message: 'UnitType Added Successfully!'
            });
        }

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.insertManyUnitType = async (req, res, next) => {

    try {
        const data = req.body;
        // await UnitType.deleteMany({});
        const result = await UnitType.insertMany(data);

        res.status(200).json({
            message: `${result && result.length ? result.length : 0} UnitTypes imported Successfully!`
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllUnitTypes = async (req, res, next) => {
    try {

        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = UnitType.find();

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const results = await query;
        const count = await UnitType.countDocuments();

        res.status(200).json({
            data: results,
            count: count,
            message: 'All Product fetch Successfully!'
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

exports.getUnitTypeByUnitTypeId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const tagId = req.params.id;
    const productUnitType = await UnitType.findOne({_id: tagId});

    try {
        res.status(200).json({
            data: productUnitType,
            message: 'UnitType Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editUnitTypeData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await UnitType.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            message: 'UnitType Updated Successfully!'
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

exports.deleteUnitTypeByUnitTypeId = async (req, res, next) => {

    const tagId = req.params.id;
    await UnitType.deleteOne({_id: tagId});

    try {
        res.status(200).json({
            message: 'UnitType Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getUnitTypesBySearch = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({name: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        let productUnitTypes = UnitType.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productUnitTypes.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productUnitTypes;
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
