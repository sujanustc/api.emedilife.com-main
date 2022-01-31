// Require Main Modules..
const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const ProductCategory = require('../models/product-category');
const Product = require('../models/product');
const ProductSubCategory = require('../models/product-sub-category');
const { getOffset, getMetaData } = require('../utils/utils');
const { addBrand } = require('./product-brand');


exports.addCategory = async (req, res, next) => {
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
        const dataExists = await ProductCategory.findOne({ categorySlug: data.categorySlug }).lean();
        if (dataExists) {
            const error = new Error('A product category with this name/slug already exists');
            error.statusCode = 406;
            next(error)
        } else {
            const productCategory = new ProductCategory(data);
            const response = await productCategory.save();
            res.status(200).json({
                response,
                message: 'Category Added Successfully!'
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

exports.insertManyCategory = async (req, res, next) => {

    try {
        const data = req.body;
        // await ProductCategory.deleteMany({});
        const result = await ProductCategory.insertMany(data);

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


exports.getAllCategoryWithCount = async (req, res, next) => {

    try {
        var pLimit = parseInt(req.query.pageSize);
        var page = req.query.page;
        let { offset, limit } = getOffset(page, pLimit);
        var results = await ProductCategory.find().skip(offset).limit(limit).sort({ categoryName: 1 });
        const count = await ProductCategory.countDocuments();
        getNewListWithCount(results, (data) => {
            res.status(200).json({
                data,
                count: count,
                message: 'All Category fetch Successfully!'
            });
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getAllCategory = async (req, res, next) => {

    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        const isFeatured = req.query.isFeatured;
        const select = req.query.select;

        let queryDoc;
        let countDoc;

        if (isFeatured && Boolean(isFeatured)) {
            queryDoc = ProductCategory.find({ readOnly: { $ne: true }, isFeatured: '1' });
            countDoc = ProductCategory.countDocuments({ readOnly: { $ne: true }, isFeatured: '1' });
        } else {
            queryDoc = ProductCategory.find({ readOnly: { $ne: true } });
            countDoc = ProductCategory.countDocuments({ readOnly: { $ne: true } });
        }


        if (pageSize && currentPage) {
            queryDoc.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const results = await queryDoc.select(select ? select : '').sort({ categoryName: 1 });
        const count = await countDoc;


        res.status(200).json({
            data: results,
            count: count,
            message: 'All Category fetch Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}



// exports.getAllCategoryforAddProduct = async (req, res, next) => {
//     try {
//         const data = await ProductCategory.findAll();
//         res.status(200).json({
//             status: true,
//             data: data,
//             message: 'All Category fetch Successfully!'
//         });
//     } catch (err) {
//         res.status(err.statusCode).json({ status: false, error: err.message })
//     }
// }

const getNewListWithCount = async (results, next) => {
    var newData = [];
    for (let index = 0; index < results.length; index++) {
        var item = results[index];
        var count2 = await Product.countDocuments({ categorySlug: item.categorySlug });
        var count3 = await ProductSubCategory.countDocuments({ category: item._id });
        newData.push({
            ...item._doc,
            productCount: count2,
            subcategoryCount: count3
        })
        if (index === results.length - 1) next(newData);
    }
}

exports.getCategoryByCategoryId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const categoryId = req.params.categoryId;
    const productCategory = await ProductCategory.findOne({ _id: categoryId });

    try {
        res.status(200).json({
            data: productCategory,
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

exports.editCategoryData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await ProductCategory.updateOne({ _id: updatedData._id }, { $set: updatedData });

        await Product.updateMany({ category: updatedData._id }, { categorySlug: updatedData.categorySlug });

        res.status(200).json({
            message: 'SubCategory Updated Successfully!'
        });

        res.status(200).json({
            message: 'Category Updated Successfully!'
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

exports.getCategoriesBySearch = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ categoryName: RegExp(str, 'i') }));
        // const regex = new RegExp(query, 'i')

        let productCategories = ProductCategory.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productCategories.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productCategories;
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

exports.getCategoryByCategorySlug = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const categorySlug = req.params.categorySlug;
    const productCategory = await ProductCategory
        .findOne({ categorySlug: categorySlug })
        .populate('attributes')


    try {
        res.status(200).json({
            data: productCategory,
            // message: 'Brand Added Successfully!'
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

// exports.deleteCategoryByCategoryId = async (req, res, next) => {
//
//     const categoryId = req.params.categoryId;
//     await ProductCategory.deleteOne({_id: categoryId});
//
//     try {
//         res.status(200).json({
//             message: 'Category Deleted Successfully',
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

exports.deleteCategoryByCategoryId2 = async (req, res, next) => {

    const categoryId = req.params.categoryId;
    const defaultCategory = await ProductCategory.findOne({ readOnly: true });
    const defaultSubCategory = await ProductSubCategory.findOne({ readOnly: true });
    await Product.updateMany({ category: categoryId }, { $set: { category: defaultCategory._id, categorySlug: defaultCategory.categorySlug, subCategory: defaultSubCategory._id, subCategorySlug: defaultSubCategory.subCategorySlug } })
    await ProductSubCategory.deleteMany({ category: categoryId });
    await ProductCategory.deleteOne({ _id: categoryId });

    try {
        res.status(200).json({
            message: 'Category Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getCategoriesBySearchWithCount = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ categoryName: RegExp(str, 'i') }));
        // const regex = new RegExp(query, 'i')

        let productCategories = ProductCategory.find({
            $or: [
                { $and: queryArray }
            ]
        }).sort({ categoryName: 1 });

        if (pageSize && currentPage) {
            productCategories.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productCategories;
        const count = results.length;


        getNewListWithCount(results, (data) => {
            res.status(200).json({
                data,
                count: count,
                message: 'All Brand fetch Successfully!'
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


exports.deleteCategoryByCategoryId = async (req, res, next) => {

    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) return res.josn({ status: false, message: "Missing Fields" })

        const isExist = await ProductCategory.findOne({ _id: categoryId })
        if ((!isExist)) return res.json({ status: false, message: "Category not found with this Id" })

        const sameSlugCategory = await ProductCategory.findOne({ categorySlug: isExist.categorySlug, _id: { $ne: categoryId } })
        if (!sameSlugCategory) {
            const defaultCategory = await ProductCategory.findOne({ categorySlug: "others" });
            await Product.updateMany({ category: categoryId }, { $set: { category: defaultCategory._id, categorySlug: defaultCategory.categorySlug } })
            await ProductSubCategory.updateMany({ category: categoryId }, { category: defaultCategory._id });
            await ProductCategory.deleteOne({ _id: categoryId });
        }
        else {
            await Product.updateMany({ category: categoryId }, { $set: { category: sameSlugCategory._id, categorySlug: sameSlugCategory.categorySlug } })
            await ProductSubCategory.updateMany({ category: categoryId }, { category: sameSlugCategory._id });
            await ProductCategory.deleteOne({ _id: categoryId });
        }

        res.status(200).json({ status: true, message: "Category Deleted successfully" })
    }
    catch (error) {
        console.log(error);
        res.json({ status: false, error })
    }
}

exports.getAllCategoryForApp = async (req, res, next) => {
    try {
        const { pageSize = 20, page = 1 } = req.query

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        const results = await ProductCategory.find().skip(offset).limit(limit).sort({ categoryName: 1 });
        const count = await ProductCategory.countDocuments();
        return res.json({
            status: true,
            data: {
                category: results,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: 'All Category fetch Successfully!'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).josn({ status: false, error: err.message })
    }
}

exports.getAllCategoryListForFilter = async (req, res) => {
    try {
        const { searchString, pageSize = 50, page = 1 } = req.query

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        var data, count
        if (!searchString) {
            data = await ProductCategory.find().select("_id categoryName").skip(offset).limit(limit).sort({ name: 1 })
            count = await ProductCategory.countDocuments()
        } else {
            const search = searchString.replace(/[^A-Za-z0-9]/g, " ");
            // Build Regex Query
            const newQuery = search.split(/[ ,]+/);
            const queryArray = newQuery.map((str) => ({ categoryName: RegExp(str, "i") }));
            const queryArray2 = newQuery.map((str) => ({ categorySlug: RegExp(str, "i") }));

            data = await ProductCategory.find({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 }
                ],
            }).select("_id categoryName").skip(offset).limit(limit).sort({ name: 1 })
            count = await ProductCategory.countDocuments({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 }
                ],
            });
        }

        return res.json({
            status: true,
            data: {
                categories: data,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Get Categories Successfully!"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, error: err.message })
    }
}