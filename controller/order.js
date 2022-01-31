const { validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;

// Require Post Schema from Model..

const Order = require("../models/order");
const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const UniqueId = require("../models/unique-id");
const enumObj = require("../helpers/enum-obj");
const ax = require("axios");
const Controller = require("../helpers/controller");
const moment = require('moment');
const Prescription = require("../models/prescription")
const MinimumAmount = require('../models/minimumAmount')
const { getOffset, getMetaData } = require('../utils/utils')
const { PhoneNoList } = require("../helpers/phoneNoList")
/**
 * Add To ORDER
 * GET ORDER LIST
 */

exports.placeOrder = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error("Input Validation Error! Please complete required information.");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
        return;
    }

    try {
        const userId = req.userData.userId;
        const { subTotal } = req.body
        const minimumAmount = await MinimumAmount.findOne({ status: 1 }).sort({ createdAt: -1 }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });

        if (minimumAmount && (subTotal < minimumAmount.amount)) return res.json({ status: false, message: `Minimum Order ${minimumAmount.amount} Tk` })
        // Increment Order Id Unique
        const incOrder = await UniqueId.findOneAndUpdate({}, { $inc: { orderId: 1, dailyOrderId: 1 } }, { new: true, upsert: true });

        var orderIdUnique = padLeadingZeros(incOrder.dailyOrderId);

        orderIdUnique = "EML" + moment().format("DDMMYY") + orderIdUnique;

        const finalData = { ...req.body, ...{ user: userId, orderId: orderIdUnique } };
        const order = new Order(finalData);
        const orderSave = await order.save();

        if (req.body.couponId) {
            await Coupon.findByIdAndUpdate({ _id: req.body.couponId }, { $push: { couponUsedByUser: userId } });
            await User.findOneAndUpdate({ _id: userId }, { $push: { usedCoupons: req.body.couponId } })
        }

        // UPDATE USER CARTS & CHECKOUT
        await User.findOneAndUpdate(
            { _id: userId },
            { $set: { carts: [], }, $push: { checkouts: orderSave._id } }
        );

        await Cart.deleteMany({ user: new ObjectId(userId) });

        let messageString = `New Order Placed!\nOrder Id: ${orderIdUnique}\nEmedilife Limited`
        PhoneNoList.forEach(phoneNo => {
            Controller.sendBulkSms(phoneNo, messageString)
        });
        return res.json({
            _id: orderSave._id,
            orderId: orderIdUnique,
            status: true,
            message: "Order Placed successfully",
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

exports.placePrescriptionOrder = async (req, res, next) => {
    try {
        var { userId, name, phoneNo, district, area, shippingAddress, images, checkoutDate, orderNotes, email, orderTimeline, orderFrom } = req.body;
        !userId ? userId = req.userData.userId : null
        if (!userId || !name || !phoneNo || !district || !area || !shippingAddress || !images || !checkoutDate)
            return res.status(400).json({ status: false, message: "Missing Fields" })

        const userExist = await User.findOne({ _id: userId }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });
        if (!userExist) return res.json({ status: false, message: "No user Find With this Id" })

        var prescriptionCount = await Prescription.countDocuments({ userId: userId }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });
        prescriptionCount += 1;
        var prescriptionTitle = "Prescription" + prescriptionCount;
        const prescription = new Prescription({ userId: userId, title: prescriptionTitle, images: images })
        const savedPrescription = await prescription.save().catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });
        // Increment Order Id Unique
        const incOrder = await UniqueId.findOneAndUpdate({}, { $inc: { orderId: 1, dailyOrderId: 1 } }, { new: true, upsert: true }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });;
        var orderIdUnique = padLeadingZeros(incOrder.dailyOrderId);
        orderIdUnique = "EML" + moment().format("DDMMYY") + orderIdUnique;

        const order = new Order({
            orderId: orderIdUnique,
            checkoutDate: checkoutDate,
            deliveryStatus: 1, //Pending
            paymentMethod: "cash_on_delivery", //Cash on delivery by default
            paymentStatus: "unpaid", //default payment status
            user: userId,
            name: name,
            phoneNo: phoneNo,
            email: email ? email : userExist.email,
            district: district,
            area: area,
            shippingAddress: shippingAddress,
            orderNotes: orderNotes,
            orderType: "1", //for Prescription Order
            prescriptionId: savedPrescription._id,
            orderTimeline: orderTimeline,
            orderFrom: orderFrom
        });
        const orderSave = await order.save().catch(error => {
            console.log(error);
            res.status(500).json({ status: false, error: error.message })
        });

        // UPDATE USER CARTS & CHECKOUT
        await User.findOneAndUpdate(
            { _id: userId },
            {
                $push: { checkouts: orderSave._id },
                $set: { fullName: name, shippingAddress: shippingAddress, district: district, area: area, email: email }
            }
        ).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });

        await Cart.deleteMany({ user: new ObjectId(userId) }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });
        let messageString = `New Order Placed!\nOrder Id: ${orderIdUnique}\nEmedilife Limited`
        PhoneNoList.forEach(phoneNo => {
            Controller.sendBulkSms(phoneNo, messageString)
        });
        return res.json({
            _id: orderSave._id,
            orderId: orderIdUnique,
            phoneNo: orderSave.phoneNo,
            status: true,
            message: "Order Placed successfully",
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

exports.placeTelemedicineOrder = async (req, res) => {
    try {
        const { phoneNo, checkoutDate, deliveryDate, subTotal, shippingFee, discount,
            totalAmount, totalAmountWithDiscount, paymentMethod, paymentStatus, name, email,
            district, area, shippingAddress, couponId, couponValue, orderTimeline, orderedItems,
            orderNotes } = req.body;

        if (!phoneNo || !subTotal || !totalAmount || !totalAmountWithDiscount || !name || !district ||
            !area || !shippingAddress || !orderedItems) return res.status(400).json({ status: false, message: "Missing Fields" })
        // console.log(phoneNo, phoneNo.length, phoneNo.length != 11, phoneNo.length != 13, phoneNo.length != 11 || phoneNo.length != 13)
        if (phoneNo.length != 11) return res.json({ status: false, message: "Phone No is Not Valid" })
        const minimumAmount = await MinimumAmount.findOne({ status: 1 }).sort({ createdAt: -1 }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });
        if (minimumAmount && (subTotal < minimumAmount.amount)) return res.json({ status: false, message: `Minimum Order ${minimumAmount.amount} Tk` })

        const userExist = await User.findOne({ phoneNo: phoneNo }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });
        let user;
        if (userExist) {
            user = userExist;
        } else {
            const schema = new User({
                fullName: name,
                phoneNo: phoneNo,
                email: email,
                username: phoneNo,
                isPhoneVerified: false,
                isEmailVerified: false,
                registrationType: "admin",
                registrationAt: moment(),
                hasAccess: true,
                district: district,
                area: area,
                shippingAddress: shippingAddress
            })

            user = await schema.save().catch(error => {
                console.log(error);
                return res.json({ status: false, error: error.message })
            });
        }

        // Increment Order Id Unique
        const incOrder = await UniqueId.findOneAndUpdate({}, { $inc: { orderId: 1, dailyOrderId: 1 } }, { new: true, upsert: true }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });;
        var orderIdUnique = padLeadingZeros(incOrder.dailyOrderId);
        orderIdUnique = "EML" + moment().format("DDMMYY") + orderIdUnique;

        const order = new Order({
            orderId: orderIdUnique,
            checkoutDate: checkoutDate ? checkoutDate : moment(),
            deliveryDate: deliveryDate,
            deliveryStatus: 1, //Pending
            subTotal: subTotal,
            shippingFee: shippingFee,
            discount: discount,
            totalAmount: totalAmount,
            totalAmountWithDiscount: totalAmountWithDiscount,
            refundAmount: 0,
            paymentMethod: paymentMethod ? paymentMethod : "cash_on_delivery", //Cash on delivery by default
            paymentStatus: paymentStatus ? paymentStatus : "unpaid", //default payment status
            user: user._id,
            name: name,
            phoneNo: phoneNo,
            email: email,
            district: district,
            area: area,
            shippingAddress: shippingAddress,
            orderNotes: orderNotes,
            couponId: couponId,
            couponValue: couponValue,
            orderType: "2", //for Telemedicine Order
            orderTimeline: orderTimeline,
            orderedItems: orderedItems,
            orderFrom: "Phone Call"

        });
        const orderSave = await order.save().catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });

        if (req.body.couponId) {
            await Coupon.findByIdAndUpdate({ _id: req.body.couponId }, { $push: { couponUsedByUser: user._id } }).catch(error => {
                console.log(error);
                return res.json({ status: false, error: error.message })
            });
            await User.findOneAndUpdate({ _id: user._id }, { $push: { usedCoupons: req.body.couponId } }).catch(error => {
                console.log(error);
                return res.json({ status: false, error: error.message })
            });
        }

        // UPDATE USER CHECKOUT
        await User.findOneAndUpdate(
            { _id: user._id },
            {
                $push: { checkouts: orderSave._id },
                $set: { fullName: name, shippingAddress: shippingAddress, district: district, area: area, email: email }
            }
        ).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });

        return res.json({
            _id: orderSave._id,
            orderId: orderIdUnique,
            status: true,
            message: "Order Placed successfully",
        });
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: error })
    }
};

