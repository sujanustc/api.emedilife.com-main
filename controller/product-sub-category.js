// Require Main Modules..
const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const ProductSubCategory = require('../models/product-sub-category');
const Product = require('../models/product');
const ProductCategory = require('../models/product-category')
const { getOffset, getMetaData } = require('../utils/utils');

exports.addSubCategory = async (req, res, next) => {
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
        const dataExists = await ProductSubCategory.findOne({ subCategorySlug: data.subCategorySlug }).lean();

        if (dataExists) {
            const error = new Error('A product sub category with this name/slug already exists');
            error.statusCode = 406;
            next(error)
        } else {
            const productSubCategory = new ProductSubCategory(data);
            const response = await productSubCategory.save();
            res.status(200).json({
                response,
                message: 'Sub Category Added Successfully!'
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

exports.insertManySubCategory = async (req, res, next) => {

    try {
        const data = req.body;
        await ProductSubCategory.deleteMany({});
        const result = await ProductSubCategory.insertMany(data);

        res.status(200).json({
            message: `${result && result.length ? result.length : 0} Category imported Successfully!`
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllSubCategoryWithCount = async (req, res, next) => {
    try {
        var pLimit = parseInt(req.query.pageSize);
        var page = req.query.page;
        let { offset, limit } = getOffset(page, pLimit);
        var results = await ProductSubCategory.find().skip(offset).limit(limit);
        const count = await ProductSubCategory.countDocuments();
        getNewListWithCount(results, (data) => {
            res.status(200).json({
                data,
                count: count,
                message: 'All SubCategory fatch Successfully!'
            });
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getAllSubCategory = async (req, res, next) => {
    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = ProductSubCategory.find({ readOnly: { $ne: true } })
            .populate('category')
            .populate('attributes');

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }
        const results = await query;
        const count = await ProductSubCategory.countDocuments();

        res.status(200).json({
            data: results,
            count: count,
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
const getNewListWithCount = async (results, next) => {
    var newData = [];
    for (let index = 0; index < results.length; index++) {
        var item = results[index];
        var count2 = await Product.countDocuments({ subCategory: item._id });
        var category = await ProductCategory.findOne({ _id: item.category })
        newData.push({
            ...item._doc,
            productCount: count2,
            categoryName: category ? category.categoryName : null
        })
        if (index === results.length - 1) next(newData);
    }
}

exports.getSubCategoryBySubCategoryId = async (req, res, next) => {

    try {
        const subCategoryId = req.params.subCategoryId;
        const productSubCategory = await ProductSubCategory.findOne({ _id: subCategoryId })
            .populate('attributes');
        res.status(200).json({
            data: productSubCategory,
            // message: 'Brand Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editSubCategoryData = async (req, res, next) => {

    const updatedData = req.body;

    try {

        await ProductSubCategory.updateOne({ _id: updatedData._id }, { $set: updatedData })

        await Product.updateMany({ subCategory: updatedData._id }, { subCategorySlug: updatedData.subCategorySlug })
        res.status(200).json({
            message: 'SubCategory Updated Successfully!'
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

exports.getSubCategoriesBySearch = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ subCategoryName: RegExp(str, 'i') }));
        // const regex = new RegExp(query, 'i')

        let productSubCategories = ProductSubCategory.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productSubCategories.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productSubCategories;
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

exports.getSubCategoryByCategoryId = async (req, res, next) => {

    try {

        const categoryId = req.params.categoryId;
        const productSubCategory = await ProductSubCategory.find({ category: categoryId })
            .populate('attributes');

        res.status(200).json({
            data: productSubCategory,
            // message: 'Brand Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSubCategoryBySubCategorySlug = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const subCategorySlug = req.params.subCategorySlug;
    const productSubCategory = await ProductSubCategory
        .findOne({ subCategorySlug: subCategorySlug })
        .populate('attributes')

    try {
        res.status(200).json({
            data: productSubCategory,
            // message: 'Brand Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// exports.deleteSubCategoryBySubCategoryId = async (req, res, next) => {
//
//     const subCategoryId = req.params.subCategoryId;
//     await ProductSubCategory.deleteOne({_id: subCategoryId});
//
//     try {
//         res.status(200).json({
//             message: 'Sub Category Deleted Successfully',
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

exports.deleteSubCategoryBySubCategoryId2 = async (req, res, next) => {

    const subCategoryId = req.params.subCategoryId;
    const defaultSubCategory = await ProductSubCategory.findOne({ readOnly: true });
    await Product.updateMany({ subCategory: subCategoryId }, {
        $set: {
            subCategory: defaultSubCategory._id,
            subCategorySlug: defaultSubCategory.subCategorySlug
        }
    })
    await ProductSubCategory.deleteOne({ _id: subCategoryId });

    try {
        res.status(200).json({
            message: 'Sub Category Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteSubCategoryBySubCategoryId = async (req, res, next) => {

    try {
        const subCategoryId = req.params.subCategoryId;
        if (!subCategoryId) return res.json({ status: false, message: "Missing Fields" })

        const isExist = await ProductSubCategory.findOne({ _id: subCategoryId })
        if (!isExist) return res.json({ status: false, message: "Sub category not found with this Id" })

        const sameSlugSubCategory = await ProductSubCategory.findOne({ subCategorySlug: isExist.subCategorySlug, _id: { $ne: subCategoryId } })
        if (!sameSlugSubCategory) {
            const defaultSubCategory = await ProductSubCategory.findOne({ subCategorySlug: "others" })
            await Product.updateMany({ subCategory: subCategoryId }, { $set: { subCategory: defaultSubCategory._id, subCategorySlug: defaultSubCategory.subCategorySlug } })
            await ProductSubCategory.deleteOne({ _id: subCategoryId });
        }
        else {
            await Product.updateMany({ subCategory: subCategoryId }, { $set: { subCategory: sameSlugSubCategory._id, subCategorySlug: sameSlugSubCategory.subCategorySlug } })
            await ProductSubCategory.deleteOne({ _id: subCategoryId });
        }
        res.status(200).json({ status: true, message: "Brand Deleted successfully" })
    }
    catch (error) {
        console.log(error);
        res.json({ status: false, error })
    }
}


exports.getSubCategoriesBySearchWithCount = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ subCategoryName: RegExp(str, 'i') }));
        // const regex = new RegExp(query, 'i')

        let productSubCategories = ProductSubCategory.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productSubCategories.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productSubCategories;
        const count = results.length;


        getNewListWithCount(results, (data) => {
            res.status(200).json({
                data,
                count: count,
                message: 'All SubCategory fatch Successfully!'
            });
        })
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllSubCategoryListForFilter = async (req, res) => {
    try {
        const { searchString, pageSize = 10, page = 1 } = req.query

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        var data, count
        if (!searchString) {
            data = await ProductSubCategory.find().select("_id subCategoryName").skip(offset).limit(limit).sort({ name: 1 })
            count = await ProductSubCategory.countDocuments()
        } else {
            const search = searchString.replace(/[^A-Za-z0-9]/g, " ");
            // Build Regex Query
            const newQuery = search.split(/[ ,]+/);
            const queryArray = newQuery.map((str) => ({ subCategoryName: RegExp(str, "i") }));
            const queryArray2 = newQuery.map((str) => ({ subCategorySlug: RegExp(str, "i") }));

            data = await ProductSubCategory.find({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 }
                ],
            }).select("_id subCategoryName").skip(offset).limit(limit).sort({ name: 1 })
            count = await ProductSubCategory.countDocuments({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 }
                ],
            });
        }

        return res.json({
            status: true,
            data: {
                SubCategories: data,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Get Generic Successfully!"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, error: err.message })
    }
}