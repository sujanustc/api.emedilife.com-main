const DiscountCoupon = require("../models/discountCoupon")
const moment = require('moment');
const { getOffset } = require("../utils/utils");
const User = require("../models/user");
const District = require("../models/district")
const DiscountCouponUsedHistory = require("../models/discountCouponUsedHistory");
const product = require("../models/product");
const addDiscountCoupon = async (req, res) => {
    try {
        const body = req.body;
        if (!body.title || !body.serviceType || !body.type || !body.globalLimitationType || !body.perUserLimitationType || !body.calculationType
            || !body.startingDateTime || !body.endingDateTime || !body.applyToUserType || !body.applyToDistrictType || !body.applyForType)
            return res.status(400).json({ status: false, error: "Bad Request!" })
        // if (body.calculationType == "percentage" && !body.maximumAmountGet) return res.status(400).json({ status: false, error: "Bad Request!" })
        if (body.type == "coupon" && !body.couponCode) return res.status(400).json({ status: false, error: "Bad Request!" })
        if (body.type == "coupon") {
            const isExist = await DiscountCoupon.findOne({ couponCode: body.couponCode }).lean()
            if (isExist) return res.json({ status: false, error: "This Coupon Code Already Exist!" })
        }

        var startingDateTime = moment(body.startingDateTime).format()
        var endingDateTime = moment(body.endingDateTime).format()
        if (startingDateTime >= endingDateTime)
            return res.json({ status: false, error: "Ending Date-Time Must Be Greater Then Starting Date-Time" })

        var applyForValue = [];
        if (body.applyForType == "specific") {
            (body.brand && body.brand.length > 0) ? applyForValue.push("brand") : null;
            (body.generic && body.generic.length > 0) ? applyForValue.push("generic") : null;
            (body.category && body.category.length > 0) ? applyForValue.push("category") : null;
            (body.subCategory && body.subCategory.length > 0) ? applyForValue.push("subCategory") : null;
            (body.product && body.product.length > 0) ? applyForValue.push("product") : null;
        }
        var excludeValue = [];
        if (body.applyForType == "global" && body.isExclude) {
            (body.excludeBrand && body.excludeBrand.length > 0) ? excludeValue.push("brand") : null;
            (body.excludeGeneric && body.excludeGeneric.length > 0) ? excludeValue.push("generic") : null;
            (body.excludeCategory && body.excludeCategory.length > 0) ? excludeValue.push("category") : null;
            (body.excludeSubCategory && body.excludeSubCategory.length > 0) ? excludeValue.push("subCategory") : null;
            (body.excludeProduct && body.excludeProduct.length > 0) ? excludeValue.push("product") : null;
        }
        const discountCoupon = new DiscountCoupon({
            serviceType: body.serviceType,
            type: body.type,
            status: body.status,
            title: body.title,
            couponCode: body.type == "coupon" ? body.couponCode : null,
            globalLimitationType: body.globalLimitationType,
            globalLimitaionValue: body.globalLimitationType == "limited" ? body.globalLimitaionValue : null,
            perUserLimitationType: body.perUserLimitationType,
            perUserLimitationValue: body.perUserLimitationType == "limited" ? body.perUserLimitationValue : null,
            calculationType: body.calculationType,
            calculationValue: body.calculationValue,
            minimumAmountToUse: body.minimumAmountToUse,
            maximumAmountGet: body.maximumAmountGet,
            startingDateTime: startingDateTime,
            endingDateTime: endingDateTime,
            applyToUserType: body.applyToUserType,
            applyToUserList: body.applyToUserList,
            applyToDistrictType: body.applyToDistrictType,
            applyToDistrictValue: body.applyToDistrictType == "specific" ? body.applyToDistrictValue : null,
            applyForType: body.applyForType,
            applyForValue: body.applyForType == "specific" ? applyForValue : null,
            brand: body.applyForType == "specific" ? body.brand : [],
            generic: body.applyForType == "specific" ? body.generic : [],
            category: body.applyForType == "specific" ? body.category : [],
            subCategory: body.applyForType == "specific" ? body.subCategory : [],
            product: body.applyForType == "specific" ? body.product : [],
            isExclude: body.isExclude,
            excludeValue: body.applyForType == "global" && body.isExclude ? excludeValue : null,
            excludeBrand: body.applyForType == "global" && body.isExclude ? body.excludeBrand : [],
            excludeGeneric: body.applyForType == "global" && body.isExclude ? body.excludeGeneric : [],
            excludeCategory: body.applyForType == "global" && body.isExclude ? body.excludeCategory : [],
            excludeSubCategory: body.applyForType == "global" && body.isExclude ? body.excludeSubCategory : [],
            excludeProduct: body.applyForType == "global" && body.isExclude ? body.excludeProduct : [],
        })
        const data = await discountCoupon.save()
        return res.json({ status: true, message: body.type == "discount" ? "Discount Added Successfully!" : "Coupon Added Successfully!", data: data })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const editDiscountCouponById = async (req, res) => {
    try {
        const body = req.body;
        if (!body._id || !body.title || !body.serviceType || !body.type || !body.globalLimitationType || !body.perUserLimitationType || !body.calculationType
            || !body.startingDateTime || !body.endingDateTime || !body.applyToUserType || !body.applyToDistrictType || !body.applyForType)
            return res.status(400).json({ status: false, error: "Bad Request!" })

        const isExist = await DiscountCoupon.findOne({ _id: body._id, deletedAt: null });
        if (!isExist) return res.json({ status: false, error: "No Discount or Coupon Found With This ID!" })

        if (body.type == "coupon" && !body.couponCode) return res.status(400).json({ status: false, error: "Bad Request!" })
        if (body.type == "coupon") {
            const isCouponExist = await DiscountCoupon.findOne({ couponCode: body.couponCode }).lean()
            if (isCouponExist && isCouponExist._id != body._id) return res.json({ status: false, error: "This Coupon Code Already Exist in Another Coupon!" })
        }

        var startingDateTime = moment(body.startingDateTime).format()
        var endingDateTime = moment(body.endingDateTime).format()
        if (startingDateTime >= endingDateTime)
            return res.json({ status: false, error: "Ending Date-Time Must Be Greater Then Starting Date-Time" })

        var applyForValue = [];
        (body.brand && body.brand.length > 0) ? applyForValue.push("brand") : null;
        (body.generic && body.generic.length > 0) ? applyForValue.push("generic") : null;
        (body.category && body.category.length > 0) ? applyForValue.push("category") : null;
        (body.subCategory && body.subCategory.length > 0) ? applyForValue.push("subCategory") : null;
        (body.product && body.product.length > 0) ? applyForValue.push("product") : null;

        var excludeValue = [];
        if (body.applyForType == "global" && body.isExclude) {
            (body.excludeBrand && body.excludeBrand.length > 0) ? excludeValue.push("brand") : null;
            (body.excludeGeneric && body.excludeGeneric.length > 0) ? excludeValue.push("generic") : null;
            (body.excludeCategory && body.excludeCategory.length > 0) ? excludeValue.push("category") : null;
            (body.excludeSubCategory && body.excludeSubCategory.length > 0) ? excludeValue.push("subCategory") : null;
            (body.excludeProduct && body.excludeProduct.length > 0) ? excludeValue.push("product") : null;
        }

        await DiscountCoupon.updateOne({ _id: body._id }, {
            serviceType: body.serviceType,
            type: body.type,
            status: body.status,
            title: body.title,
            couponCode: body.type == "coupon" ? body.couponCode : null,
            globalLimitationType: body.globalLimitationType,
            globalLimitaionValue: body.globalLimitationType == "limited" ? body.globalLimitaionValue : null,
            perUserLimitationType: body.perUserLimitationType,
            perUserLimitationValue: body.perUserLimitationType == "limited" ? body.perUserLimitationValue : null,
            calculationType: body.calculationType,
            calculationValue: body.calculationValue,
            minimumAmountToUse: body.minimumAmountToUse,
            maximumAmountGet: body.maximumAmountGet,
            startingDateTime: startingDateTime,
            endingDateTime: endingDateTime,
            applyToUserType: body.applyToUserType,
            applyToUserList: body.applyToUserList,
            applyToDistrictType: body.applyToDistrictType,
            applyToDistrictValue: body.applyToDistrictType == "specific" ? body.applyToDistrictValue : null,
            applyForType: body.applyForType,
            applyForValue: body.applyForType == "specific" ? applyForValue : null,
            brand: body.applyForType == "specific" ? body.brand : [],
            generic: body.applyForType == "specific" ? body.generic : [],
            category: body.applyForType == "specific" ? body.category : [],
            subCategory: body.applyForType == "specific" ? body.subCategory : [],
            product: body.applyForType == "specific" ? body.product : [],
            isExclude: body.isExclude,
            excludeValue: body.applyForType == "global" && body.isExclude ? excludeValue : null,
            excludeBrand: body.applyForType == "global" && body.isExclude ? body.excludeBrand : [],
            excludeGeneric: body.applyForType == "global" && body.isExclude ? body.excludeGeneric : [],
            excludeCategory: body.applyForType == "global" && body.isExclude ? body.excludeCategory : [],
            excludeSubCategory: body.applyForType == "global" && body.isExclude ? body.excludeSubCategory : [],
            excludeProduct: body.applyForType == "global" && body.isExclude ? body.excludeProduct : [],
        })
        return res.json({ status: true, message: "Update Successfull!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const getAllDiscountCouponByAdmin = async (req, res) => {
    try {
        var filter = JSON.parse(req.query.filter)
        console.log(filter);
        var pLimit = parseInt(req.query.pageSize);
        var page = req.query.page;
        var { offset, limit } = getOffset(page, pLimit);
        var newFilter = {
            deletedAt: null,
            serviceType: "emedicine",
            type: { $ne: null }
        }
        if (filter) {
            if (filter.type == "discount") newFilter.type = "discount"
            else if (filter.type == "coupon") newFilter.type = "coupon"
        }
        const data = await DiscountCoupon.find(newFilter).skip(offset).limit(limit).sort({ createdAt: -1 });
        const count = await DiscountCoupon.countDocuments(newFilter);
        return res.json({
            status: true,
            data: data,
            count: count,
            message: 'All Discount Coupon fetch Successfully!'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const deleteDiscountCouponByAdmin = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) return res.status(400).json({ status: false, error: "Bad Request!" })
        const isExist = await DiscountCoupon.findOne({ _id: _id, deletedAt: null })
        if (!isExist) return res.json({ status: false, error: "No Discount or Coupon Found!" })
        await DiscountCoupon.updateOne({ _id: _id }, { deletedAt: moment() })
        return res.json({ status: true, message: isExist.couponCode ? "Coupon Moved to Bin Successfully!" : "Discount Moved to Bin Successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const getDiscountCouponById = async (req, res) => {
    try {
        const { _id } = req.query
        if (!_id) return res.status(400).json({ status: false, error: "Bad Request!" })
        const isExist = await DiscountCoupon.findOne({ _id: _id, deletedAt: null })
            .populate([
                {
                    path: "applyToUserList",
                    model: "User",
                    select: "fullName phoneNo"
                },
                {
                    path: "applyToDistrictValue",
                    model: "District",
                    select: "district"
                },
                {
                    path: "brand",
                    model: "ProductBrand",
                    select: "brandName"
                },
                {
                    path: "generic",
                    model: "Generic",
                    select: "name"
                },
                {
                    path: "category",
                    model: "ProductCategory",
                    select: "categoryName"
                },
                {
                    path: "subCategory",
                    model: "ProductSubCategory",
                    select: "subCategoryName"
                },
                {
                    path: "product",
                    model: "Product",
                    select: "productName"
                },
                {
                    path: "excludeBrand",
                    model: "ProductBrand",
                    select: "brandName"
                },
                {
                    path: "excludeGeneric",
                    model: "Generic",
                    select: "name"
                },
                {
                    path: "excludeCategory",
                    model: "ProductCategory",
                    select: "categoryName"
                },
                {
                    path: "excludeSubCategory",
                    model: "ProductSubCategory",
                    select: "subCategoryName"
                },
                {
                    path: "excludeProduct",
                    model: "Product",
                    select: "productName"
                }
            ])
        if (!isExist) return res.json({ status: false, error: "No Discount or Coupon Found!" })
        return res.json({ status: true, data: isExist })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const calculateDiscount = async (req, res) => {
    try {
        const { districtId } = req.body
        const { userId } = req.userData
        if (!userId || !districtId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const isDistrictExist = await District.findOne({ _id: districtId }).lean()
        if (!isDistrictExist) return res.json({ status: false, error: "No District Found!" })

        const isUserExist = await User.findOne({ _id: userId, hasAccess: true }).lean();
        if (!isUserExist) return res.json({ status: false, error: "No User Found!" })

        var now = moment()
        var data = await User.findOne({ _id: userId })
            .populate(
                {
                    path: 'carts _id',
                    populate: {
                        path: 'product',
                        select: 'productName productSlug price prices images brand generic category subCategory',
                        populate: [
                            {
                                path: 'prices.unit',
                                model: 'UnitType'
                            },
                            {
                                path: 'brand',
                                model: 'ProductBrand',
                                select: 'brandName'
                            },
                            {
                                path: 'generic',
                                model: 'Generic',
                                select: 'name'
                            },
                            {
                                path: 'category',
                                model: 'ProductCategory',
                                select: 'categoryName'
                            },
                            {
                                path: 'subCategory',
                                model: 'ProductSubCategory',
                                select: 'subCategoryName'
                            },
                        ]
                    }
                })
            .select('carts')
        var items = JSON.parse(JSON.stringify(data.carts))
        for (var index = 0; index < items.length; index++) {
            if (!items[index].product.subCategory) {
                items[index].product.subCategory = { _id: "61d29915be1583453a6c6456", subCategoryName: "others" }
            }
        }

        var obj = {
            _id: null,
            maximumAmountGet: 0,
            amountUsed: 0
        }
        var productObj = {
            product: null,
            priceId: null,
            unitTypeId: null,
            price: 0,
            quantity: 0,
            subTotal: 0,
            discountId: null,
            emedilifeDiscount: 0,
            couponId: null,
            couponDiscount: null
        }

        //####################### Product Wise Calculation
        var discountAmountsProductWise = []
        var productsWithProductWiseDiscount = []
        var groupByProduct = items.reduce((r, a) => {
            r[a.product._id] = [...r[a.product._id] || [], a];
            return r;
        }, {});

        var totalDiscountByProduct = 0
        for (var [id, group] of Object.entries(groupByProduct)) {
            //for every group
            //First Calculate Subtotal for discounts minimum amount
            var subTotal = 0;
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                subTotal += priceObj.price * element.selectedQty
            });

            // For each group find discounts
            const discounts = await DiscountCoupon.find({
                serviceType: "emedicine",
                type: "discount",
                status: true,
                deletedAt: null,
                $and: [
                    { startingDateTime: { $lte: now } },
                    { endingDateTime: { $gte: now } }
                ],
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
                    { applyToUserType: "new" }
                ],
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
                            { excludeValue: "product" },
                            { excludeProduct: id }
                        ]
                    },
                    {
                        $and: [
                            { applyForType: "specific" },
                            { applyForValue: "product" },
                            { product: id }
                        ]
                    }
                ],
                $or: [
                    { minimumAmountToUse: null },
                    { minimumAmountToUse: { $lte: subTotal } }
                ]
            })

            //for each discount find the maximum one and store it in discountAmountsProductWise
            obj._id = null
            obj.amountUsed = 0
            for (var index = 0; index < discounts.length; index++) {
                //for every discount
                //Global Limitation Check
                if (discounts[index].globalLimitationType == "limited") {
                    const globalUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id }) //wait and check 
                    if (globalUsed >= discounts[index].globalLimitaionValue) continue;
                }
                //User Limitation Check
                if (discounts[index].perUserLimitationType == "limited") {
                    const perUserUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id, })//wait and check
                    if (perUserUsed >= discounts[index].perUserLimitationValue) continue;
                }
                if (discounts[index].applyToUserType == "new" && discounts[index].perUserLimitationType == "limited" && isUserExist.checkouts.length >= discounts[index].perUserLimitationValue) continue;
                var isUsed = discountAmountsProductWise.reverse().findIndex(o => o._id.toHexString() == discounts[index]._id)
                var discountValue = 0
                //if this discount not used early
                if (isUsed == -1) {
                    // obj._id = discounts[index]._id
                    if (discounts[index].calculationType == "amount")
                        discountValue = discounts[index].calculationValue
                    else {// persentage
                        if (discounts[index].maximumAmountGet) {
                            discountValue = (discounts[index].calculationValue * subTotal / 100) >= discounts[index].maximumAmountGet ?
                                discounts[index].maximumAmountGet : (discounts[index].calculationValue * subTotal / 100)
                        } else {
                            discountValue = (discounts[index].calculationValue * subTotal / 100)
                        }
                    }


                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = discounts[index].calculationType == "amount" ? discountValue : discounts[index].maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsProductWise[isUsed].maximumAmountGet == null) {
                    discountValue = discounts[index].calculationValue * subTotal / 100
                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = null
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsProductWise[isUsed].maximumAmountGet > discountAmountsProductWise[isUsed].amountUsed) {
                    var maximumAmountGet = discountAmountsProductWise[isUsed].maximumAmountGet - discountAmountsProductWise[isUsed].amountUsed
                    discountValue = (discounts[index].calculationValue * subTotal / 100 >= maximumAmountGet) ?
                        maximumAmountGet : discounts[index].calculationValue * subTotal / 100

                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                discountAmountsProductWise.reverse()
            }

            var discountRatio = obj.amountUsed / subTotal
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                productObj = {
                    product: element.product._id,
                    priceId: element.priceId,
                    unitTypeId: priceObj.unit._id,
                    price: priceObj.price,
                    quantity: element.selectedQty,
                    subTotal: priceObj.price * element.selectedQty,
                    discountId: obj._id,
                    emedilifeDiscount: (priceObj.price * element.selectedQty) * discountRatio,
                    couponId: null,
                    couponDiscount: null
                }
                productsWithProductWiseDiscount.push({ ...productObj })
            });

            if (obj._id != null) {
                totalDiscountByProduct += obj.amountUsed
                discountAmountsProductWise.push({ ...obj })
            }
        };

        //############################# Category Wise Calculation
        var discountAmountsCategoryWise = []
        var productsWithCategoryWiseDiscount = []
        obj = {
            _id: null,
            maximumAmountGet: 0,
            amountUsed: 0
        }
        var groupByCategory = items.reduce((r, a) => {
            r[a.product.category._id] = [...r[a.product.category._id] || [], a];
            return r;
        }, {});

        var totalDiscountByCategory = 0
        for (var [id, group] of Object.entries(groupByCategory)) {
            //for every group
            //First Calculate Subtotal for discounts minimum amount
            var subTotal = 0;
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                subTotal += priceObj.price * element.selectedQty
            });

            // For each group find discounts
            const discounts = await DiscountCoupon.find({
                serviceType: "emedicine",
                type: "discount",
                status: true,
                deletedAt: null,
                $and: [
                    { startingDateTime: { $lte: now } },
                    { endingDateTime: { $gte: now } }
                ],
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
                    { applyToUserType: "new" }
                ],
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
                            { excludeValue: "category" },
                            { excludeCategory: id }
                        ]
                    },
                    {
                        $and: [
                            { applyForType: "specific" },
                            { applyForValue: "category" },
                            { category: id }
                        ]
                    }
                ],
                $or: [
                    { minimumAmountToUse: null },
                    { minimumAmountToUse: { $lte: subTotal } }
                ]
            })
            //for each discount find the maximum one and store it in discountAmountsCategoryWise
            obj._id = null
            obj.amountUsed = 0
            for (var index = 0; index < discounts.length; index++) {
                //for every discount
                //Global Limitation Check
                if (discounts[index].globalLimitationType == "limited") {
                    const globalUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id }) //wait and check 
                    if (globalUsed >= discounts[index].globalLimitaionValue) continue;
                }
                //User Limitation Check
                if (discounts[index].perUserLimitationType == "limited") {
                    const perUserUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id, })//wait and check
                    if (perUserUsed >= discounts[index].perUserLimitationValue) continue;
                }
                if (discounts[index].applyToUserType == "new" && discounts[index].perUserLimitationType == "limited" && isUserExist.checkouts.length >= discounts[index].perUserLimitationValue) continue;
                var isUsed = discountAmountsCategoryWise.reverse().findIndex(o => o._id.toHexString() == discounts[index]._id)
                var discountValue = 0
                //if this discount not used early
                if (isUsed == -1) {
                    // obj._id = discounts[index]._id
                    if (discounts[index].calculationType == "amount")
                        discountValue = discounts[index].calculationValue
                    else {// persentage
                        if (discounts[index].maximumAmountGet) {
                            discountValue = (discounts[index].calculationValue * subTotal / 100) >= discounts[index].maximumAmountGet ?
                                discounts[index].maximumAmountGet : (discounts[index].calculationValue * subTotal / 100)
                        } else {
                            discountValue = (discounts[index].calculationValue * subTotal / 100)
                        }
                    }

                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = discounts[index].calculationType == "amount" ? discountValue : discounts[index].maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsCategoryWise[isUsed].maximumAmountGet == null) {
                    discountValue = discounts[index].calculationValue * subTotal / 100
                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = null
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsCategoryWise[isUsed].maximumAmountGet > discountAmountsCategoryWise[isUsed].amountUsed) {
                    var maximumAmountGet = discountAmountsCategoryWise[isUsed].maximumAmountGet - discountAmountsCategoryWise[isUsed].amountUsed
                    discountValue = (discounts[index].calculationValue * subTotal / 100 >= maximumAmountGet) ?
                        maximumAmountGet : discounts[index].calculationValue * subTotal / 100

                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                discountAmountsCategoryWise.reverse()
            }

            var discountRatio = obj.amountUsed / subTotal
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                productObj = {
                    product: element.product._id,
                    priceId: element.priceId,
                    unitTypeId: priceObj.unit._id,
                    price: priceObj.price,
                    quantity: element.selectedQty,
                    subTotal: priceObj.price * element.selectedQty,
                    discountId: obj._id,
                    emedilifeDiscount: (priceObj.price * element.selectedQty) * discountRatio,
                    couponId: null,
                    couponDiscount: null
                }
                productsWithCategoryWiseDiscount.push({ ...productObj })
            });

            if (obj._id != null) {
                totalDiscountByCategory += obj.amountUsed
                discountAmountsCategoryWise.push({ ...obj })
            }
        };

        //############################ Brand Wise Calculation
        var discountAmountsBrandWise = []
        var productsWithBrandWiseDiscount = []
        obj = {
            _id: null,
            maximumAmountGet: 0,
            amountUsed: 0
        }
        var groupByBrand = items.reduce((r, a) => {
            r[a.product.brand._id] = [...r[a.product.brand._id] || [], a];
            return r;
        }, {});

        var totalDiscountByBrand = 0
        for (var [id, group] of Object.entries(groupByBrand)) {
            //for every group
            //First Calculate Subtotal for discounts minimum amount
            var subTotal = 0;
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                subTotal += priceObj.price * element.selectedQty
            });

            // For each group find discounts
            const discounts = await DiscountCoupon.find({
                serviceType: "emedicine",
                type: "discount",
                status: true,
                deletedAt: null,
                $and: [
                    { startingDateTime: { $lte: now } },
                    { endingDateTime: { $gte: now } }
                ],
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
                    { applyToUserType: "new" }
                ],
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
                            { excludeValue: "brand" },
                            { excludeBrand: id }
                        ]
                    },
                    {
                        $and: [
                            { applyForType: "specific" },
                            { applyForValue: "brand" },
                            { brand: id }
                        ]
                    }
                ],
                $or: [
                    { minimumAmountToUse: null },
                    { minimumAmountToUse: { $lte: subTotal } }
                ]
            })
            //for each discount find the maximum one and store it in discountAmountsBrandWise
            obj._id = null
            obj.amountUsed = 0
            for (var index = 0; index < discounts.length; index++) {
                //for every discount
                //Global Limitation Check
                if (discounts[index].globalLimitationType == "limited") {
                    const globalUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id }) //wait and check 
                    if (globalUsed >= discounts[index].globalLimitaionValue) continue;
                }
                //User Limitation Check
                if (discounts[index].perUserLimitationType == "limited") {
                    const perUserUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id, })//wait and check
                    if (perUserUsed >= discounts[index].perUserLimitationValue) continue;
                }
                if (discounts[index].applyToUserType == "new" && discounts[index].perUserLimitationType == "limited" && isUserExist.checkouts.length >= discounts[index].perUserLimitationValue) continue;
                var isUsed = discountAmountsBrandWise.reverse().findIndex(o => o._id.toHexString() == discounts[index]._id)
                var discountValue = 0
                //if this discount not used early
                if (isUsed == -1) {
                    // obj._id = discounts[index]._id
                    if (discounts[index].calculationType == "amount")
                        discountValue = discounts[index].calculationValue
                    else {// persentage
                        if (discounts[index].maximumAmountGet) {
                            discountValue = (discounts[index].calculationValue * subTotal / 100) >= discounts[index].maximumAmountGet ?
                                discounts[index].maximumAmountGet : (discounts[index].calculationValue * subTotal / 100)
                        } else {
                            discountValue = (discounts[index].calculationValue * subTotal / 100)
                        }
                    }

                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = discounts[index].calculationType == "amount" ? discountValue : discounts[index].maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsBrandWise[isUsed].maximumAmountGet == null) {
                    discountValue = discounts[index].calculationValue * subTotal / 100
                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = null
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsBrandWise[isUsed].maximumAmountGet > discountAmountsBrandWise[isUsed].amountUsed) {
                    var maximumAmountGet = discountAmountsBrandWise[isUsed].maximumAmountGet - discountAmountsBrandWise[isUsed].amountUsed
                    discountValue = (discounts[index].calculationValue * subTotal / 100 >= maximumAmountGet) ?
                        maximumAmountGet : discounts[index].calculationValue * subTotal / 100

                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                discountAmountsBrandWise.reverse()
            }

            var discountRatio = obj.amountUsed / subTotal
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                productObj = {
                    product: element.product._id,
                    priceId: element.priceId,
                    unitTypeId: priceObj.unit._id,
                    price: priceObj.price,
                    quantity: element.selectedQty,
                    subTotal: priceObj.price * element.selectedQty,
                    discountId: obj._id,
                    emedilifeDiscount: (priceObj.price * element.selectedQty) * discountRatio,
                    couponId: null,
                    couponDiscount: null
                }
                productsWithBrandWiseDiscount.push({ ...productObj })
            });

            if (obj._id != null) {
                totalDiscountByBrand += obj.amountUsed
                discountAmountsBrandWise.push({ ...obj })
            }
        };

        //############################ Generic Wise Calculation
        var discountAmountsGenericWise = []
        var productsWithGenericWiseDiscount = []
        obj = {
            _id: null,
            maximumAmountGet: 0,
            amountUsed: 0
        }
        var groupByGeneric = items.reduce((r, a) => {
            r[a.product.generic._id] = [...r[a.product.generic._id] || [], a];
            return r;
        }, {});

        var totalDiscountByGeneric = 0
        for (var [id, group] of Object.entries(groupByGeneric)) {
            //for every group
            //First Calculate Subtotal for discounts minimum amount
            var subTotal = 0;
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                subTotal += priceObj.price * element.selectedQty
            });
            // For each group find discounts
            const discounts = await DiscountCoupon.find({
                serviceType: "emedicine",
                type: "discount",
                status: true,
                deletedAt: null,
                $and: [
                    { startingDateTime: { $lte: now } },
                    { endingDateTime: { $gte: now } }
                ],
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
                    { applyToUserType: "new" }
                ],
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
                            { excludeValue: "generic" },
                            { excludeGeneric: id }
                        ]
                    },
                    {
                        $and: [
                            { applyForType: "specific" },
                            { applyForValue: "generic" },
                            { generic: id }
                        ]
                    }
                ],
                $or: [
                    { minimumAmountToUse: null },
                    { minimumAmountToUse: { $lte: subTotal } }
                ]
            })
            //for each discount find the maximum one and store it in discountAmountsGenericWise
            obj._id = null
            obj.amountUsed = 0
            for (var index = 0; index < discounts.length; index++) {
                //for every discount
                //Global Limitation Check
                if (discounts[index].globalLimitationType == "limited") {
                    const globalUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id }) //wait and check 
                    if (globalUsed >= discounts[index].globalLimitaionValue) continue;
                }
                //User Limitation Check
                if (discounts[index].perUserLimitationType == "limited") {
                    const perUserUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id, })//wait and check
                    if (perUserUsed >= discounts[index].perUserLimitationValue) continue;
                }
                if (discounts[index].applyToUserType == "new" && discounts[index].perUserLimitationType == "limited" && isUserExist.checkouts.length >= discounts[index].perUserLimitationValue) continue;
                var isUsed = discountAmountsGenericWise.reverse().findIndex(o => o._id.toHexString() == discounts[index]._id)
                var discountValue = 0
                //if this discount not used early
                if (isUsed == -1) {
                    // obj._id = discounts[index]._id
                    if (discounts[index].calculationType == "amount")
                        discountValue = discounts[index].calculationValue
                    else {// persentage
                        if (discounts[index].maximumAmountGet) {
                            discountValue = (discounts[index].calculationValue * subTotal / 100) >= discounts[index].maximumAmountGet ?
                                discounts[index].maximumAmountGet : (discounts[index].calculationValue * subTotal / 100)
                        } else {
                            discountValue = (discounts[index].calculationValue * subTotal / 100)
                        }
                    }

                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = discounts[index].calculationType == "amount" ? discountValue : discounts[index].maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsGenericWise[isUsed].maximumAmountGet == null) {
                    discountValue = discounts[index].calculationValue * subTotal / 100
                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = null
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsGenericWise[isUsed].maximumAmountGet > discountAmountsGenericWise[isUsed].amountUsed) {
                    var maximumAmountGet = discountAmountsGenericWise[isUsed].maximumAmountGet - discountAmountsGenericWise[isUsed].amountUsed
                    discountValue = (discounts[index].calculationValue * subTotal / 100 >= maximumAmountGet) ?
                        maximumAmountGet : discounts[index].calculationValue * subTotal / 100

                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                discountAmountsGenericWise.reverse()
            }

            var discountRatio = obj.amountUsed / subTotal
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                productObj = {
                    product: element.product._id,
                    priceId: element.priceId,
                    unitTypeId: priceObj.unit._id,
                    price: priceObj.price,
                    quantity: element.selectedQty,
                    subTotal: priceObj.price * element.selectedQty,
                    discountId: obj._id,
                    emedilifeDiscount: (priceObj.price * element.selectedQty) * discountRatio,
                    couponId: null,
                    couponDiscount: null
                }
                productsWithGenericWiseDiscount.push({ ...productObj })
            });

            if (obj._id != null) {
                totalDiscountByGeneric += obj.amountUsed
                discountAmountsGenericWise.push({ ...obj })
            }
        };

        //############################## Sub-Category Wise Calculation
        var discountAmountsSubCategoryWise = []
        var productsWithSubCategoryWiseDiscount = []
        obj = {
            _id: null,
            maximumAmountGet: 0,
            amountUsed: 0
        }
        var groupBySubCategory = items.reduce((r, a) => {
            r[a.product.subCategory._id] = [...r[a.product.subCategory._id] || [], a];
            return r;
        }, {});
        var totalDiscountBySubCategory = 0
        for (var [id, group] of Object.entries(groupBySubCategory)) {
            //for every group
            //First Calculate Subtotal for discounts minimum amount
            var subTotal = 0;
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                subTotal += priceObj.price * element.selectedQty
            });

            // For each group find discounts
            const discounts = await DiscountCoupon.find({
                serviceType: "emedicine",
                type: "discount",
                status: true,
                deletedAt: null,
                $and: [
                    { startingDateTime: { $lte: now } },
                    { endingDateTime: { $gte: now } }
                ],
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
                    { applyToUserType: "new" }
                ],
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
                            { excludeValue: "subCategory" },
                            { excludeSubCategory: id }
                        ]
                    },
                    {
                        $and: [
                            { applyForType: "specific" },
                            { applyForValue: "subCategory" },
                            { subCategory: id }
                        ]
                    }
                ],
                $or: [
                    { minimumAmountToUse: null },
                    { minimumAmountToUse: { $lte: subTotal } }
                ]
            })
            //for each discount find the maximum one and store it in discountAmountsSubCategoryWise
            obj._id = null
            obj.amountUsed = 0
            for (var index = 0; index < discounts.length; index++) {
                //for every discount
                //Global Limitation Check
                if (discounts[index].globalLimitationType == "limited") {
                    const globalUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id }) //wait and check 
                    if (globalUsed >= discounts[index].globalLimitaionValue) continue;
                }
                //User Limitation Check
                if (discounts[index].perUserLimitationType == "limited") {
                    const perUserUsed = await DiscountCouponUsedHistory.countDocuments({ _id: discounts[index]._id, })//wait and check
                    if (perUserUsed >= discounts[index].perUserLimitationValue) continue;
                }
                if (discounts[index].applyToUserType == "new" && discounts[index].perUserLimitationType == "limited" && isUserExist.checkouts.length >= discounts[index].perUserLimitationValue) continue;
                var isUsed = discountAmountsSubCategoryWise.reverse().findIndex(o => o._id.toHexString() == discounts[index]._id)
                var discountValue = 0
                //if this discount not used early
                if (isUsed == -1) {
                    // obj._id = discounts[index]._id
                    if (discounts[index].calculationType == "amount")
                        discountValue = discounts[index].calculationValue
                    else {// persentage
                        if (discounts[index].maximumAmountGet) {
                            discountValue = (discounts[index].calculationValue * subTotal / 100) >= discounts[index].maximumAmountGet ?
                                discounts[index].maximumAmountGet : (discounts[index].calculationValue * subTotal / 100)
                        } else {
                            discountValue = (discounts[index].calculationValue * subTotal / 100)
                        }
                    }

                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = discounts[index].calculationType == "amount" ? discountValue : discounts[index].maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsSubCategoryWise[isUsed].maximumAmountGet == null) {
                    discountValue = discounts[index].calculationValue * subTotal / 100
                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = null
                        obj.amountUsed = discountValue
                    }
                }
                else if (discounts[index].calculationType == "percentage" && discountAmountsSubCategoryWise[isUsed].maximumAmountGet > discountAmountsSubCategoryWise[isUsed].amountUsed) {
                    var maximumAmountGet = discountAmountsSubCategoryWise[isUsed].maximumAmountGet - discountAmountsSubCategoryWise[isUsed].amountUsed
                    discountValue = (discounts[index].calculationValue * subTotal / 100 >= maximumAmountGet) ?
                        maximumAmountGet : discounts[index].calculationValue * subTotal / 100

                    if (obj._id == null || discountValue > obj.amountUsed) {
                        obj._id = discounts[index]._id
                        obj.maximumAmountGet = maximumAmountGet
                        obj.amountUsed = discountValue
                    }
                }
                discountAmountsSubCategoryWise.reverse()
            }

            var discountRatio = obj.amountUsed / subTotal
            group.forEach(element => {
                var priceObj = element.product.prices.find(o => o._id == element.priceId)
                productObj = {
                    product: element.product._id,
                    priceId: element.priceId,
                    unitTypeId: priceObj.unit._id,
                    price: priceObj.price,
                    quantity: element.selectedQty,
                    subTotal: priceObj.price * element.selectedQty,
                    discountId: obj._id,
                    emedilifeDiscount: (priceObj.price * element.selectedQty) * discountRatio,
                    couponId: null,
                    couponDiscount: null
                }
                productsWithSubCategoryWiseDiscount.push({ ...productObj })
            });

            if (obj._id != null) {
                totalDiscountBySubCategory += obj.amountUsed
                discountAmountsSubCategoryWise.push({ ...obj })
            }
        };


        var discountArray = [
            {
                type: "category",
                amount: totalDiscountByCategory
            },
            {
                type: "product",
                amount: totalDiscountByProduct
            },
            {
                type: "brand",
                amount: totalDiscountByBrand
            },
            {
                type: "generic",
                amount: totalDiscountByGeneric
            },
            {
                type: "subCategory",
                amount: totalDiscountBySubCategory
            }
        ]
        discountArray.sort((a, b) => (a.amount > b.amount ? -1 : 1))
        var finalProducts = []
        switch (discountArray[0].type) {
            case "category":
                finalProducts = productsWithCategoryWiseDiscount
                break;
            case "product":
                finalProducts = productsWithProductWiseDiscount
                break;
            case "brand":
                finalProducts = productsWithBrandWiseDiscount
                break;
            case "generic":
                finalProducts = productsWithGenericWiseDiscount
                break;
            case "subCategory":
                finalProducts = productsWithSubCategoryWiseDiscount
                break;
        }
        var totalPrice = 0
        var usedDiscounts = []
        finalProducts.forEach(product => {
            totalPrice += product.price * product.quantity
            if (product.discountId && usedDiscounts.find(o => o == product.discountId) == undefined)
                usedDiscounts.push(product.discountId)
        });
        return res.json({
            status: true,
            // totalDiscountByProduct,
            // totalDiscountByCategory,
            // totalDiscountByBrand,
            // totalDiscountByGeneric,
            // totalDiscountBySubCategory,
            emedilifeDiscount: discountArray[0].amount,
            totalPrice: totalPrice,
            usedDiscounts: usedDiscounts,
            finalProducts: finalProducts,
        })






        // const discounts = await DiscountCoupon.find({
        //     serviceType: "emedilife",
        //     type: "discount",
        //     status: true,
        //     deletedAt: null,
        //     $and: [
        //         { startingDateTime: { $lte: now } },
        //         { endingDateTime: { $gte: now } }
        //     ],
        //     $or: [
        //         { applyToDistrictType: "all" },
        //         {
        //             $and: [
        //                 { applyToDistrictType: "specific" },
        //                 { applyToDistrictValue: districtId }
        //             ]
        //         }
        //     ],
        //     $or: [
        //         { applyToUserType: "all" },
        //         {
        //             $and: [
        //                 { applyToUserType: "specific" },
        //                 { applyToUserList: userId }
        //             ]
        //         },
        //         { applyToUserType: "new" }
        //     ],
        //     $or: [
        //         {applyForType: "global"},
        //         {
        //             $and: [
        //                 {applyForType: "specific"},
        //                 {applyForValue: "product"},
        //                 {product: product}
        //             ]
        //         }
        //     ]
        // })









        // var groupBySubCategoryKey = []
        // var groupBySubCategory = items.reduce((r, a) => {
        //     if (!r[a.product.subCategory._id])
        //         groupBySubCategoryKey.push(a.product._id)
        //     r[a.product.subCategory._id] = [...r[a.product.subCategory._id] || [], a];
        //     return r;
        // }, {});


        // var groupBySubCategory = items.reduce((r, a) => {
        //     console.log("a", a);
        //     console.log('r', r);
        //     r[a.product.subCategory._id] = [...r[a.product.subCategory._id] || [], a];
        //     return r;
        // }, {});


        return res.json({
            groupByProduct: Object.keys(groupByProduct).length,
            // groupByCategory: Object.keys(groupByCategory).length,
            // groupByGeneric: Object.keys(groupByGeneric).length,
            // groupByBrand: Object.keys(groupByBrand).length,
            // groupBySubCategory: groupBySubCategory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const applyCoupon = async (req, res) => {
    try {
        // const { phoneNo, district, orderedItems, couponCode } = req.body
        // if (!phoneNo || phoneNo.length != 11 || !district || !orderedItems || !couponCode) return res.status(400).json({ status: false, error: "Bad Request!" })

        // //District Check
        // const isDistrictExist = await District.findOne({ _id: district }).lean()
        // if (!isDistrictExist) return res.json({ status: false, error: "No District Found!" })
        // //Coupon Code Check
        // const isCouponExist = await DiscountCoupon.findOne({ couponCode: couponCode, status: true, deletedAt: null })
        // if (!isCouponExist) return res.json({ status: false, error: "No Coupon Exist!" })

        // //User Check
        // const isUserExist = await User.findOne({ phoneNo: phoneNo });
        // var userId;
        // if (!isUserExist) userId = isUserExist._id
        // else userId = null

        // //DateTime Validation Check
        // const now = moment()
        // if (now < isCouponExist.startingDateTime)
        //     return res.json({ status: false, error: "Coupon Not Started Yet!" })
        // else if (now > isCouponExist.endingDateTime)
        //     return res.json({ status: false, error: "Coupon Expired!" })

        // //Global Limitaion Check
        // if (isCouponExist.globalLimitationType == "limited") {
        //     const globalUsed = await DiscountCouponUsedHistory.countDocuments({ _id: isCouponExist._id })
        //     if (globalUsed >= isCouponExist.globalLimitaionValue) return res.json({ status: false, error: "Coupon Global Used Limitation Crossed!" })
        // }
        // //User Limitation Check
        // if (userId && isCouponExist.perUserLimitationType == "limited") {
        //     const perUserUsed = await DiscountCouponUsedHistory.countDocuments({ _id: isCouponExist._id, })
        //     if (perUserUsed >= isCouponExist.perUserLimitationValue) return res.json({ status: false, error: "Coupon User Used Limitation Crossed!" })
        // }
        // //Check District Validation
        // if (isCouponExist.applyToDistrictType == "specific") {
        //     const found = isCouponExist.applyToDistrictValue.find(element => element == district)
        //     if (found == undefined) return res.json({ status: false, error: "This Coupon is not Available for your District!" })
        // }
        // //User Validation Check
        // if (isCouponExist.applyToUserType == "new" && isUserExist && isUserExist.checkouts.length > 0)
        //     return res.json({ status: false, error: "This Coupon is Only for New Users!" })
        // else if (isCouponExist.applyToUserType == "specific" && !isUserExist)
        //     return res.json({ status: false, error: "This Coupon is Only for Specific Users!" })
        // else if (isCouponExist.applyToUserType == "specific") {
        //     const found = isCouponExist.applyToUserList.find(element => element == userId.toHexString())
        //     if (found == undefined) return res.json({ status: false, error: "This Coupon is Only for Specific Users!" })
        // }


        // temporery calculation
        var subTotal = 0;
        var productObj = {
            product: null,
            priceId: null,
            unitTypeId: null,
            price: 0,
            quantity: 0,
            subTotal: 0,
            discountId: null,
            emedilifeDiscount: 0,
            couponId: null,
            couponDiscount: null
        }

        const isCouponExist = await DiscountCoupon.findOne({ couponCode: "FINAL", status: true, deletedAt: null })
        if (!isCouponExist) return res.json({ status: false, error: "No Coupon Exist!" })
        var orderedItems = [
            {
                "product": "617e8c65d304fc570bc2ee7a",
                "priceId": "617e8c62d304fc570bc27dbc",
                "unitTypeId": "617e7cb87b2d43c8ac103f20",
                "price": 20,
                "quantity": 4,
                "subTotal": 80,
                "discountId": null,
                "emedilifeDiscount": 0,
                "couponId": null,
                "couponDiscount": null
            },
            {
                "product": "617e8c65d304fc570bc2ee7a",
                "priceId": "617e8c62d304fc570bc27dbd",
                "unitTypeId": "617e7cb87b2d43c8ac103f12",
                "price": 300,
                "quantity": 2,
                "subTotal": 600,
                "discountId": null,
                "emedilifeDiscount": 0,
                "couponId": null,
                "couponDiscount": null
            },
            {
                "product": "617e8c68d304fc570bc31421",
                "priceId": "617e8c64d304fc570bc2ca9b",
                "unitTypeId": "617e7cb87b2d43c8ac103f20",
                "price": 15.1,
                "quantity": 2,
                "subTotal": 30.2,
                "discountId": "61d2974bbe1583453a6c6450",
                "emedilifeDiscount": 6.04,
                "couponId": null,
                "couponDiscount": null
            },
            {
                "product": "617e8c68d304fc570bc31421",
                "priceId": "617e8c64d304fc570bc2ca9c",
                "unitTypeId": "617e7cb87b2d43c8ac103f4f",
                "price": 453,
                "quantity": 2,
                "subTotal": 906,
                "discountId": "61d2974bbe1583453a6c6450",
                "emedilifeDiscount": 181.20000000000002,
                "couponId": null,
                "couponDiscount": null
            },
            {
                "product": "617e8c64d304fc570bc2e36f",
                "priceId": "619633f8da9da2e48035e930",
                "unitTypeId": "617e7cb87b2d43c8ac103f19",
                "price": 5,
                "quantity": 1,
                "subTotal": 5,
                "discountId": null,
                "emedilifeDiscount": 0,
                "couponId": null,
                "couponDiscount": null
            },
            {
                "product": "617e8c64d304fc570bc2e3a2",
                "priceId": "617e8c61d304fc570bc26b09",
                "unitTypeId": "617e7cb87b2d43c8ac103f13",
                "price": 25.08,
                "quantity": 1,
                "subTotal": 25.08,
                "discountId": "61dbd8ef64bee6475cc4ebfb",
                "emedilifeDiscount": 11.538461538461538,
                "couponId": null,
                "couponDiscount": null
            },
            {
                "product": "617e8c64d304fc570bc2e3a2",
                "priceId": "61962ce6da9da2e48035e7b2",
                "unitTypeId": "617e7cb87b2d43c8ac103f23",
                "price": 300.96,
                "quantity": 1,
                "subTotal": 300.96,
                "discountId": "61dbd8ef64bee6475cc4ebfb",
                "emedilifeDiscount": 138.46153846153848,
                "couponId": null,
                "couponDiscount": null
            },
            {
                "product": "617e8c64d304fc570bc2e3a9",
                "priceId": "617e8c61d304fc570bc26b10",
                "unitTypeId": "617e7cb87b2d43c8ac103f14",
                "price": 85,
                "quantity": 3,
                "subTotal": 255,
                "discountId": null,
                "emedilifeDiscount": 0,
                "couponId": null,
                "couponDiscount": null
            },
            {
                "product": "617e8c64d304fc570bc2e398",
                "priceId": "61962798da9da2e48035e6de",
                "unitTypeId": "617e7cb87b2d43c8ac103f19",
                "price": 18,
                "quantity": 3,
                "subTotal": 54,
                "discountId": null,
                "emedilifeDiscount": 0,
                "couponId": null,
                "couponDiscount": null
            },
            {
                "product": "617e8c68d304fc570bc30ff6",
                "priceId": "617e8c63d304fc570bc2c2c1",
                "unitTypeId": "617e7cb87b2d43c8ac103f95",
                "price": 100,
                "quantity": 3,
                "subTotal": 300,
                "discountId": null,
                "emedilifeDiscount": 0,
                "couponId": null,
                "couponDiscount": null
            }
        ]
        var couponArray = []
        var couponObject = {
            type: "",
            totalDiscount: 0,
            totalAmount: 0,
            couponAmount: 0,
        }
        var finalDiscountedProducts = []
        const minimumAmountToUse = isCouponExist.minimumAmountToUse
        if (isCouponExist.applyForType == "specific") {
            var productListProductWise = []
            var productListCategoryWise = []
            var productListBrandWise = []
            var productListSubCategoryWise = []
            var productListGenericWise = []

            isCouponExist.applyForValue.forEach(value => {
                var couponAmountProductWise = 0
                var couponAmountCategoryWise = 0
                var couponAmountBrandWise = 0
                var couponAmountSubCategoryWise = 0
                var couponAmountGenericWise = 0

                if (value == "product") {
                    var totalDiscount = 0
                    var totalAmount = 0
                    isCouponExist.product.forEach(pro => {
                        var products = orderedItems.filter(o => o.product == pro) //o.product._id
                        products.forEach(element => {
                            productListProductWise.push(element)
                            totalDiscount += element.emedilifeDiscount
                            totalAmount += element.subTotal
                        });
                    });

                    if (isCouponExist.calculationType == "amount") {
                        couponAmountProductWise = isCouponExist.calculationValue > totalDiscount ? isCouponExist.calculationValue - totalDiscount : 0
                    }
                    else if (isCouponExist.calculationType == "percentage") {
                        couponAmountProductWise = totalAmount * isCouponExist.calculationValue / 100
                        couponAmountProductWise = couponAmountProductWise > isCouponExist.maximumAmountGet ? isCouponExist.maximumAmountGet : couponAmountProductWise
                        couponAmountProductWise = couponAmountProductWise > totalDiscount ? couponAmountProductWise - totalDiscount : 0
                    }
                    couponObject = {
                        type: "product",
                        totalDiscount: totalDiscount,
                        totalAmount: totalAmount,
                        couponAmount: couponAmountProductWise,
                    }
                    couponArray.push(couponObject)
                    // console.log(productListProductWise, totalAmount, totalDiscount, couponAmountProductWise);
                }
                else if (value == "category") {
                    var totalDiscount = 0
                    var totalAmount = 0
                    isCouponExist.product.forEach(pro => {
                        var products = orderedItems.filter(o => o.product.category == pro)
                        products.forEach(element => {
                            productListCategoryWise.push(element)
                            totalDiscount += element.emedilifeDiscount
                            totalAmount += element.subTotal
                        });
                    });

                    if (isCouponExist.calculationType == "amount") {
                        couponAmountCategoryWise = isCouponExist.calculationValue > totalDiscount ? isCouponExist.calculationValue - totalDiscount : 0
                    }
                    else if (isCouponExist.calculationType == "percentage") {
                        couponAmountCategoryWise = totalAmount * isCouponExist.calculationValue / 100
                        couponAmountCategoryWise = couponAmountCategoryWise > isCouponExist.maximumAmountGet ? isCouponExist.maximumAmountGet : couponAmountCategoryWise
                        couponAmountCategoryWise = couponAmountCategoryWise > totalDiscount ? couponAmountCategoryWise - totalDiscount : 0
                    }
                    couponObject = {
                        type: "category",
                        totalDiscount: totalDiscount,
                        totalAmount: totalAmount,
                        couponAmount: couponAmountCategoryWise,
                    }
                    couponArray.push(couponObject)
                    // console.log(productListCategoryWise, totalAmount, totalDiscount, couponAmountCategoryWise);
                }
                else if (value == "brand") {
                    var totalDiscount = 0
                    var totalAmount = 0
                    isCouponExist.product.forEach(pro => {
                        var products = orderedItems.filter(o => o.product.brand == pro)
                        products.forEach(element => {
                            productListBrandWise.push(element)
                            totalDiscount += element.emedilifeDiscount
                            totalAmount += element.subTotal
                        });
                    });

                    if (isCouponExist.calculationType == "amount") {
                        couponAmountBrandWise = isCouponExist.calculationValue > totalDiscount ? isCouponExist.calculationValue - totalDiscount : 0
                    }
                    else if (isCouponExist.calculationType == "percentage") {
                        couponAmountBrandWise = totalAmount * isCouponExist.calculationValue / 100
                        couponAmountBrandWise = couponAmountBrandWise > isCouponExist.maximumAmountGet ? isCouponExist.maximumAmountGet : couponAmountBrandWise
                        couponAmountBrandWise = couponAmountBrandWise > totalDiscount ? couponAmountBrandWise - totalDiscount : 0
                    }
                    couponObject = {
                        type: "brand",
                        totalDiscount: totalDiscount,
                        totalAmount: totalAmount,
                        couponAmount: couponAmountBrandWise,
                    }
                    couponArray.push(couponObject)
                    console.log(productListBrandWise, totalAmount, totalDiscount, couponAmountBrandWise);
                }
                else if (value == "subCategory") {
                    var totalDiscount = 0
                    var totalAmount = 0
                    isCouponExist.product.forEach(pro => {
                        var products = orderedItems.filter(o => o.product.subCategory == pro)
                        products.forEach(element => {
                            productListSubCategoryWise.push(element)
                            totalDiscount += element.emedilifeDiscount
                            totalAmount += element.subTotal
                        });
                    });

                    if (isCouponExist.calculationType == "amount") {
                        couponAmountSubCategoryWise = isCouponExist.calculationValue > totalDiscount ? isCouponExist.calculationValue - totalDiscount : 0
                    }
                    else if (isCouponExist.calculationType == "percentage") {
                        couponAmountSubCategoryWise = totalAmount * isCouponExist.calculationValue / 100
                        couponAmountSubCategoryWise = couponAmountSubCategoryWise > isCouponExist.maximumAmountGet ? isCouponExist.maximumAmountGet : couponAmountSubCategoryWise
                        couponAmountSubCategoryWise = couponAmountSubCategoryWise > totalDiscount ? couponAmountSubCategoryWise - totalDiscount : 0
                    }
                    couponObject = {
                        type: "subcategory",
                        totalDiscount: totalDiscount,
                        totalAmount: totalAmount,
                        couponAmount: couponAmountSubCategoryWise,
                    }
                    couponArray.push(couponObject)
                    // console.log(productListSubCategoryWise, totalAmount, totalDiscount, couponAmountSubCategoryWise);
                }
                else if (value == "generic") {
                    var totalDiscount = 0
                    var totalAmount = 0
                    isCouponExist.product.forEach(pro => {
                        var products = orderedItems.filter(o => o.product.generic == pro)
                        products.forEach(element => {
                            productListGenericWise.push(element)
                            totalDiscount += element.emedilifeDiscount
                            totalAmount += element.subTotal
                        });
                    });

                    if (isCouponExist.calculationType == "amount") {
                        couponAmountGenericWise = isCouponExist.calculationValue > totalDiscount ? isCouponExist.calculationValue - totalDiscount : 0
                    }
                    else if (isCouponExist.calculationType == "percentage") {
                        couponAmountGenericWise = totalAmount * isCouponExist.calculationValue / 100
                        couponAmountGenericWise = couponAmountGenericWise > isCouponExist.maximumAmountGet ? isCouponExist.maximumAmountGet : couponAmountGenericWise
                        couponAmountGenericWise = couponAmountGenericWise > totalDiscount ? couponAmountGenericWise - totalDiscount : 0
                    }
                    couponObject = {
                        type: "generic",
                        totalDiscount: totalDiscount,
                        totalAmount: totalAmount,
                        couponAmount: couponAmountGenericWise,
                    }
                    couponArray.push(couponObject)
                    // console.log(productListGenericWise, totalAmount, totalDiscount, couponAmountGenericWise);
                }
            });
            couponArray.sort((a, b) => (a.couponAmount > b.couponAmount ? -1 : 1))
            switch (couponArray[0].type) {
                case "category":
                    finalDiscountedProducts = productListCategoryWise
                    break;
                case "product":
                    finalDiscountedProducts = productListProductWise
                    break;
                case "brand":
                    finalDiscountedProducts = productListBrandWise
                    break;
                case "generic":
                    finalDiscountedProducts = productListGenericWise
                    break;
                case "subCategory":
                    finalDiscountedProducts = productListSubCategoryWise
                    break;
            }
        }
        else if (isCouponExist.applyForType == "global") {
            var totalDiscount = 0
            var totalAmount = 0
            var totalCouponAmount = 0
            orderedItems.forEach(pro => {
                totalDiscount += element.emedilifeDiscount
                totalAmount += element.subTotal
            });

            if (totalAmount < minimumAmountToUse) return res.json({ status: false, error: `Minimum Amount To Use This Coupon Is ${{ minimumAmountToUse }}` })

            if (isCouponExist.calculationType == "amount") {
                totalCouponAmount = isCouponExist.calculationValue > totalDiscount ? isCouponExist.calculationValue - totalDiscount : 0
            }
            else if (isCouponExist.calculationType == "percentage") {
                totalCouponAmount = totalAmount * isCouponExist.calculationValue / 100
                totalCouponAmount = totalCouponAmount > isCouponExist.maximumAmountGet ? isCouponExist.maximumAmountGet : totalCouponAmount
                totalCouponAmount = totalCouponAmount > totalDiscount ? totalCouponAmount - totalDiscount : 0
            }
            finalDiscountedProducts = orderedItems
            couponObject = {
                type: "global",
                totalDiscount: totalDiscount,
                totalAmount: totalAmount,
                couponAmount: totalCouponAmount,
            }
            couponArray.push(couponObject)
        }
        // var couponRatio = couponArray[0].couponAmount/couponArray[0].totalAmount
        // finalDiscountedProducts.forEach(element => {
        //     element.couponId = isCouponExist._id
        //     element.couponDiscount = element.subTotal * couponRatio
        // });

        return res.json({ status: true, couponAmount: couponArray[0].couponAmount })
        // if(isCouponExist.)
        for (var index = 0; index < orderedItems.length; index++) {

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = {
    addDiscountCoupon,
    editDiscountCouponById,
    getAllDiscountCouponByAdmin,
    deleteDiscountCouponByAdmin,
    getDiscountCouponById,
    calculateDiscount,
    applyCoupon
}