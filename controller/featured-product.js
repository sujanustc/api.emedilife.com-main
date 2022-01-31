const { validationResult } = require("express-validator");

// Require Post Schema from Model..
const FeaturedProduct = require("../models/featured-product");
const { shuffle, convertToSlug, getOffset, getMetaData } = require("../utils/utils");

/**
 * Add Gallery
 * Get Gallery List
 */

exports.addNewFeaturedProduct = async (req, res, next) => {
    try {
        const data = req.body;
        if (req.body.name)
            var slug = convertToSlug(req.body.name)
        else return res.status(400).json({ status: false, error: "Bad Request!" })
        const isExist = await FeaturedProduct.findOne({ slug: slug })
        if (isExist) slug = slug + uuidv4().substring(0, 5)
        const dataSchema = new FeaturedProduct({ ...data, slug });
        await dataSchema.save();

        res.status(200).json({
            message: "Featured Product Added Successfully!",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
};

exports.getAllFeaturedProduct = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = FeaturedProduct.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize));
        }

        const data = await queryData.populate("products").sort({ createdAt: -1 });
        const dataCount = await FeaturedProduct.countDocuments();
        var newData = []
        for (let index = 0; index < data.length; index++) {
            newData[index] = data[index];
            newData[index].products = shuffle(newData[index].products)
        }

        res.status(200).json({
            data: newData,
            count: dataCount,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
};

exports.getSingleFeaturedProductById = async (req, res) => {
    try {
        const slug = req.params.slug;
        const select = req.query.select;
        var pLimit = parseInt(req.query.pageSize);
        var page = req.query.page;
        let { offset, limit } = getOffset(page, pLimit);
        const data = await FeaturedProduct.findOne({ slug: slug }).populate({
            path: "products",
            select: select ? select : "",
            perDocumentLimit: limit,
            options: {
                skip: offset,
                sort: { createdAt: -1 }
            }
        });
        const count = await FeaturedProduct.findOne({ slug: slug })

        res.status(200).json({
            data: data,
            count: count.products.length
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
};

exports.deleteFeaturedProductById = async (req, res, next) => {
    const id = req.params.id;
    const query = { _id: id };

    try {
        await FeaturedProduct.deleteOne(query);

        res.status(200).json({
            message: "Featured Product delete Successfully!",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
};

exports.editFeaturedProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Input Validation Error! Please complete required information.");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
        return;
    }

    try {
        const updatedData = req.body;
        const query = { _id: updatedData._id };
        const push = { $set: updatedData };

        await FeaturedProduct.findOneAndUpdate(query, push);

        res.status(200).json({
            message: "Featured Product delete Successfully!",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
};

exports.getProductsByFeaturedProductId = async (req, res) => {
    try {
        const { featuredProductId, pageSize = 20, page } = req.query
        if (!featuredProductId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        const featuredProduct = await FeaturedProduct.findOne({ _id: featuredProductId }).populate({
            path: "products", populate: [
                {
                    path: 'brand',
                    model: 'ProductBrand',
                },
                {
                    path: 'generic',
                    model: 'Generic',
                },
                {
                    path: "prices.unit",
                    model: "UnitType"
                },
                {
                    path: "category"
                }
            ],
            perDocumentLimit: limit,
            options: {
                skip: offset,
                sort: { createdAt: -1 }
            }
        }).sort({ createdAt: -1 });
        const count = await FeaturedProduct.findOne({ _id: featuredProductId })
        return res.json({
            status: true,
            data: {
                products: featuredProduct.products,
                metaData: await getMetaData(page, count.products.length, offset, limit)
            },
            message: "Featured Product Get Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}
