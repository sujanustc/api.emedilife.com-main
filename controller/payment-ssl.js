const SslCommerzPayment = require("sslcommerz");

const Order = require('../models/order');
const OrderTemp = require('../models/order-temporary');
const OrderPaymentInfo = require('../models/order-payment-info');
const User = require('../models/user');
const Cart = require('../models/cart');
const mongoose = require('mongoose');
const Controller = require("../helpers/controller");

/**
 * Add To ORDER
 * GET ORDER LIST
 */

exports.init = async (req, res, next) => {

    const data = req.body;

    // console.log('here init');

    try {

        let credential = new SslCommerzPayment(
            process.env.STORE_ID,
            process.env.STORE_PASSWORD,
            false
        );

        data.store_id = process.env.STORE_ID;
        data.store_passwd = process.env.STORE_PASSWORD

        const response = credential.init(data);

        response.then(function (result) {
            // console.log(result)
            res.status(200).json({
                data: result,
                message: 'Data received successfully!'
            });
        })

    } catch (err) {
        // console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.validate = async (req, res, next) => {

    try {

        let test = new SslCommerzPayment(
            process.env.STORE_ID,
            process.env.STORE_PASSWORD
        );

        const data = req.body.data;
        // console.log(req.body);

        const response = test.validate(data);

        // console.log('here validate');

        response.then(function (result) {
            // console.log(result)
            res.status(200).json({
                data: result,
                message: 'Data received successfully!'
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

exports.transactionQueryBySessionId = async (req, res, next) => {

    try {

        let test = new SslCommerzPayment(
            process.env.STORE_ID,
            process.env.STORE_PASSWORD
        );

        const data = req.body.data;
        // console.log(req.body);

        const response = test.transactionQueryBySessionId(data);

        // console.log('here transactionQueryBySessionId');

        response.then(function (result) {
            // console.log(result)
            res.status(200).json({
                data: result,
                message: 'Data received successfully!'
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

exports.transactionQueryByTransactionId = async (req, res, next) => {

    try {

        let test = new SslCommerzPayment(
            process.env.STORE_ID,
            process.env.STORE_PASSWORD
        );

        const data = req.body.data;
        // console.log(req.body);

        const response = test.transactionQueryByTransactionId(data);

        // console.log('here transactionQueryByTransactionId');

        response.then(function (result) {
            // console.log(result)
            res.status(200).json({
                data: result,
                message: 'Data received successfully!'
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

// FROM SSL

exports.ipn = async (req, res, next) => {

    try {

        let message = '';
        const data = await req.body;
        console.log(data);

        const status = data.status;
        const tranId = data.tran_id;
        const total_amount = data.amount;

        let tempOrder = await OrderTemp.findOne({orderId: tranId});
        const tempOrderData = tempOrder._doc;

        if (status === 'VALID') {

            const finalOrderData = {...tempOrderData, ...{paymentMethod: data.card_type, paymentStatus: 'paid'}}
            delete finalOrderData._id;
            // delete finalOrderData.smsTemp;


            const orderPaymentInfo = new OrderPaymentInfo(data);
            const saveOrderPayInfo = await orderPaymentInfo.save();

            const order = new Order(finalOrderData);
            const orderSave = await order.save();

            // console.log(smsData);

            await Order.findOneAndUpdate(
                {_id: orderSave._id},
                {$set: {orderPaymentInfo: saveOrderPayInfo._id}}
            )

            await OrderTemp.deleteOne({orderId: tranId});

            // UPDATE USER CARTS & CHECKOUT
            await User.findOneAndUpdate(
                {_id: finalOrderData.user},
                {$set: {carts: [], checkouts: orderSave._id}}
            )

            await Cart.deleteMany(
                {user: mongoose.Types.ObjectId(finalOrderData.user)}
            )

            message = 'Payment Completed Successfully!'

            Controller.sendBulkSms(
                tempOrderData.phoneNo,
                `Dear ${tempOrderData.name}, Your order ${tranId} has been placed. We will update you once the order is confirmed. Thank you for shopping at www.emedilife.com.bd`
            )



        } else {
            console.log('Iam on Failed>>>>>>>>>>>')
            await OrderTemp.deleteOne({_id: tranId});

            message = 'Payment Was Not Completed Successfully!'

            Controller.sendBulkSms(
                tempOrderData.phoneNo,
                `Dear ${tempOrderData.name}, Your payment BDT ${total_amount} for the order ${tranId} is failed. Please attempt again to confirm your order.`
            )


        }

        res.status(200).json({
            message: message
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
