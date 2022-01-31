const { validationResult } = require("express-validator");

// Require Post Schema from Model..
const Product = require("../models/product");
const Review = require("../models/review-control");
const User = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const UniqueId = require("../models/unique-id");
const { getOffset, getMetaData } = require("../utils/utils");
const DiscountCoupon = require("../models/discountCoupon")


/**
 * Add Product
 * Add Bulk Book
 * Get All Book List
 * Single Book by Slug
 */
const { seoMaker } = require('../utils/seoMaker')
exports.addSingleProduct = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.prices || (data.prices && (data.prices).length <= 0))
            return res.status(400).json({ status: false, message: "Missing Fields" })
        const dataExists = await Product.findOne({ productSlug: data.productSlug }).lean();

        if (dataExists) {
            const error = new Error("A product with this name/slug already exists");
            error.statusCode = 406;
            next(error);
        } else {
            // Increment Order Id Unique
            const incOrder = await UniqueId.findOneAndUpdate({}, { $inc: { skuId: 1 } }, { new: true, upsert: true });
            const skuIdUnique = padLeadingZeros(incOrder.skuId);
            var seoData;
            if (!data.seoTitle || !data.seoTags || !data.seoDescription)
                seoData = await seoMaker(data.productName, data.description)
            else {
                var obj = { seoTags: data.seoTags, seoDescription: data.seoDescription, seoTitle: data.seoTitle }
                seoData = obj
            }
            // console.log(seoData);
            const finalData = {
                ...req.body, ...{
                    sku: skuIdUnique,
                    seoTitle: seoData.seoTitle,
                    seoDescription: seoData.seoDescription,
                    seoTags: seoData.seoTags
                }
            };
            // console.log(finalData);
            const product = new Product(finalData);

            // PRODUCT
            await product.save();
            res.status(200).json({
                message: "Product Added Successfully!",
            });
        }
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

/**
 * ADDITIONAL FUNCTIONS
 */
function padLeadingZeros(num) {
    return String(num).padStart(4, "0");
}