exports.getAllTelemedicineOrderByAdmin = async (req, res) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;
        let query = req.body.query;

        let dataCount;
        let queryData;
        if (query) {
            queryData = Order.find({ query, orderType: "2" });
            dataCount = await Order.countDocuments({ query, orderType: "2" });
        } else {
            queryData = Order.find({ orderType: "2" });
            dataCount = await Order.countDocuments({ orderType: "2" });
        }
        let data;

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({ createdAt: -1 });


        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Order get Successfully!'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: err })
    }
}

exports.getAllTelemedicineOrderByUser = async (req, res) => {
    try {
        var { userId, pageSize, page } = req.query
        userId ? null : userId = req.userData.userId;
        if (!userId) return res.status(400).json({ status: false, message: "Missing Fields" })

        var pLimit = parseInt(pageSize);
        let { offset, limit } = getOffset(page, pLimit);

        var results = await Order.find({ user: userId, orderType: "2" }).skip(offset).limit(limit).sort({ createdAt: -1 })
        const count = await Order.countDocuments({ user: userId, orderType: "2" })

        return res.status(200).json({ status: true, message: "All Telemedicine Order get Successfully", data: results, count: count })
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: error })
    }
}

exports.confirmPrescriptionOrder = async (req, res) => {
    const { orderId, deliveryDate, subTotal, shippingFee, discount, totalAmount,
        totalAmountWithDiscount, deletedProduct, refundAmount, paymentMethod, paymentStatus,
        alternativePhoneNo, email, district, area, shippingAddress,
        couponId, couponValue, orderedItems, hasPreorderItem, orderNotes, sessionkey } = req.body

    //Validations
    if (!orderId || !subTotal || !totalAmount || !totalAmountWithDiscount || !orderedItems) return res.status(400).json({ status: false, message: "Missing Fields" });

    //checking if order is exist or not
    const orderExist = await Order.findOne({ orderId: orderId }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    if (!orderExist) return res.status(200).json({ status: false, message: "Order Id invalid" })

    const minimumAmount = await MinimumAmount.findOne({ status: 1 }).sort({ createdAt: -1 }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });

    if (minimumAmount && (subTotal < minimumAmount.amount)) return res.status(200).json({ status: false, message: `Minimum Order ${minimumAmount.amount} Tk` })

    //setting variables for update update
    var updatePhase = "orderTimeline.orderPlaced";
    var updatePhaseDate = "orderTimeline.orderPlacedDate";
    // var nextUpdatePhaseDate = "orderTimeline.orderProcessingDate";

    //update order
    const data = await Order.updateOne({ orderId: orderId }, {
        deliveryDate: deliveryDate,
        subTotal: subTotal,
        shippingFee: shippingFee,
        discount: discount,
        totalAmount: totalAmount,
        totalAmountWithDiscount: totalAmountWithDiscount,
        deletedProduct: deletedProduct ? deletedProduct : false,
        refundAmount: refundAmount ? refundAmount : 0,
        paymentMethod: paymentMethod ? paymentMethod : orderExist.paymentMethod,
        paymentStatus: paymentStatus ? paymentStatus : orderExist.paymentStatus,
        alternativePhoneNo: alternativePhoneNo,
        email: email ? email : orderExist.email,
        district: district ? district : orderExist.district,
        area: area ? area : orderExist.area,
        shippingAddress: shippingAddress ? shippingAddress : orderExist.shippingAddress,
        couponId: couponId,
        couponValue: couponValue ? couponValue : 0,
        [updatePhase]: true,
        [updatePhaseDate]: moment(),
        // [nextUpdatePhaseDate]: nextPhaseDate,
        deliveryStatus: 2,
        orderedItems: orderedItems,
        hasPreorderItem: hasPreorderItem ? hasPreorderItem : false,
        orderNotes: orderNotes ? orderNotes : orderExist.orderNotes,
        sessionkey: sessionkey
    }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });

    //register user for userd coupon
    if (couponId) {
        await Coupon.findByIdAndUpdate({ _id: couponId }, { $push: { couponUsedByUser: orderExist.user } }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });
    }

    //sending bulk sms
    var smsData = {
        phoneNo: orderExist.phoneNo,
        sms: `Dear ${orderExist.name}, Your order ${orderId} is confirmed. Thank you for shopping at www.emedilife.com`
    };
    // smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id
    //     } is confirmed. Thank you for shopping at www.emedilife.com`;
    Controller.sendBulkSms(smsData.phoneNo, smsData.sms);

    //sending response
    if (data) {
        return res.status(200).json({
            orderId: orderId,
            status: true,
            message: "Prescription Order Confirmed successfully",
        });
    }
    else return res.json({ status: false, message: "Something wrong. Try Later or contact to service" })
};

