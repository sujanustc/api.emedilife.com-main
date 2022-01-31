
// Require Post Schema from Model..

const Order = require('../models/order');
const OrderTemp = require('../models/order-temporary');
const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require('../models/coupon');
const UniqueId = require("../models/unique-id");

exports.placeTempOrder = async (req, res, next) => {

    try {

        const userId = req.userData.userId;
        // Increment Order Id Unique
        const incOrder = await UniqueId.findOneAndUpdate(
            {},
            { $inc: { orderId: 1 } },
            {new: true, upsert: true}
        )
        const orderIdUnique = padLeadingZeros(incOrder.orderId);
        const finalData = {...req.body, ...{user: userId, orderId: orderIdUnique}}
        const orderTemp = new OrderTemp(finalData);
        const orderTempSave = await orderTemp.save();

        if (req.body.couponId) {
            await Coupon.findByIdAndUpdate({_id: req.body.couponId}, { $push : { usedCoupons : userId } });
        }

        // UPDATE USER CARTS & CHECKOUT
        await User.findOneAndUpdate(
            {_id: userId},
            {$set: {carts: []}}
        )

        await Cart.deleteMany(
            {user: userId}
        )

        // await User.updateOne({_id: user}, {$set: {carts: []}});
        // await User.updateOne({_id: user}, {$push: {orders: orderSave._id}});
        // await Cart.deleteMany({_id: req.body.carts})

        res.json({
            _id: orderTempSave._id,
            orderId: orderIdUnique,
            success: true,
            message: 'Data added successfully',
        })

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateSessionKey = async (req, res, next) => {

    try {

        const tranId = req.params.tranId;
        const sessionkey = req.params.sessionkey;
        const tempOrder = await OrderTemp.updateOne({_id: tranId}, {$set: {sessionkey: sessionkey}});

        res.json({
            message: 'Session Key Updated Successfully!',
        })

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// exports.moveOrderToMainByTranId = async (req, res, next) => {

//     try {

//         const userId = req.userData.userId;


//         await User.findOneAndUpdate(
//             {_id: userId},
//             {$push: {checkouts: orderSave._id}}
//         )

//         res.json({
//             orderId: orderSave._id,
//             message: 'Data added successfully',
//         })

//     } catch (err) {
//         console.log(err)
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }



function padLeadingZeros(num) {
    return String(num).padStart(4, '0');
}