exports.insertManyProduct = async (req, res, next) => {
    try {
        const data = req.body;
        await Product.deleteMany({});
        const result = await Product.insertMany(data);

        res.status(200).json({
            message: `${result && result.length ? result.length : 0} Products imported Successfully!`,
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

/**
 * NEW GET PRODUCT LIST
 */
exports.getProductList = async (req, res, next) => {
    try {
        let paginate = req.body.paginate;
        let filter = req.body.filter;
        let sort = req.body.sort;
        let select = req.body.select;

        let queryDoc;
        let countDoc;

        // Filter
        if (filter) {
            queryDoc = Product.find(filter);
            countDoc = Product.countDocuments(filter);
        } else {
            queryDoc = Product.find();
            countDoc = Product.countDocuments();
        }

        // Sort
        if (sort) {
            queryDoc = queryDoc.sort(sort);
        }

        // Pagination
        if (paginate) {
            queryDoc
                .skip(Number(paginate.pageSize) * (Number(paginate.currentPage) - 1))
                .limit(Number(paginate.pageSize));
        }

        const data = await queryDoc
            .select(select ? select : "")
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate("generic")
            .populate({
                path: "prices.unit",
                model: "UnitType",
                select: "name unitQuantity",
            });

        const count = await countDoc;

        res.status(200).json({
            data: data,
            count: count,
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        let paginate = req.body.paginate;
        let filter = req.body.filter;
        let select = req.body.select;
        // console.log(req.body)

        let queryData;
        let dataCount;

        let priceRange = {
            minPrice: 0,
            maxPrice: 0,
        };
        let minPrice;
        let maxPrice;

        let type = "default";
        let i = -1;

        if (filter) {
            if ("categorySlug" in filter) {
                type = "cat";
                i = index;
            }
            if ("subCategorySlug" in filter) {
                type = "subCat";
                i = index;
            }
            if ("tags" in filter) {
                type = "tag";
                i = index;
            }
            if (type === "cat") {
                minPrice = Product.find(filter[i]).sort({ price: 1 }).limit(1);
                maxPrice = Product.find(filter[i]).sort({ price: -1 }).limit(1);
            } else if (type === "subCat") {
                minPrice = Product.find(filter[i]).sort({ price: 1 }).limit(1);
                maxPrice = Product.find(filter[i]).sort({ price: -1 }).limit(1);
            } else if (type === "tag") {
                minPrice = Product.find(filter[i]).sort({ price: 1 }).limit(1);
                maxPrice = Product.find(filter[i]).sort({ price: -1 }).limit(1);
            } else {
                minPrice = Product.find().sort({ price: 1 }).limit(1);
                maxPrice = Product.find().sort({ price: -1 }).limit(1);
            }
        } else {
            minPrice = Product.find().sort({ price: 1 }).limit(1);
            maxPrice = Product.find().sort({ price: -1 }).limit(1);
        }

        const temp1 = await minPrice;
        const temp2 = await maxPrice;

        priceRange.minPrice = temp1.length > 0 ? temp1[0].price : 0;
        priceRange.maxPrice = temp2.length > 0 ? temp2[0].price : 0;

        if (filter) {
            queryData = Product.find(filter);
        } else {
            queryData = Product.find();
        }

        if (paginate) {
            queryData
                .skip(Number(paginate.pageSize) * (Number(paginate.currentPage) - 1))
                .limit(Number(paginate.pageSize));
        }

        const data = await queryData
            // .populate("attributes")
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate("tags")
            .sort({ createdAt: -1 });

        if (filter) {
            dataCount = await Product.countDocuments(filter);
        } else {
            dataCount = await Product.countDocuments();
        }

        res.status(200).json({
            data: data,
            priceRange: priceRange,
            count: dataCount > 500 ? 500 : dataCount,
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getProductsByDynamicSort = async (req, res, next) => {
    try {
        let paginate = req.body.paginate;
        let filter = req.body.filter;
        let sort = req.body.sort;

        let queryDoc;
        let countDoc;

        // Filter
        if (filter) {
            queryDoc = Product.find(filter);
            countDoc = Product.countDocuments(filter);
        } else {
            queryDoc = Product.find();
            countDoc = Product.countDocuments();
        }

        // Sort
        if (sort) {
            queryDoc = queryDoc.sort(sort);
        }

        // Pagination
        if (paginate) {
            queryDoc
                .skip(Number(paginate.pageSize) * (Number(paginate.currentPage) - 1))
                .limit(Number(paginate.pageSize));
        }

        const data = await queryDoc
            .populate("attributes")
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate("tags");

        const count = await countDoc;

        res.status(200).json({
            data: data,
            count: count > 500 ? 500 : count,
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getSingleProductBySlug = async (req, res, next) => {
    try {
        const productSlug = req.params.slug;
        const query = { productSlug: productSlug };
        const data = await Product.findOne(query)
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate("generic")
            .populate({
                path: "prices.unit",
                model: "UnitType",
            });

        var discountSubQuery = {
            $or: [
                { applyToDistrictType: "all" },
                { applyToDistrictType: "specific" }
            ],
            $or: [
                { applyToUserType: "all" },
                { applyToUserType: "specific" },
                { applyToUserType: "new" }
            ],
        }
        var userId = null, districtId = null, totalCheckout = null
        const authHeader = req.get('Authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            let decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            if (decodedToken) {
                decodedToken.userId
                if (decodedToken.userId) {
                    const isUserExist = await User.findOne({ _id: decodedToken.userId })
                        .select("addresses checkouts")
                        .populate({
                            path: "addresses",
                            match: { isDefault: true }
                        })
                    if (isUserExist) {
                        userId = decodedToken.userId
                        totalCheckout = isUserExist.checkouts.length
                        districtId = isUserExist.addresses.length ? isUserExist.addresses[0].districtId : null
                    }
                }
            }
        }
        if (userId) {
            if (districtId && totalCheckout) {
                discountSubQuery = {
                    $or: [
                        { applyToDistrictType: "all" },
                        {
                            $and: [
                                { applyToDistrictType: "specific" },
                                { applyToDistrictValue: districtId }
                            ]
                        }
                    ],
                    $or: [
                        { applyToUserType: "all" },
                        {
                            $and: [
                                { applyToUserType: "specific" },
                                { applyToUserList: userId }
                            ]
                        },
                        {
                            $and: [
                                { applyToUserType: "new" },
                                {
                                    $or: [
                                        { perUserLimitationValue: { $gte: totalCheckout } },
                                        { perUserLimitationValue: { $gte: totalCheckout } }
                                    ]
                                }
                            ]
                        }
                    ],
                }
            }
            else if (districtId) {
                discountSubQuery = {
                    $or: [
                        { applyToDistrictType: "all" },
                        {
                            $and: [
                                { applyToDistrictType: "specific" },
                                { applyToDistrictValue: districtId }
                            ]
                        }
                    ],
                    $or: [
                        { applyToUserType: "all" },
                        { applyToUserType: "specific" },
                        { applyToUserType: "new" }
                    ],
                }
            }
            else if (totalCheckout) {
                discountSubQuery = {
                    $or: [
                        { applyToDistrictType: "all" },
                        { applyToDistrictType: "specific" }
                    ],
                    $or: [
                        { applyToUserType: "all" },
                        {
                            $and: [
                                { applyToUserType: "specific" },
                                { applyToUserList: userId }
                            ]
                        },
                        {
                            $and: [
                                { applyToUserType: "new" },
                                {
                                    $or: [
                                        { perUserLimitationValue: { $gte: totalCheckout } },
                                        { perUserLimitationValue: { $gte: totalCheckout } }
                                    ]
                                }
                            ]
                        }
                    ],

                }
            }

            const discounts = await DiscountCoupon.find({
                serviceType: "emedicine",
                type: "discount",
                status: true,
                deletedAt: null,
                $and: [
                    { startingDateTime: { $lte: moment() } },
                    { endingDateTime: { $gte: moment() } }
                ],
                ...discountSubQuery,
                $or: [
                    {
                        $and: [
                            { applyForType: "global" },
                            { isExclude: false }
                        ],
                    },
                    {
                        $and: [
                            { applyForType: "global" },
                            { isExclude: true },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { excludeValue: "product" },
                                            { excludeProduct: { $ne: data._id } }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { excludeValue: "brand" },
                                            { excludeBrand: { $ne: data.brand._id } }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { excludeValue: "generic" },
                                            { excludeGeneric: { $ne: data.generic._id } }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { excludeValue: "category" },
                                            { excludeCategory: { $ne: data.category._id } }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { excludeValue: "subCategory" },
                                            { excludeSubCategory: { $ne: data.subCategory ? data.subCategory._id : null } }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        $and: [
                            { applyForType: "specific" },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { applyForValue: "product" },
                                            { product: data._id }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { applyForValue: "brand" },
                                            { brand: data.brand._id }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { applyForValue: "generic" },
                                            { generic: data.generic._id }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { applyForValue: "category" },
                                            { category: data.category._id }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { applyForValue: "subCategory" },
                                            { product: data.subCategory ? data.subCategory._id : null }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }).select("calculationType calculationValue minimumAmountToUse maximumAmountGet ")
            res.status(200).json({
                data: data,
                discounts: discounts,
                message: "Product fetch Successfully!",
            });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getSingleProductById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const query = { _id: id };
        const data = await Product.findOne(query)
            .populate("generic")
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate({
                path: "prices.unit",
                model: "UnitType",
                select: "name",
            });

        res.status(200).json({
            data: data,
            message: "Product fetch Successfully!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getRelatedProducts = async (req, res, next) => {
    const id = req.params.id;
    const generic = req.params.generic;

    try {
        const data = await Product.aggregate([
            {
                $match: {
                    $or: [
                        { generic: new ObjectId(generic) },
                        // {subCategory: new ObjectId(subCategory)},
                    ],
                    $nor: [
                        {
                            $and: [
                                {
                                    _id: new ObjectId(id),
                                },
                            ],
                        },
                    ],
                },
            },
            {
                $sample: {
                    size: 15,
                },
            },
        ]);

        // const data = await Product.find({category: category, subCategory: subCategory, $nor:[{$and:[{'_id': id}]}]});

        res.status(200).json({
            data: data,
            message: "Product fetch Successfully!",
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getRecommendedProducts = async (req, res, next) => {
    const data = req.body.data;
    let productIds = [];
    let subCategoryIds = [];

    if (data) {
        data.productIds.forEach((id) => {
            productIds.push(new ObjectId(id));
        });

        data.subCategoryIds.forEach((id) => {
            subCategoryIds.push(new ObjectId(id));
        });

        // productIds = data.productIds;
        // subCategoryIds = data.subCategoryIds;
    }

    try {
        const data = await Product.aggregate([
            {
                $match: {
                    $or: [{ subCategory: { $in: subCategoryIds } }],
                    $nor: [
                        {
                            $and: [{ _id: { $in: productIds } }],
                        },
                    ],
                },
            },
            {
                $sample: {
                    size: 6,
                },
            },
        ]);

        // const data = await Product.find({category: category, subCategory: subCategory, $nor:[{$and:[{'_id': id}]}]});

        res.status(200).json({
            data: data,
            message: "Product fetch Successfully!",
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.updateProductById = async (req, res, next) => {
    const data = req.body;
    try {
        var seoData;
        if (!data.seoTitle || !data.seoTags || !data.seoDescription)
            seoData = await seoMaker(data.productName, data.description)
        else {
            var obj = { seoTags: data.seoTags, seoDescription: data.seoDescription, seoTitle: data.seoTitle }
            seoData = obj
        }
        // console.log(seoData);
        const finalData = {
            ...req.body, ...{
                seoTitle: seoData.seoTitle,
                seoDescription: seoData.seoDescription,
                seoTags: seoData.seoTags
            }
        };
        console.log(finalData);
        await Product.findOneAndUpdate({ _id: data._id }, { $set: finalData });

        res.status(200).json({
            message: "Product Update Successfully!",
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.updateMultipleProductById = async (req, res, next) => {
    const data = req.body;
    try {
        data.forEach((m) => {
            Product.findByIdAndUpdate(m._id, { $set: m }, { new: true, multi: true }).exec();
        });

        res.status(200).json({
            message: "Bulk Product Update Successfully!",
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.bulkProductFieldUpdate = async (req, res, next) => {
    try {
        const data = req.body;

        await Product.updateMany({}, { $set: data }, { new: true, upsert: true });

        res.status(200).json({
            message: "Bulk Product Update Successfully!",
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

// Not Completed Yet
exports.updateProductImageField = async (req, res, next) => {
    try {
        const id = req.body.id;
        const data = req.body.images.length === 0 ? null : req.body.images;

        await Product.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    primaryImages: data,
                },
            }
        );
        res.status(200).json({
            message: "Product Image Updated Successfully!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

// Skip For Now
// exports.editProductData = async (req, res, next) => {

//     const updatedProduct = req.body.product;
//     const updatedProductExtra = req.body.extraData;

//     try {
//         const oldProduct = await Product.findOne({_id: updatedProduct._id});
//         await Product.findOneAndUpdate(
//             {_id: updatedProduct._id},
//             {$set: updatedProduct}
//             );
//         await ProductExtraData.findOneAndUpdate(
//             {_id: updatedProductExtra._id},
//             {$set: updatedProductExtra}
//             );

//         // Update Brand Ref

//         if (oldProduct.brand !== updatedProduct.brand) {
//             await Brand.updateOne(
//                 {_id: oldProduct.brand},
//                 {
//                     $pull: {products: oldProduct._id}
//                 }
//             )
//             await Brand.findOneAndUpdate({_id: updatedProduct.brand}, {
//                 "$push": {
//                     products: updatedProduct._id
//                 }
//             })
//         }

//         res.status(200).json({
//             message: 'Product Updated Success!'
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

// exports.deleteProductById = async (req, res, next) => {
//
//     const productId = req.params.id;
//
//     try {
//         const query = {_id: productId}
//         await Product.deleteOne(query)
//
//         res.status(200).json({
//             message: 'Product deleted Successfully!'
//         });
//
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
//
// }

exports.deleteProductById = async (req, res, next) => {
    const productId = req.params.id;

    try {
        const query = { _id: productId };
        await Product.deleteOne(query);
        await Review.deleteOne({ product: productId });

        res.status(200).json({
            message: "Product deleted Successfully!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.productFilterByQuery = async (req, res, next) => {
    try {
        const query = req.body.query;
        const paginate = req.body.paginate;
        let queryProduct;

        let priceRange = {
            minPrice: 0,
            maxPrice: 0,
        };
        let minPrice;
        let maxPrice;

        let type = "default";
        let i = -1;

        if (query) {
            query.forEach((item, index) => {
                if ("categorySlug" in item) {
                    type = "cat";
                    i = index;
                }
                if ("subCategorySlug" in item) {
                    type = "subCat";
                    i = index;
                }
                if ("tags" in item) {
                    type = "tag";
                    i = index;
                }
            });

            if (type == "cat") {
                minPrice = Product.find(query[i]).sort({ price: 1 }).limit(1);
                maxPrice = Product.find(query[i]).sort({ price: -1 }).limit(1);
            } else if (type == "subCat") {
                minPrice = Product.find(query[i]).sort({ price: 1 }).limit(1);
                maxPrice = Product.find(query[i]).sort({ price: -1 }).limit(1);
            } else if (type == "tag") {
                minPrice = Product.find(query[i]).sort({ price: 1 }).limit(1);
                maxPrice = Product.find(query[i]).sort({ price: -1 }).limit(1);
            } else {
                minPrice = Product.find().sort({ price: 1 }).limit(1);
                maxPrice = Product.find().sort({ price: -1 }).limit(1);
            }
        } else {
            minPrice = Product.find().sort({ price: 1 }).limit(1);
            maxPrice = Product.find().sort({ price: -1 }).limit(1);
        }

        const temp1 = await minPrice;
        const temp2 = await maxPrice;

        priceRange.minPrice = temp1.length > 0 ? temp1[0].price : 0;
        priceRange.maxPrice = temp2.length > 0 ? temp2[0].price : 0;

        if (req.body.select) {
            queryProduct = Product.find({ $and: query })
                .select(req.body.select)
                .populate("attributes")
                .populate("brand")
                .populate("category")
                .populate("subCategory");
        } else {
            queryProduct = Product.find({ $and: query })
                .populate("attributes")
                .populate("brand")
                .populate("category")
                .populate("subCategory");
        }

        if (paginate) {
            queryProduct
                .skip(Number(paginate.pageSize) * (Number(paginate.currentPage) - 1))
                .limit(Number(paginate.pageSize));
        }

        const productsCount = await Product.countDocuments({ $and: query });
        const result = await queryProduct;

        res.status(200).json({
            data: result,
            priceRange: priceRange,
            count: productsCount > 500 ? 500 : productsCount,
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getSpecificProductsByIds = async (req, res, next) => {
    try {
        const dataIds = req.body.ids;
        const select = req.body.select;
        const query = { _id: { $in: dataIds } };
        const data = await Product.find(query)
            .select(select ? select : "")
            // .populate('attributes')
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate({
                path: "prices.unit",
                model: "UnitType",
            });

        res.status(200).json({
            data: data,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getSpecificProductsById = async (req, res, next) => {
    try {
        const dataIds = req.body.productId;
        const query = { _id: { $in: dataIds } };
        const data = await Product.find(query).populate("extraData");
        // .select('_id name slug image price discountPercent availableQuantity author authorName');
        console.log("this is compare list");
        console.log(data);
        res.status(200).json({
            data: data,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

// exports.getProductsByLimit = async (req, res, next) => {
//     try {
//         const pageSize = +req.query.pageSize;
//         const currentPage = +req.query.page;
//         const queryProduct = Product.find();

//         if (pageSize && currentPage) {
//             queryProduct.skip(pageSize * (currentPage - 1)).limit(pageSize)
//         }

//         const productsCount = await Product.countDocuments();

//         const data = await queryProduct
//             // .populate('category', '_id categoryName slug')
//             // .populate('subCategory', '_id subCatName slug')
//             // .populate('brand', '_id brandName slug')

//         res.status(200).json({
//             data: data,
//             count: productsCount
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

// exports.getSpecificProductsByIds = async (req, res, next) => {

//     try {

//         const dataIds = req.body.productId;
//         const query = {_id: {$in: dataIds}}
//         const data = await Product.find(query).populate('productExtraData');
//             // .select('_id name slug image price discountPercent availableQuantity author authorName');

//         res.status(200).json({
//             data: data
//         });

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

// exports.getMaxMinPrice = async (req, res, next) => {
//     try {

//         const query = req.body;

//         const data = await Product.aggregate([
//             { $match:
//                  query
//             },
//             { $group: {
//                 "_id": null,
//                 "max": { "$max": "$salePrice" },
//                 "min": { "$min": "$salePrice" }
//             }}
//          ]);
//         res.status(200).json({
//             data: data,
//             message: 'Max - Min price retrieved successfully!'
//         });
//     } catch (err) {
//         console.log(err);
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

// exports.productFilterByMinMax = async (req, res, next) => {

//     try {
//         const query = req.body.query;
//         const paginate = req.body.paginate;
//         const min = req.body.range.min;
//         const max =  req.body.range.max;
//         const sort = req.body.sort;
//         // console.log(req.body.sort);

//         const queryProduct = Product.aggregate([
//             { $match:
//                 query
//             },
//             { $match:
//                 {
//                     salePrice: { "$gt": min - 1, "$lt": max + 1 }
//                 }
//             },
//             { $sort :
//                 {
//                     salePrice : sort
//                 }
//             }
//         ]);

//         if (paginate) {
//             queryProduct.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
//         }

//         const result = await queryProduct;

//         const count = await Product.aggregate(
//             [
//                 { $match:
//                     query
//                 },
//                 { $match:
//                     {
//                         salePrice: { "$gt" : min - 1, "$lt": max + 1}
//                     }
//                 },
//                 { $count:
//                     "productsCount"
//                 }
//             ]
//         );

//         // console.log(count[0].productsCount);

//         res.status(200).json({
//             data: result,
//             count: count[0].productsCount
//         });

//     } catch (err) {
//         console.log(err)
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

// exports.getSearchProductByRegex = async (req, res, next) => {
//     try {

//         // console.log(req.query.s);

//         const query = req.query.q;
//         const sort = parseInt(req.query.s);
//         // console.log(sort);
//         const paginate = req.body.paginate;

//         // SPLIT STRING AND REGEX
//         const newQuery = query.split(/[ ,]+/);
//         const queryArray = newQuery.map((str) => ({name: RegExp(str, 'i')}));
//         // console.log(queryArray);

//         // REGEX ONLY
//         const regex = new RegExp(query, 'i')
//         // console.log(regex);

//         if (sort !== 0) {

//             // console.log("Sort");

//             products = Product.find({

//                 $or: [
//                     {
//                         $and: queryArray
//                     },
//                     {productCode: regex}
//                 ]

//             }).sort({ "salePrice": sort});

//         } else {

//             // console.log("No Sort");

//             products = Product.find({

//                 $or: [
//                     {
//                         $and: queryArray
//                     },
//                     {productCode: regex}
//                 ]

//             });

//         }

//         if (paginate) {
//             products.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
//         }

//         const results = await products;

//         const count = results.length;

//         // console.log(results);
//         // console.log(count);

//         res.status(200).json({
//             data: results,
//             count: count
//         });
//     } catch (err) {
//         console.log(err);
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

// exports.filterByCatSubCatBrandFilters = async (req, res, next) => {
//     try {

//         const util = require('util');

//         const data = req.body;
//         // console.log("Data Starts Here");
//         // console.log(util.inspect(data, {showHidden: false, depth: null}));
//         // console.log("Data Ends Here");

//         const catSlug = data.filter.fixedData.categorySlug;
//         const subCatSlug = data.filter.fixedData.subCatSlug;
//         const filterData = data.filter.filterData;

//         // console.log(filterData);

//         mappedFilterData = filterData.map(a => (key => ({ key:key, value: a[key] }))(Object.keys(a)[0]));

//         var sortedObj = {};
//         var sortedArrObj = {};
//         let string = "";
//         for( var i = 0, max = mappedFilterData.length; i < max ; i++ ){
//             const temp = mappedFilterData[i].key;
//             string = temp.substring(0, 0) + temp.substring(8, temp.length);
//             if( sortedObj[mappedFilterData[i].key] == undefined ){
//                 sortedArrObj[string] = [];
//                 sortedObj[mappedFilterData[i].key] = [];
//             }
//             const obj = {[mappedFilterData[i].key]: mappedFilterData[i].value}
//             sortedArrObj[string].push(obj);
//             sortedObj[mappedFilterData[i].key].push(obj);
//         }

//         const sortedArrObjNoKey = Object.values(sortedArrObj);

//         let queryArray = [];
//         // here each element is an array
//         sortedArrObjNoKey.forEach(element => queryArray.push({"$or": element}));
//         // console.log(util.inspect(queryArray, {showHidden: false, depth: null}));

//         let queryProduct = null;
//         let count = null;

//         const paginate = data.paginate;

//         count = await Product.countDocuments(
//             {
//                 $and: [
//                     {
//                         $and: queryArray
//                     },
//                     {categorySlug: catSlug},
//                     {subCatSlug: subCatSlug}
//                 ]
//             }
//         );
//         console.log(count);

//         queryProduct = await Product.find(
//             {
//                 $and: [
//                     {
//                         $and: queryArray
//                     },
//                     {categorySlug: catSlug},
//                     {subCatSlug: subCatSlug}
//                 ]
//             }
//         ).skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize);

//         res.status(200).json({
//             data: queryProduct,
//             count: count
//         });

//     } catch (err) {
//         console.log(err);
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

// exports.ultimateQuery = async (req, res, next) => {

//     try {

//         const util = require('util');
//         // console.log("");
//         // console.log("");
//         // console.log("<----- Body Data ----->");
//         // console.log("");
//         // console.log(util.inspect(req.body, {showHidden: false, depth: null}))

//         // CATEGORY SUB-CATEGORY SLUG
//         const query = req.body.query;

//         // PAGINATION
//         const paginate = req.body.paginate;

//         // PRICE SORT
//         let sort = 1;
//         if(req.body.sort){
//             sort = req.body.sort;
//         }

//         // PRICE RANGE
//         let min = 0;
//         let max = 10000000;
//         if(req.body.range){
//             min = req.body.range.min;
//             max =  req.body.range.max;
//         }

//         // FILTER
//         let filterData = null;
//         let queryArray = [];
//         if(req.body.filterData) {
//             mappedFilterData = req.body.filterData.map(a => (key => ({ key:key, value: a[key] }))(Object.keys(a)[0]));
//             var sortedObj = {};
//             var sortedArrObj = {};
//             let keys = "";
//             for( var i = 0, maximum = mappedFilterData.length; i < maximum ; i++ ){
//                 const temp = mappedFilterData[i].key;
//                 keys = temp.substring(0, 0) + temp.substring(8, temp.length);
//                 if( sortedObj[mappedFilterData[i].key] == undefined ){
//                     sortedArrObj[keys] = [];
//                     sortedObj[mappedFilterData[i].key] = [];
//                 }
//                 const obj = {[mappedFilterData[i].key]: mappedFilterData[i].value}
//                 sortedArrObj[keys].push(obj);
//                 sortedObj[mappedFilterData[i].key].push(obj);
//             }
//             const sortedArrObjNoKey = Object.values(sortedArrObj);
//             // here each element is an array
//             sortedArrObjNoKey.forEach(element => queryArray.push({"$or": element}));
//             filterData = queryArray;
//             // console.log("");
//             // console.log("<----- Processed Filter Data ----->");
//             // console.log("");
//             // console.log(util.inspect(filterData, {showHidden: false, depth: null}))
//         }

//         let queryProduct = null;
//         let searchQuery;

//         if (filterData) {
//             searchQuery = Product.aggregate(
//                 [
//                     { $match:
//                         query
//                     },
//                     { $match:
//                             {
//                                 salePrice: { "$gt" : min - 1, "$lt": max + 1}
//                             }
//                     },
//                     { $match:
//                             {
//                                 $and: queryArray
//                             }
//                     },
//                     {
//                         $count: "searchCount"
//                     }
//                 ]
//             )

//             queryProduct = Product.aggregate([
//                 { $match:
//                     query
//                 },
//                 { $match:
//                     {
//                         salePrice: { "$gt" : min - 1, "$lt": max + 1}
//                     }
//                 },
//                 { $match:
//                     {
//                         $and: queryArray
//                     }
//                 },
//                 { $sort :
//                     {
//                         salePrice : sort
//                     }
//                 },
//                 { $project :
//                     {
//                         name_fuzzy: 0
//                     }
//                 }
//             ]);
//         } else {

//             searchQuery = Product.aggregate(
//                 [
//                     { $match:
//                         query
//                     },
//                     { $match:
//                             {
//                                 salePrice: { "$gt" : min - 1, "$lt": max + 1}
//                             }
//                     },
//                     {
//                         $count: "searchCount"
//                     }
//                 ]
//             )

//             queryProduct = Product.aggregate([
//                 { $match:
//                     query
//                 },
//                 { $match:
//                     {
//                         salePrice: { "$gt" : min - 1, "$lt": max + 1}
//                     }
//                 },
//                 { $sort :
//                     {
//                         salePrice : sort
//                     }
//                 }
//             ]);
//         }

//         if (paginate) {
//             queryProduct.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
//         }

//         const result = await queryProduct;
//         const count = await searchQuery;
//         // console.log(count)
//         //
//         // console.log("");
//         // console.log("<----- Count ----->");
//         // console.log("");
//         // console.log(util.inspect(count, {showHidden: false, depth: null}))

//         res.status(200).json({
//             data: result,
//             count: count && count.length > 0 ? Number(count[0].searchCount) : 0
//         });

//     } catch (err) {
//         console.log(err)
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

exports.getProductsBySearch = async (req, res, next) => {
    try {
        // Query Text
        const search2 = req.query.q
        var search = search2.replace(/[^A-Za-z0-9]/g, " ");

        // Additional Filter
        const filter = req.body.filter;

        // Pagination
        const pageSize = +req.query.pageSize;
        // const pageSize = 50
        const currentPage = +req.query.currentPage;

        // Build Regex Query
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ productName: RegExp(str, "i") }));
        const queryArray2 = newQuery.map((str) => ({ sku: RegExp(str, "i") }));
        // const queryArray3 = newQuery.map((str) => ({phoneNo: RegExp(str, 'i')}));
        // const queryArray4 = newQuery.map((str) => ({username: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        let dataDoc;
        let countDoc;

        if (filter) {
            dataDoc = Product.find({
                $and: [
                    filter,
                    {
                        $or: [
                            { $and: queryArray },
                            { $and: queryArray2 },
                            // {$and: queryArray3},
                            // {$and: queryArray4},
                        ],
                    },
                ],
            }).populate({
                path: "brandDetails",
                select: "brandName _id",
            });
            countDoc = dataDoc = Product.countDocuments({
                $and: [
                    filter,
                    {
                        $or: [
                            { $and: queryArray },
                            { $and: queryArray2 },
                            // {$and: queryArray3},
                            // {$and: queryArray4},
                        ],
                    },
                ],
            });
        } else {
            dataDoc = Product.find({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 },
                    // {$and: queryArray3},
                    // {$and: queryArray4},
                ],
            }).populate({
                path: "brandDetails",
                select: "_id brandName brandSlug",
            });

            countDoc = Product.countDocuments({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 },
                    // {$and: queryArray3},
                    // {$and: queryArray4},
                ],
            });
        }

        // {marketer: {$in: [null]}}

        if (pageSize && currentPage) {
            dataDoc.skip(pageSize * (currentPage - 1)).limit(Number(pageSize));
        }

        const results = await dataDoc;
        const count = await countDoc;

        res.status(200).json({
            data: results,
            count: count > 500 ? 500 : count,
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getProductsBySearchForCustomOrder = async (req, res, next) => {
    try {
        // Query Text
        const search = req.query.q;

        // Additional Filter
        const filter = req.body.filter;

        // Pagination
        const pageSize = +req.query.pageSize;
        // const pageSize = 50
        const currentPage = +req.query.currentPage;

        // Build Regex Query
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ productName: RegExp(str, "i") }));
        const queryArray2 = newQuery.map((str) => ({ sku: RegExp(str, "i") }));
        // const queryArray3 = newQuery.map((str) => ({phoneNo: RegExp(str, 'i')}));
        // const queryArray4 = newQuery.map((str) => ({username: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        let dataDoc;
        let countDoc;

        if (filter) {
            dataDoc = Product.find({
                $and: [
                    filter,
                    {
                        $or: [
                            { $and: queryArray },
                            { $and: queryArray2 },
                            // {$and: queryArray3},
                            // {$and: queryArray4},
                        ],
                    },
                ],
            }).populate({
                path: "brandDetails",
                select: "brandName _id",
            }).populate({
                path: "prices.unit",
                model: "UnitType",
                select: "name unitValue unitQuantity"
            });
            countDoc = dataDoc = Product.countDocuments({
                $and: [
                    filter,
                    {
                        $or: [
                            { $and: queryArray },
                            { $and: queryArray2 },
                            // {$and: queryArray3},
                            // {$and: queryArray4},
                        ],
                    },
                ],
            });
        } else {
            dataDoc = Product.find({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 },
                    // {$and: queryArray3},
                    // {$and: queryArray4},
                ],
            }).populate({
                path: "brandDetails",
                select: "_id brandName brandSlug",
            }).populate({
                path: "prices.unit",
                model: "UnitType",
                select: "name unitValue unitQuantity"
            });

            countDoc = Product.countDocuments({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 },
                    // {$and: queryArray3},
                    // {$and: queryArray4},
                ],
            });
        }

        // {marketer: {$in: [null]}}

        if (pageSize && currentPage) {
            dataDoc.skip(pageSize * (currentPage - 1)).limit(Number(pageSize));
        }

        const results = await dataDoc;
        const count = await countDoc;

        res.status(200).json({
            data: results,
            count: count > 500 ? 500 : count,
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.resetAllProductDiscout = async (req, res) => {
    try {
        var pLimit = parseInt(req.body.pageSize);
        var page = req.body.page;
        let { offset, limit } = getOffset(page, pLimit);
        var data = await Product.find().skip(offset).limit(limit);
        const count = await Product.countDocuments();

        for (let index = 0; index < data.length; index++) {
            var data2 = data[index]
            var prices = data2.prices;
            for (let index2 = 0; index2 < prices.length; index2++) {
                prices[index2].discountType = 0
                prices[index2].discountAmount = 0
            }
            await Product.updateOne({ _id: data2._id }, { prices: prices })
            console.log("Product Discount Reset Successfully ", offset + index + 1);
        }

        res.json({
            status: true,
            nowUpdated: limit,
            startingFrom: offset + 1,
            endindAt: offset + limit,
            totalCompleted: offset + limit,
            totalRemaining: count - (offset + limit),
            pageNo: page,
            pageSize: pLimit,
            message: "Do Not change Page Size, and maintain page sequence"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error })
    }
}


// App API
exports.getProductsByCategoryId = async (req, res) => {
    try {
        const { categoryId, pageSize = 20, page = 1 } = req.query
        if (!categoryId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const { offset, limit } = getOffset(page, parseInt(pageSize));
        const results = await Product.find({ productVisibility: true, category: categoryId })
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate("generic")
            .populate("prices.unit")
            .skip(offset).limit(limit).sort({ createdAt: -1 });
        const count = await Product.countDocuments({ productVisibility: true, category: categoryId });
        return res.json({
            status: true,
            data: {
                products: results,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Product By Category Get Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.getProductsByBrandId = async (req, res) => {
    try {
        const { brandId, pageSize = 20, page = 1 } = req.query
        if (!brandId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const { offset, limit } = getOffset(page, parseInt(pageSize));
        const results = await Product.find({ productVisibility: true, brand: brandId })
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate("generic")
            .populate("prices.unit")
            .skip(offset).limit(limit).sort({ createdAt: -1 });
        const count = await Product.countDocuments({ productVisibility: true, brand: brandId });
        return res.json({
            status: true,
            data: {
                products: results,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Product by Brand Get Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.getProductsByGenericId = async (req, res) => {
    try {
        const { genericId, pageSize = 20, page = 1 } = req.query
        if (!genericId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const { offset, limit } = getOffset(page, parseInt(pageSize));
        const results = await Product.find({ productVisibility: true, generic: genericId })
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate("generic")
            .populate("prices.unit")
            .skip(offset).limit(limit).sort({ createdAt: -1 });
        const count = await Product.countDocuments({ productVisibility: true, generic: genericId });
        return res.json({
            status: true,
            data: {
                products: results,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Product by Generic Get Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.getAllProductsForApp = async (req, res) => {
    try {
        var { filter, pageSize = 20, page = 1 } = req.query

        var newFilter = {
            deletedAt: null,
            productVisibility: true,
            brand: { $ne: null },
            category: { $ne: null },
            generic: { $ne: null }
        }
        if (filter) {
            filter = JSON.parse(filter)
            !filter.brand ? filter.brand = [] : null
            !filter.category ? filter.category = [] : null
            !filter.generic ? filter.generic = [] : null
            newFilter = {
                deletedAt: null,
                productVisibility: true,
                brand: filter.brand.length > 0 ? filter.brand : { $ne: null },
                category: filter.category.length > 0 ? filter.category : { $ne: null },
                generic: filter.generic.length > 0 ? filter.generic : { $ne: null }
            }
        }

        const { offset, limit } = getOffset(page, parseInt(pageSize));
        const results = await Product.find(newFilter)
            .populate("brand")
            .populate("category")
            .populate("subCategory")
            .populate("generic")
            .populate("prices.unit")
            .skip(offset).limit(limit).sort({ createdAt: 1 });
        const count = await Product.countDocuments(newFilter);
        return res.json({
            status: true,
            data: {
                products: results,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Product Get Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.getProductsBySearchForApp = async (req, res) => {
    try {
        // Query Text
        const { searchString, pageSize = 20, page = 1 } = req.query
        // if(!searchString) return res.status(400).json({status: false, error: "Bad Request!"})
        const search = searchString.replace(/[^A-Za-z0-9]/g, " ");
        // Build Regex Query
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ productName: RegExp(str, "i") }));
        const queryArray2 = newQuery.map((str) => ({ productSlug: RegExp(str, "i") }));

        const { offset, limit } = getOffset(page, parseInt(pageSize));
        const data = await Product.find({
            $or: [
                { $and: queryArray },
                { $and: queryArray2 }
            ],
        }).populate({
            path: "brandDetails",
            select: "brandName -_id",
        }).skip(offset).limit(limit);
        const count = await Product.countDocuments({
            $or: [
                { $and: queryArray },
                { $and: queryArray2 }
            ],
        });

        return res.json({
            ststus: true,
            data: {
                products: data,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Get Searched Product Successfully!"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
}

exports.getAllProductList = async (req, res) => {
    try {
        const { searchString, pageSize = 10, page = 1 } = req.query

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        var data, count
        if (!searchString) {
            data = await Product.find().select("_id productName").skip(offset).limit(limit).sort({ name: 1 })
            count = await Product.countDocuments()
        } else {
            const search = searchString.replace(/[^A-Za-z0-9]/g, " ");
            // Build Regex Query
            const newQuery = search.split(/[ ,]+/);
            const queryArray = newQuery.map((str) => ({ productName: RegExp(str, "i") }));
            const queryArray2 = newQuery.map((str) => ({ productSlug: RegExp(str, "i") }));

            data = await Product.find({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 }
                ],
            }).select("_id productName").skip(offset).limit(limit).sort({ name: 1 })
            count = await Product.countDocuments({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 }
                ],
            });
        }

        return res.json({
            status: true,
            data: {
                products: data,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Get Product Successfully!"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, error: err.message })
    }
}