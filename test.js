const express = require("express");
const app = express();
const port = 5555
const mongoose = require("mongoose");

const checkAuth = require('./middileware/check-user-auth');
require("dotenv").config();
const moment = require('moment')
app.use(express.json())

mongoose
    .connect(
        `mongodb+srv://emedilife-demo:${process.env.DB_PASSWORD_ATLAS}@emedilifecluster.eq0bx.mongodb.net/emedilife-demo?retryWrites=true&w=majority`,
        // `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:27017/${process.env.DB_NAME}?authSource=${process.env.AUTH_SOURCE}`,
        // `mongodb://localhost:27017/${process.env.DB_NAME}`,
    )
    .then(() => {
        console.log("Connected to mongoDB");
    })
    .catch((err) => {
        console.error("Oops! Could not connect to mongoDB Cluster0", err);
    });
    const DiscountCoupon = require("./models/discountCoupon");
    const District = require("./models/district");
    const User = require("./models/user")
    mongoose.model('User');

app.post('/', checkAuth,  async (req, res) => {
    try {
        const { districtId } = req.body
        const { userId } = req.userData
        if (!userId || !districtId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const isDistrictExist = await District.findOne({ _id: districtId }).lean()
        if (!isDistrictExist) return res.json({ status: false, error: "No District Found!" })

        const isUserExist = await User.findOne({ _id: userId, hasAccess: true }).lean();
        if (!isUserExist) return res.json({ status: false, error: "No User Found!" })

        let now = moment()
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
        console.log("i am here");

        var items = JSON.parse(JSON.stringify(data.carts))
        for (let index = 0; index < items.length; index++) {
            if (!items[index].product.subCategory) {
                items[index].product.subCategory = { _id: "others", subCategoryName: "others" }
            }
        }

        let groupByProductKey = []
        let groupByProduct = items.reduce((r, a) => {
            if (!r[a.product._id])
                groupByProductKey.push(a.product._id)
            r[a.product._id] = [...r[a.product._id] || [], a];
            return r;
        }, {});
        for (let index = 0; index < groupByProductKey.length; index++) {
            let batch = groupByProduct[index]
            let subTotal = 0;
            console.log("index",index, batch)   
        }

        

        res.json({ status: true, discounts: 1 })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }

})
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));

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