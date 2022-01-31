// Require Main Modules..
const { validationResult } = require('express-validator');
const { resolveContent } = require('nodemailer/lib/shared');
const Generic = require('../models/product-generic');
const Product = require('../models/product.js');
const { getOffset, getMetaData } = require('../utils/utils');
// const { getNewListWithCount } = require('../utils/utils');


exports.addSingleGeneric = async (req, res, next) => {

    try {

        const data = req.body;
        const dataExists = await Generic.findOne({ slug: data.slug }).lean();

        if (dataExists) {
            const error = new Error('A product generic with this name/slug already exists');
            error.statusCode = 406;
            next(error)
        } else {
            const generic = new Generic(data);
            const tagRes = await generic.save();
            res.status(200).json({
                response: tagRes,
                message: 'Generic Added Successfully!'
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

exports.insertManyGeneric = async (req, res, next) => {

    try {
        const data = req.body;
        // await Generic.deleteMany({});
        const result = await Generic.insertMany(data);

        res.status(200).json({
            success: true,
            message: `${result && result.length ? result.length : 0} Generics imported Successfully!`
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllGenericsWithCount = async (req, res, next) => {

    try {
        var pLimit = parseInt(req.query.pageSize);
        var page = req.query.page;
        let { offset, limit } = getOffset(page, pLimit);
        var results = await Generic.find().skip(offset).limit(limit).sort({ name: 1 });
        const count = await Generic.countDocuments();
        getNewListWithCount(results, (data) => {
            res.status(200).json({
                data,
                count: count,
                message: 'All Generic fetch Successfully!'
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


exports.getAllGenerics = async (req, res, next) => {

    try {

        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = Generic.find();

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        var results = await query.sort({ name: 1 });
        const count = await Generic.countDocuments();

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

// exports.getAllGenericsForAddProduct =  async (req, res)=>{
//     try {
//         const data = await Generic.find();
//         res.status(200).json({
//             status: true,
//             data: data,
//             message: 'All Generics fetch Successfully!'
//         });
//     } catch (err) {
//         res.status(err.statusCode).json({status: false, error: err.message})
//     }
// }

const getNewListWithCount = async (results, next) => {
    var newData = [];
    for (let index = 0; index < results.length; index++) {
        var item = results[index];
        var count2 = await Product.countDocuments({ genericSlug: item.slug });
        newData.push({
            ...item._doc,
            productCount: count2,
        })
        if (index === results.length - 1) next(newData);
    }
}


exports.getGenericByGenericId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const tagId = req.params.tagId;
    const productGeneric = await Generic.findOne({ _id: tagId });

    try {
        res.status(200).json({
            data: productGeneric,
            message: 'Generic Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editGenericData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await Generic.updateOne({ _id: updatedData._id }, { $set: updatedData })
        res.status(200).json({
            message: 'Generic Updated Successfully!'
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

exports.deleteGenericByGenericId2 = async (req, res, next) => {

    const tagId = req.params.tagId;
    await Generic.deleteOne({ _id: tagId });

    try {
        res.status(200).json({
            message: 'Generic Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getGenericsBySearch = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ name: RegExp(str, 'i') }));
        // const regex = new RegExp(query, 'i')

        let productGenerics = Generic.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productGenerics.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productGenerics;
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


exports.getGenericsBySearchWithCount = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ name: RegExp(str, 'i') }));
        // const regex = new RegExp(query, 'i')

        let productGenerics = Generic.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productGenerics.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productGenerics;
        const count = results.length;


        getNewListWithCount(results, (data) => {
            res.status(200).json({
                data,
                count: count,
                message: 'All Generic fetch Successfully!'
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

exports.deleteGenericByGenericId = async (req, res, next) => {

    try {
        const genericId = req.params.tagId;
        if (!genericId) return res.json({ status: false, message: "Missing Fields" })
        console.log(genericId);
        const isExist = await Generic.findOne({ _id: genericId })
        console.log(isExist);
        if (!isExist) return res.json({ status: false, message: "Generic not found with this Id" })

        const sameSlugGeneric = await Generic.findOne({ slug: isExist.slug, _id: { $ne: genericId } })
        if (!sameSlugGeneric) {
            const defaultGeneric = await Generic.findOne({ slug: "others" })
            await Product.updateMany({ generic: genericId }, { generic: defaultGeneric._id, genericSlug: defaultGeneric.slug })
            await Generic.deleteOne({ _id: genericId })
        }
        else {
            await Product.updateMany({ generic: genericId }, { generic: sameSlugGeneric._id, genericSlug: sameSlugGeneric.slug })
            await Generic.deleteOne({ _id: genericId })
        }

        res.status(200).json({ status: true, message: "Brand Deleted successfully" })

    } catch (err) {
        console.log(error);
        res.status(500).json({ status: false, error })
    }
}

exports.getAllGenericsForFilter = async (req, res) => {
    try {
        const { searchString, pageSize = 50, page = 1 } = req.query

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        var data, count
        if (!searchString) {
            data = await Generic.find().select("_id name").skip(offset).limit(limit).sort({ name: 1 })
            count = await Generic.countDocuments()
        } else {
            const search = searchString.replace(/[^A-Za-z0-9]/g, " ");
            // Build Regex Query
            const newQuery = search.split(/[ ,]+/);
            const queryArray = newQuery.map((str) => ({ name: RegExp(str, "i") }));
            const queryArray2 = newQuery.map((str) => ({ slug: RegExp(str, "i") }));

            data = await Generic.find({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 }
                ],
            }).select("_id name").skip(offset).limit(limit).sort({ name: 1 })
            count = await Generic.countDocuments({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 }
                ],
            });
        }

        return res.json({
            status: true,
            data: {
                generics: data,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Get Generic Successfully!"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, error: err.message })
    }
}