exports.getAllPrescriptionOrderByUser = async (req, res) => {
    var { userId, pageSize, page } = req.body
    userId ? null : userId = req.userData.userId;
    if (!userId) return res.json({ status: false, message: "Missing Fields" })
    const userExist = await User.findOne({ _id: userId }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    if (!userExist) return res.json({ status: false, message: "User does not exist with this userId" })

    var pLimit = parseInt(pageSize);
    let { offset, limit } = getOffset(page, pLimit);

    var results = await Order.find({ user: userId, orderType: "1" }).skip(offset).limit(limit).sort({ createdAt: -1 }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    const count = await Order.countDocuments({ user: userId, orderType: "1" }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });

    if (results) {
        return res.json({ status: true, message: "All Prescription Order get Successfully", data: results, count: count })
    }
    else return res.json({ status: false, message: "Something wrong" })
}

exports.getAllPrescriptionOrderByAdmin = async (req, res) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;
        let query = req.body.query;

        let dataCount;
        let queryData;
        if (query) {
            queryData = Order.find({ query, orderType: "1" });
            dataCount = await Order.countDocuments({ query, orderType: "1" });
        } else {
            queryData = Order.find({ orderType: "1" });
            dataCount = await Order.countDocuments({ orderType: "1" });
        }
        let data;

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({ createdAt: -1 });


        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Order get Successfully!'
        });
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }



    // var { pageSize, page } = req.body
    // var pLimit = parseInt(pageSize);
    // let { offset, limit } = getOffset(page, pLimit);

    // var results = await Order.find({orderType: "1"}).skip(offset).limit(limit).sort({createdAt: -1}).catch(error => {
    //     console.log(error);
    //     res.json({ status: false, error: error.message })
    // });
    // const count = await Order.countDocuments({user: userId, orderType: "1"}).catch(error => {
    //     console.log(error);
    //     res.json({ status: false, error: error.message })
    // });

    // if(results) {
    //     return res.json({status: true, message: "All Prescription Order get Successfully", data: results, count: count})
    // }
    // else if(count==0){
    //     return res.json({status: false, message: "No Prescripton order found", data: [], count: count})
    // }
    // else return res.json({status: false, message: "Something wrong"})
}

// exports.getAllOrdersByUser = async (req, res, next) => {
//     try {
//         const orders = await User.findById(req.userData.userId)
//             .populate('checkouts')
//             .select('checkouts -_id');
//
//         res.json({
//             data: orders ? orders.orders : orders
//         })
//
//     } catch (error) {
//         res.json({
//             success: false,
//             errorMsg: error.message,
//             message: "Something went Wrong"
//         })
//         next(error);
//     }
// }

