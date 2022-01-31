// Require Main Modules..
const { validationResult } = require('express-validator');
const Brand = require('../models/product-brand');
const Product = require('../models/product');
const ProductCategory = require("../models/product-category");
const { getOffset, getMetaData } = require('../utils/utils');

exports.addBrand = async (req, res, next) => {
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
        const dataExists = await Brand.findOne({ brandSlug: data.brandSlug }).lean();

        if (dataExists) {
            const error = new Error('A product brand with this name/slug already exists');
            error.statusCode = 406;
            next(error)
        } else {
            const brand = new Brand(data);
            const response = await brand.save();
            res.status(200).json({
                response,
                message: 'Brand Added Successfully!'
            });
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.insertManyBrand = async (req, res, next) => {

    try {
        const data = req.body;
        // await Brand.deleteMany({});
        const result = await Brand.insertMany(data);

        res.status(200).json({
            message: `${result && result.length ? result.length : 0} Brands imported Successfully!`
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllBrands = async (req, res, next) => {


    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        const select = req.query.select;
        const isFeatured = req.query.isFeatured;

        let queryDoc;
        let countDoc;

        if (isFeatured && Boolean(isFeatured)) {
            queryDoc = Brand.find({ readOnly: { $ne: true }, isFeatured: '1' });
            countDoc = Brand.countDocuments({ readOnly: { $ne: true }, isFeatured: '1' });
        } else {
            queryDoc = Brand.find({ readOnly: { $ne: true } });
            countDoc = Brand.countDocuments({ readOnly: { $ne: true } });
        }


        if (pageSize && currentPage) {
            queryDoc.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }
        const results = await queryDoc.select(select ? select : '').sort({ brandName: 1 });
        const count = await countDoc;
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



exports.getAllBrandsWithCount = async (req, res, next) => {
    try {
        var pLimit = parseInt(req.query.pageSize);
        var page = req.query.page;
        let { offset, limit } = getOffset(page, pLimit);
        var results = await Brand.find().skip(offset).limit(limit).sort({ brandName: 1 });
        const count = await Brand.countDocuments();
        getNewListWithCount(results, (data) => {
            res.status(200).json({
                data,
                count: count,
                message: 'All Brand fetch Successfully!'
            });
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// exports.getAllBrandsForAddProduct = async (req, res) => {
//     try {
//         const data = await Brand.find();
//         res.status(200).json({
//             status: true,
//             data: data,
//             message: 'All Brands fetch Successfully!'
//         });
//     } catch (err) {
//         res.status(err.statusCode).json({ status: false, error: err.message })
//     }
// }
const getNewListWithCount = async (results, next) => {
    var newData = [];
    for (let index = 0; index < results.length; index++) {
        var item = results[index];
        var count2 = await Product.countDocuments({ brand: item._id });//sd
        newData.push({
            ...item._doc,
            productCount: count2,
        })
        if (index === results.length - 1) next(newData);
    }
}

exports.getBrandByBrandId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const brandId = req.params.brandId;
    const brand = await Brand.findOne({ _id: brandId });

    try {
        res.status(200).json({
            data: brand,
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

exports.editBrandData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await Brand.updateOne({ _id: updatedData._id }, { $set: updatedData });
        await Product.updateMany({ brand: updatedData._id }, { brandSlug: updatedData.brandSlug });
        res.status(200).json({
            message: 'Brand Updated Successfully!'
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

exports.getParentCategoriesBySearch = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ brandName: RegExp(str, 'i') }));
        // const regex = new RegExp(query, 'i')

        let productBrands = Brand.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productBrands.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productBrands;
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

exports.getBrandsBySearchWithCount = async (req, res, next) => {
    try {

        const search = req.query.q;
        if (!search && search != '') return res.status(400).json({ status: false, message: "Missing Fields" })
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ brandName: RegExp(str, 'i') }));
        // const regex = new RegExp(query, 'i')
        let productBrands = Brand.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productBrands.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productBrands;
        const count = results.length;

        getNewListWithCount(results, (data) => {
            res.status(200).json({
                data,
                count: count,
                message: 'All Brand fetch Successfully!'
            });
        })


        // res.status(200).json({
        //     data: results,
        //     count: count
        // });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// exports.deleteBrandByBrandId = async (req, res, next) => {
//
//     const brandId = req.params.brandId;
//     await Brand.deleteOne({_id: brandId});
//
//     try {
//         res.status(200).json({
//             message: 'Brand Deleted Successfully',
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

exports.deleteBrandByBrandId2 = async (req, res, next) => {

    const brandId = req.params.brandId;

    const defaultBrand = await Brand.findOne({ readOnly: true });

    await Product.updateMany({ brand: brandId }, { $set: { brand: defaultBrand._id, brandSlug: defaultBrand.brandSlug } })
    await Brand.deleteOne({ _id: brandId });

    try {
        res.status(200).json({
            message: 'Brand Deleted Successfully',
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

exports.deleteBrandByBrandId = async (req, res, next) => {
    try {
        // const {brandId} = req.body;
        const brandId = req.params.brandId;
        if (!brandId) return res.json({ status: false, message: "Missing Fields" })

        const isExist = await Brand.findOne({ _id: brandId })
        if (!isExist) return res.json({ status: false, message: "Brand Not find with this Id" })

        const sameSlugBrand = await Brand.findOne({ brandSlug: isExist.brandSlug, _id: { $ne: brandId } })
        if (!sameSlugBrand) {
            const defaultBrand = await Brand.findOne({ brandSlug: "others" });
            await Product.updateMany({ brand: brandId }, { $set: { brand: defaultBrand._id, brandSlug: defaultBrand.brandSlug } })
            await Brand.deleteOne({ _id: brandId });
        }
        else {
            await Product.updateMany({ brand: brandId }, { $set: { brand: sameSlugBrand._id, brandSlug: sameSlugBrand.brandSlug } })
            await Brand.deleteOne({ _id: brandId });
        }

        res.status(200).json({ ststus: true, message: "Brand Deleted successfully" })

    } catch (error) {
        console.log(error);
        res.json({ status: false, error })
    }
}

exports.getAllBrandsForApp = async (req, res, next) => {
    try {
        const { pageSize = 20, page = 1 } = req.query

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        const results = await Brand.find().skip(offset).limit(limit).sort({ brandName: 1 });
        const count = await Brand.countDocuments();

        return res.json({
            status: true,
            data: {
                brands: results,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: 'All Brand fetch Successfully!'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
}

exports.getAllBrandListForFilter = async (req, res) => {
    try {
        const { searchString, pageSize = 10, page = 1 } = req.query

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        var data, count
        if (!searchString) {
            data = await Brand.find().select("_id brandName").skip(offset).limit(limit).sort({ name: 1 })
            count = await Brand.countDocuments()
        } else {
            const search = searchString.replace(/[^A-Za-z0-9]/g, " ");
            // Build Regex Query
            const newQuery = search.split(/[ ,]+/);
            const queryArray = newQuery.map((str) => ({ brandName: RegExp(str, "i") }));

            data = await Brand.find({
                $or: [
                    { $and: queryArray },
                ],
            }).select("_id brandName").skip(offset).limit(limit).sort({ name: 1 })
            count = await Brand.countDocuments({
                $or: [
                    { $and: queryArray },
                ],
            });
        }

        return res.json({
            status: true,
            data: {
                brands: data,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Get Brands Successfully!"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, error: err.message })
    }
}