exports.getAllOrdersByUser = async (req, res, next) => {
    try {
        const userId = req.userData.userId;

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;
        let orderType = req.query.orderType;

        let queryData;
        let queryCount;

        if (orderType) {
            queryData = Order.find({ user: userId, orderType: orderType });
            queryCount = Order.countDocuments({ user: userId, orderType: orderType });
        } else {
            queryData = Order.find({ user: userId });
            queryCount = Order.countDocuments({ user: userId });
        }

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize));
        }

        const data = await queryData.select(select ? select : "").sort({ createdAt: -1 });

        const dataCount = await queryCount;

        res.status(200).json({
            data: data,
            count: dataCount,
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

exports.getOrderDetailsById = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const query = { _id: orderId };
        var data = await Order.findOne(query)
            .select("-updatedAt -sessionkey -orderPaymentInfo")
            .populate({
                path: "orderedItems.product",
                model: "Product",
                select: "productName productSlug price category subCategory brand generic images",
                populate: [
                    {
                        path: "category",
                        model: "ProductCategory",
                        select: "categoryName",
                    },
                    {
                        path: "brand",
                        model: "ProductBrand",
                        select: "brandName",
                    },
                    {
                        path: "generic",
                        model: "Generic",
                        select: "name",
                    },
                ],
            })
            .populate({ path: "prescriptionId", select: 'images -_id' })

        if (data.orderedItems.length && data.orderedItems[0].mrp) {
            return res.json({
                status: true,
                data: data,
                message: "Order Fetch Successfully!",
            });
        }
        var products = data.orderedItems
        var mrp = []
        for (let index = 0; index < products.length; index++) {
            const product = await Product.findById(products[index].product._id).populate({ path: "prices.unit" })
            var prices = product.prices;
            for (let index2 = 0; index2 < prices.length; index2++) {
                if (prices[index2].unit.name == products[index].unitType) {
                    mrp[index] = prices[index2].price
                    break;
                }
            }
        }
        var newProducts = []
        for (let index = 0; index < products.length; index++) {
            let obj = {}
            let obj1 = products[index]
            let obj2 = { mrp: mrp[index] }
            obj = { ...obj1._doc, ...obj2 }
            newProducts.push(obj)
        }




        data._doc.orderedItems = newProducts
        res.status(200).json({
            data: data,
            message: "Order Fetch Successfully!",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, error: err})
    }
};

exports.cancelOrderByUser = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        let order = await Order.findById(orderId);

        if (order.deliveryStatus === enumObj.Order.PENDING && order.paymentStatus === "unpaid") {
            order.deliveryStatus = enumObj.Order.CANCEL;
            await order.save();

            res.status(200).json({
                message: "Order has been canceled",
                status: 1,
            });
        } else {
            res.status(200).json({
                message: "You can't cancel this order. Please contact with seller",
                status: 0,
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

exports.getAllTransactionByUser = async (req, res, next) => {
    try {
        const userId = req.userData.userId;

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let data;
        let queryData;
        queryData = Order.find({
            $and: [
                { user: userId },
                {
                    $or: [{ deliveryStatus: enumObj.Order.DELIVERED }, { paymentStatus: "paid" }],
                },
            ],
        });

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize));
        }

        data = await queryData.select(select ? select : "").sort({ createdAt: -1 });

        const dataCount = await Order.countDocuments({
            $and: [
                { user: userId },
                {
                    $or: [{ deliveryStatus: enumObj.Order.DELIVERED }, { paymentStatus: "paid" }],
                },
            ],
        });

        res.status(200).json({
            data: data,
            count: dataCount,
            message: "Transaction get Successfully!",
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

exports.getAllOrdersByAdmin = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let page = req.query.page;
        let select = req.query.select;
        let query = req.body.query;
        let searchKey = req.query.searchKey

        if (searchKey) {
            var pLimit = parseInt(pageSize);
            let { offset, limit } = getOffset(page, pLimit);

            const newQuery = searchKey.split(/[ ,]+/);
            const queryArray = newQuery.map((str) => ({ orderId: RegExp(str, 'i') }));
            const queryArray2 = newQuery.map((str) => ({ phoneNo: RegExp(str, 'i') }));

            let orders;
            let countOrders;
            let filter = query
            if (filter) {
                // filter = JSON.parse(filter)
                orders = await Order.find({
                    $and: [
                        filter,
                        {
                            $or: [
                                { $and: queryArray },
                                { $and: queryArray2 },
                            ]
                        }
                    ]
                }).skip(offset).limit(limit).sort({ createdAt: -1 });
                countOrders = await Order.countDocuments({
                    $and: [
                        filter,
                        {
                            $or: [
                                { $and: queryArray },
                                { $and: queryArray2 },
                            ]
                        }
                    ]
                });
            } else {
                orders = await Order.find({
                    $or: [
                        { $and: queryArray },
                        { $and: queryArray2 },
                    ]
                }).skip(offset).limit(limit).sort({ createdAt: -1 });
                countOrders = await Order.countDocuments({
                    $or: [
                        { $and: queryArray },
                        { $and: queryArray2 },
                    ]
                });
            }
            return res.json({
                status: true,
                data: orders,
                count: countOrders,
                message: "Order Get Successfully!"
            });

        }
        let dataCount;
        let queryData;
        if (query) {
            queryData = Order.find(query);
            dataCount = await Order.countDocuments(query);
        } else {
            queryData = Order.find();
            dataCount = await Order.countDocuments();
        }
        let data;

        if (pageSize && page) {
            queryData.skip(Number(pageSize) * (Number(page) - 1)).limit(Number(pageSize));
        }

        data = await queryData.select(select ? select : "").sort({ createdAt: -1 });

        res.status(200).json({
            data: data,
            count: dataCount,
            message: "Order get Successfully!",
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

exports.getAllTransactionByAdmin = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let data;
        let queryData;
        queryData = Order.find({
            $and: [
                {
                    $or: [{ deliveryStatus: enumObj.Order.DELIVERED }, { paymentStatus: "paid" }],
                },
            ],
        });

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize));
        }

        data = await queryData.select(select ? select : "").sort({ createdAt: -1 });

        const dataCount = await Order.countDocuments({
            $and: [
                {
                    $or: [{ deliveryStatus: enumObj.Order.DELIVERED }, { paymentStatus: "paid" }],
                },
            ],
        });

        res.status(200).json({
            data: data,
            count: dataCount,
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

exports.getSingleOrderByUser = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId).populate({
            path: "orderedBooks.bookId",
            model: "Book",
            select: "_id name slug image price discountPercent availableQuantity author authorName categoryName",
        });

        return res.json({
            data: order,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Something went Wrong",
        });
        next(error);
    }
};

exports.getSingleOrderByAdmin = async (req, res, next) => {
    try {
        var order = await Order.findById(req.params.orderId)
            .populate({ path: "user", select: 'fullName phoneNo email area district shippingAddress' })
            .populate({ path: "prescriptionId", select: 'images -_id' })

        return res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Somrthing went Wrong",
        });
        next(error);
    }
};

exports.getUserOrdersByAmin = async (req, res, next) => {
    try {
        const order = await Order.find({ userId: req.params.userId });
        return res.json({
            success: true,
            data: order,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.deleteOrderByAdmin = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);
        const userId = order.userId;

        await User.updateOne(
            { _id: userId },
            {
                $pull: { orders: order._id },
            }
        );

        await Order.findByIdAndDelete(req.params.orderId);

        return res.json({
            message: "Order is deleted",
        });
    } catch (err) {
        // console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};


exports.canclePrescriptionOrderByAdmin = async (req, res, next) => {
    try {
        const { orderId } = req.body
        if (!orderId) return res.status(400).json({ status: false, message: "Missing Fields" })
        var updatePhase = "orderTimeline.orderCanceled";
        var updatePhaseDate = "orderTimeline.orderCanceledDate";
        await Order.findOneAndUpdate({ orderId: orderId }, {
            deliveryStatus: 6,
            [updatePhase]: true,
            [updatePhaseDate]: moment(),
        }).catch(error => {
            console.log(error);
            return res.json({ status: false, error: error.message })
        });


        res.status(200).json({
            status: true,
            message: "Order is Canceled Successfully"
        });
    } catch (err) {
        // console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getAllCanceledOrdersByAdmin = async (req, res, next) => {
    try {
        const orders = await Order.find({ deliveryStatus: 6 });
        return res.json({
            success: true,
            data: orders,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getAllOrdersByAdminNoPaginate = async (req, res, next) => {
    try {
        const { filter } = req.query
        var order = []
        if (filter) {
            order = await Order.find(JSON.parse(filter))
                .populate({
                    path: "orderedItems.product",
                    model: "Product",
                    select: "productName productSlug price category categorySlug subCategory subCategorySlug brand brandSlug images",
                })
                .sort({ createdAt: -1 });
        } else {
            order = await Order.find()
                .populate({
                    path: "orderedItems.product",
                    model: "Product",
                    select: "productName productSlug price category categorySlug subCategory subCategorySlug brand brandSlug images",
                })
                .sort({ createdAt: -1 });
        }

        return res.json({
            status: true,
            data: order,
            message: "Successfully retrieved orders",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
};

exports.getAllOrdersByAdminForFilteredExcel = async (req, res, next) => {
    try {
        var { filter, pageSize, currentPage } = req.query
        if (!filter || filter == {}) return res.status(400).json({ status: false, error: "Bad Request!" })
        pageSize = pageSize ? pageSize : 50
        var pLimit = parseInt(pageSize);
        let { offset, limit } = getOffset(currentPage, pLimit);
        const order = await Order.find(JSON.parse(filter))
            .populate({
                path: "orderedItems.product",
                model: "Product",
                select: "productName productSlug price category categorySlug subCategory subCategorySlug brand brandSlug images",
            }).skip(offset).limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            status: true,
            data: order,
            message: "Successfully retrieved orders",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
};

exports.changeDeliveryStatus = async (req, res, next) => {
    try {
        const deliveryStatus = req.body.deliveryStatus;

        const order = await Order.findOne({ _id: req.body._id }).populate("user");

        const smsData = {
            phoneNo: order.phoneNo,
            sms: "",
        };

        let updatePhase;
        let updatePhaseDate;
        let nextUpdatePhaseDate;

        switch (deliveryStatus) {
            case enumObj.Order.CONFIRM:
                updatePhase = "orderTimeline.orderPlaced";
                updatePhaseDate = "orderTimeline.orderPlacedDate";
                nextUpdatePhaseDate = "orderTimeline.orderProcessingDate";
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id
                    } is confirmed. Thank you for shopping at www.emedilife.com`;
                break;
            case enumObj.Order.PROCESSING:
                updatePhase = "orderTimeline.orderProcessing";
                updatePhaseDate = "orderTimeline.orderProcessingDate";
                nextUpdatePhaseDate = "orderTimeline.orderPickedByDeliveryManDate";
                smsData.sms = `Dear ${order.name}, We have started processing your order ${order.orderId ? order.orderId : order._id
                    }. Thank you for shopping at www.emedilife.com`;
                break;
            case enumObj.Order.ON_THE_WAY:
                updatePhase = "orderTimeline.orderPickedByDeliveryMan";
                updatePhaseDate = "orderTimeline.orderPickedByDeliveryManDate";
                nextUpdatePhaseDate = "orderTimeline.orderDeliveredDate";
                smsData.sms = `Dear ${order.name}, We have handed over your order ${order.orderId ? order.orderId : order._id
                    } to our delivery partner. Your product will be delivered soon. Thank you for shopping at www.emedilife.com`;
                break;
            case enumObj.Order.DELIVERED:
                updatePhase = "orderTimeline.orderDelivered";
                updatePhaseDate = "orderTimeline.orderDeliveredDate";
                nextUpdatePhaseDate = "orderTimeline.othersDate";
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id
                    } is now delivered. Thank you for shopping at www.emedilife.com`;
                break;
            case enumObj.Order.CANCEL:
                await Order.updateOne({ _id: req.body._id }, { orderCancelationNote: req.body.cancelNote })
                updatePhase = "orderTimeline.others";
                updatePhaseDate = "orderTimeline.othersDate";
                nextUpdatePhaseDate = "orderTimeline.othersDate";
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id
                    } is canceled. Please order again at www.emedilife.com`;
                break;
            case enumObj.Order.REFUND:
                updatePhase = "orderTimeline.others";
                updatePhaseDate = "orderTimeline.othersDate";
                nextUpdatePhaseDate = "orderTimeline.othersDate";
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id} valued BDT ${order.totalAmount
                    } is refunded to your account. The refund will take some days to reflect on your account statement. Thank you for shopping at www.emedilife.com`;
                break;
            default:
                updatePhase = "orderTimeline.others";
                updatePhaseDate = "orderTimeline.othersDate";
                nextUpdatePhaseDate = "orderTimeline.othersDate";
                smsData.sms =
                    "Dear " +
                    order.name +
                    ", your order no. " +
                    req.body._id +
                    " has changed in status on " +
                    req.body.updateDate +
                    "please log into your account and check your order details. E-medilife.";
        }

        const updateDate = req.body.updateDate;
        const nextPhaseDate = req.body.nextPhaseDate;
        await Order.findOneAndUpdate(
            { _id: req.body._id },
            {
                $set: {
                    [updatePhase]: true,
                    [updatePhaseDate]: updateDate,
                    [nextUpdatePhaseDate]: nextPhaseDate,
                    deliveryStatus: deliveryStatus,
                },
            }
        );

        /**
         * SMS SENT SSL
         */
        Controller.sendBulkSms(smsData.phoneNo, smsData.sms);

        if (req.body.deliveryStatus === enumObj.Order.DELIVERED) {
            await Order.findOneAndUpdate({ _id: req.body._id }, { $set: { paymentStatus: "paid" } });
            const order = await Order.findOne({ _id: req.body._id }).populate({
                path: "orderedItems.product",
                model: "Product",
                select: "soldQuantity quantity",
            });

            if (order && order.orderedItems.length) {
                const mOrderProducts = order.orderedItems.map((m) => {
                    return {
                        _id: m.product._id,
                        soldQuantity: m.quantity,
                        productSoldQty: m.product.soldQuantity,
                        productQty: m.product.quantity,
                    };
                });
                mOrderProducts.forEach((m) => {
                    // Create Complex Query
                    const q1 = incrementSoldQuantityQuery(m);
                    const q2 = decrementQuantityQuery(m);
                    let finalQuery;
                    if (q1.$inc && q2.$inc) {
                        finalQuery = { $inc: { soldQuantity: q1.$inc.soldQuantity, quantity: q2.$inc.quantity } };
                    } else {
                        finalQuery = { ...q1, ...q2 };
                    }

                    // Update Product Data
                    Product.updateOne({ _id: m._id }, finalQuery, { new: true, upsert: true, multi: true }).exec();
                });
            }
        }

        res.json({
            message: "Order status updated",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
};

exports.filterByDynamicFilters = async (req, res, next) => {
    try {
        let limit = req.body.limit;
        const deliveryStatus = req.query.deliveryStatus;

        // const parent = req.body.parent;
        const queryData = await Order.find({ deliveryStatus: deliveryStatus });

        if (limit && limit.pageSize && limit.currentPage) {
            queryData.skip(limit.pageSize * (limit.currentPage - 1)).limit(limit.pageSize);
        }

        const dataCount = await Order.countDocuments({ deliveryStatus: deliveryStatus });

        const data = await queryData;

        res.status(200).json({
            data: data,
            count: dataCount,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.filterByDateRange = async (req, res, next) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const queryData = await Order.find({ checkoutDate: { $gte: startDate, $lte: endDate } });

        if (limit && limit.pageSize && limit.currentPage) {
            queryData.skip(limit.pageSize * (limit.currentPage - 1)).limit(limit.pageSize);
        }

        const dataCount = await Order.countDocuments({ deliveryStatus: query });

        const data = await queryData;

        res.status(200).json({
            data: data,
            count: dataCount,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.testSslSmsApi = (req, res, next) => {
    const smsData = {
        user: process.env.SMSUSER,
        pass: process.env.SMSPASS,
        msisdn: "8801773253900",
        sms: "A test message from nodejs",
        sid: process.env.SMSSID,
        csmsid: "014578874512577895",
    };
    // GET
    // const apiEnd = "https://sms.sslwireless.com/pushapi/dynamic/server.php";
    // ax.get(apiEnd, {
    //     params: smsData
    // }).then(function (response) {
    //         console.log("response:");
    //         console.log(response.data);
    //         res.status(200).json({
    //             success: true,
    //         });
    //     })
    //     .catch(function (error) {
    //         console.log("error:");
    //         res.status(200).json({
    //             success: false,
    //         });
    //         console.log(error);
    //     });

    var apiEnd = "https://sms.sslwireless.com/pushapi/dynamic/server.php";
    let payload =
        "user=" +
        encodeURI(smsData.user) +
        "&pass=" +
        encodeURI(smsData.pass) +
        "&sid=" +
        encodeURI(smsData.sid) +
        "&sms[0][0]=" +
        smsData.msisdn +
        "&sms[0][1]=" +
        encodeURI(smsData.sms) +
        "&sms[0][2]=" +
        smsData.csmsid +
        "";
    ax.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    ax.post(apiEnd, payload)
        .then(function (response) {
            console.log("response::");
            // console.log(response.data);
            res.status(200).json({
                success: true,
            });
        })
        .catch(function (error) {
            console.log("error::");
            // console.log(error);
            res.status(200).json({
                success: false,
            });
        });
};

/**
 * ADDITIONAL FUNCTIONS
 */
function padLeadingZeros(num) {
    return String(num).padStart(6, "0");
}

function incrementSoldQuantityQuery(item) {
    let query;
    if (item.productSoldQty) {
        query = {
            $inc: {
                soldQuantity: item.soldQuantity ? item.soldQuantity : 1,
            },
        };
    } else {
        query = {
            $set: {
                soldQuantity: item.soldQuantity ? item.soldQuantity : 1,
            },
        };
    }
    return query;
}

function decrementQuantityQuery(item) {
    let query;
    if (item.productQty) {
        query = {
            $inc: {
                quantity: -(item.soldQuantity ? item.soldQuantity : 1),
            },
        };
    } else {
        query = {
            $set: {
                quantity: -(item.soldQuantity ? item.soldQuantity : 1),
            },
        };
    }

    return query;
}



//Additional work
exports.updateOrderIdByOrderId = async (req, res) => {
    try {
        const { orderId, newOrderId } = req.query;

        if (!orderId || !newOrderId) return res.status(400).json({ status: false, message: "Missing Fields" })

        const isExist = await Order.findOne({ orderId: orderId });

        if (!isExist) return res.status(200).json({ status: false, message: "Order not found with this orderId" });

        const data = await Order.updateOne({ orderId: orderId }, { orderId: newOrderId })

        if (data) return res.status(200).json({ status: true, message: "Order Updated Successfully", data });
        else return res.status(500).json({ status: false, message: "Something wrong", data });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, error })
    }
}

exports.deleteAllOrdersExceptOne = async (req, res) => {
    try {
        const { orderId } = req.query;
        if (!orderId) return res.status(400).json({ status: false, message: "Missing Fields" })

        const isExist = await Order.findOne({ orderId: orderId });
        if (!isExist) return res.status(200).json({ status: false, message: "Order not found with this orderId" });

        const data = await Order.deleteMany({ orderId: { $ne: orderId } });
        if (data) return res.status(200).json({ status: true, message: "Order Updated Successfully", data });
        else return res.status(500).json({ status: false, message: "Something wrong", data });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, error })
    }
}

exports.orderReset = async (req, res) => {
    try {
        const orderId = "EML271121000102"

        const data = await Order.deleteMany({ orderId: { $ne: orderId } });
        const data2 = await Order.updateOne({ orderId: orderId }, { orderId: "EML271121000001" })
        const data3 = await UniqueId.findOneAndUpdate({}, { orderId: 1, dailyOrderId: 0 })
        res.status(200).json({ status: true, delete: data, update: data2, reset: data3 });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, error })
    }
}

require("dotenv").config();
exports.deleteOrderByOrderId = async (req, res) => {
    try {
        const { orderId, pass } = req.body
        if (!orderId || !pass) return res.status(400).json({ status: false, message: "Missing Fields" })
        if (pass == process.env.ORDER_PASS) {
            await Order.findOneAndDelete({ orderId: orderId })
            return res.json({ status: true, message: "Order Deleted Successfully" })
        } else {
            return res.status(200).json({ status: false, message: "Pass Not Match" })
        }
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: error })
    }
}

exports.editOrderByOrderId = async (req, res) => {
    try {
        const { _id, subTotal, shippingFee, discount,
            totalAmount, totalAmountWithDiscount, couponValue, orderedItems } = req.body
        if (!_id || !orderedItems) return res.status(400).json({ status: false, error: "Bad Request!" })

        const isOrderExist = await Order.findOne({ _id: _id }).lean()
        if (!isOrderExist) return res.json({ status: false, error: "No Order Found!" })

        await Order.updateOne({ _id: _id }, {
            subTotal: subTotal,
            shippingFee: shippingFee,
            discount: discount,
            totalAmount: totalAmount,
            totalAmountWithDiscount: totalAmountWithDiscount,
            couponValue: couponValue,
            orderedItems: orderedItems
        })
        return res.json({ status: true, message: "Order Updated Successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.getOrderBySearch = async (req, res) => {
    try {
        var { pageSize, page, searchKey, filter } = req.query;
        if (!searchKey || searchKey == "") return res.status(400).json({ status: false, error: "Bad Request!" })

        var pLimit = parseInt(pageSize);
        let { offset, limit } = getOffset(page, pLimit);

        const newQuery = searchKey.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({ orderId: RegExp(str, 'i') }));
        const queryArray2 = newQuery.map((str) => ({ phoneNo: RegExp(str, 'i') }));

        let orders;
        let countOrders;
        if (filter) {
            filter = JSON.parse(filter)
            orders = await Order.find({
                $and: [
                    filter,
                    {
                        $or: [
                            { $and: queryArray },
                            { $and: queryArray2 },
                        ]
                    }
                ]
            }).skip(offset).limit(limit).sort({ createdAt: -1 });
            countOrders = await Order.countDocuments({
                $and: [
                    filter,
                    {
                        $or: [
                            { $and: queryArray },
                            { $and: queryArray2 },
                        ]
                    }
                ]
            });
        } else {
            orders = await Order.find({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 },
                ]
            }).skip(offset).limit(limit).sort({ createdAt: -1 });
            countOrders = await Order.countDocuments({
                $or: [
                    { $and: queryArray },
                    { $and: queryArray2 },
                ]
            });
        }
        res.json({
            status: true,
            data: orders,
            count: countOrders,
            message: "Order Get Successfully!"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.placePrescriptionReorder = async (req, res) => {
    try {
        const { name, phoneNo, district, area, shippingAddress, prescriptionId, checkoutDate, orderNotes, email, orderTimeline, orderFrom } = req.body;
        const userId = req.userData.userId
        if (!userId || !name || !phoneNo || !district || !area || !shippingAddress || !prescriptionId)
            return res.status(400).json({ status: false, error: "Bad Request!" })

        const userExist = await User.findOne({ _id: userId })
        if (!userExist) return res.json({ status: false, error: "User Invalid!" })

        const isPrescriptionExist = await Prescription.findOne({ _id: prescriptionId })
        if (!isPrescriptionExist) return res.json({ status: false, error: "No Prescription Found!" })

        // Increment Order Id Unique
        const incOrder = await UniqueId.findOneAndUpdate({}, { $inc: { orderId: 1, dailyOrderId: 1 } }, { new: true, upsert: true })
        var orderIdUnique = padLeadingZeros(incOrder.dailyOrderId);
        orderIdUnique = "EML" + moment().format("DDMMYY") + orderIdUnique;

        const order = new Order({
            orderId: orderIdUnique,
            checkoutDate: checkoutDate ? checkoutDate : moment(),
            deliveryStatus: 1, //Pending
            paymentMethod: "cash_on_delivery", //Cash on delivery by default
            paymentStatus: "unpaid", //default payment status
            user: userId,
            name: name,
            phoneNo: phoneNo,
            email: email ? email : userExist.email,
            district: district,
            area: area,
            shippingAddress: shippingAddress,
            orderNotes: orderNotes,
            orderType: "1", //for Prescription Order
            prescriptionId: prescriptionId,
            orderTimeline: orderTimeline,
            orderFrom: orderFrom
        });
        const orderSave = await order.save()

        // UPDATE USER CARTS & CHECKOUT
        await User.findOneAndUpdate(
            { _id: userId },
            {
                $push: { checkouts: orderSave._id },
                $set: { fullName: name, shippingAddress: shippingAddress, district: district, area: area, email: email }
            }
        )

        await Cart.deleteMany({ user: new ObjectId(userId) })
        let messageString = `New Order Placed!\nOrder Id: ${orderIdUnique}\nEmedilife Limited`
        PhoneNoList.forEach(phoneNo => {
            Controller.sendBulkSms(phoneNo, messageString)
        });
        return res.json({
            _id: orderSave._id,
            orderId: orderIdUnique,
            phoneNo: orderSave.phoneNo,
            status: true,
            message: "Prescription Reorder Placed successfully!",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message })
    }
};

exports.getOrderList = async (req, res) => {
    try {
        var { filter, pageSize = 10, page = 1 } = req.query
        const userId = req.userData.userId
        if (!userId) return res.status(400).json({ status: false, error: "Bad Request!" })
        var newFilter = {
            user: userId,
            deliveryStatus: { $ne: null },
            orderType: { $ne: null }
        }
        if (filter) {
            filter = JSON.parse(filter)
            newFilter = {
                user: userId,
                deliveryStatus: filter.deliveryStatus ? filter.deliveryStatus : { $ne: null },
                orderType: filter.orderType ? filter.orderType : { $ne: null }
            }
        }

        const { offset, limit } = getOffset(page, parseInt(pageSize));
        const data = await Order.find(newFilter).skip(offset).limit(limit).sort({ createdAt: 1 });
        const count = await Order.countDocuments(newFilter);
        return res.json({
            status: true,
            data: {
                orders: data,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Orders Get Successfully!"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.query.orderId
        const userId = req.userData.userId
        if (!userId || !orderId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const data = await Order.findOne({ userId: userId, orderId: orderId })
            .select("-updatedAt -sessionkey -orderPaymentInfo -__v")
            .populate({
                path: "orderedItems.product",
                model: "Product",
                select: "productName productSlug price category subCategory brand generic images",
                populate: [
                    {
                        path: "category",
                        model: "ProductCategory",
                        select: "categoryName",
                    },
                    {
                        path: "brand",
                        model: "ProductBrand",
                        select: "brandName",
                    },
                    {
                        path: "generic",
                        model: "Generic",
                        select: "name",
                    },
                ],
            })
            .populate({ path: "prescriptionId", select: 'images -_id' })
        return res.json({
            status: true,
            data: data,
            message: "Order Get Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}