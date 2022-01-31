const { validationResult } = require('express-validator');

// Require Post Schema from Model..
const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product')

exports.addToCart = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const userId = req.userData.userId;
        const data = req.body;

        const productId = data.product;
        const findProduct = await Product.findOne({ _id: productId })
        // console.log(findProduct)
        if (!findProduct) return res.status(200).json({ success: false, message: "Product Not Found" })

        if (findProduct.stockVisibility) {

            // console.log("data: ", data, "final:   ", final);
            const isExist = await Cart.findOne({ user: userId, product: data.product, priceId: data.priceId })
            if (isExist) {
                await Cart.updateOne(
                    { _id: isExist._id },
                    { selectedQty: data.selectedQty }
                )
            } else {
                const final = { ...data, ...{ user: userId } }
                const cart = new Cart(final);
                const cartRes = await cart.save();
                await User.findOneAndUpdate({ _id: userId }, {
                    "$push": {
                        carts: cartRes._id
                    }
                })
            }

            // const s = await User.findOne({ _id: userId });
            // console.log(s)
            res.status(200).json({
                success: true,
                message: 'Added to Cart Successfully!'
            });

        } else {

            res.status(200).json({
                success: false,
                message: "Out of Stock"
            })


        }

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCartItemByUserId = async (req, res, next) => {

    const userId = req.userData.userId;

    try {

        const data = await User.findOne({ _id: userId })
            .populate(
                {
                    path: 'carts _id',
                    populate: {
                        path: 'product',
                        select: 'productName productSlug price prices images brand generic',
                        populate: [
                            {
                                path: 'prices.unit',
                                model: 'UnitType'
                            },
                            {
                                path: 'brand',
                                model: 'ProductBrand',
                                select: 'brandName brandSlug',
                            },
                            {
                                path: 'generic',
                                model: 'Generic',
                                select: 'name slug'
                            }
                        ]
                    }
                })
            .select('carts')

        res.status(200).json({
            data: data && data.carts ? data.carts : [],
            message: 'All Products Fetched Successfully!'
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

exports.incrementCartQty = async (req, res, next) => {

    const cartId = req.body.cartId;

    try {
        await Cart.findOneAndUpdate(
            { _id: cartId },
            { $inc: { 'selectedQty': 1 } },
            { new: true }
        )
        res.status(200).json({
            message: 'Update cart quantity Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.decrementCartQty = async (req, res, next) => {

    const cartId = req.body.cartId;

    try {
        await Cart.findOneAndUpdate(
            { _id: cartId },
            { $inc: { 'selectedQty': -1 } },
            { new: true }
        )
        res.status(200).json({
            message: 'Update cart quantity Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteCartItem = async (req, res, next) => {

    const cartId = req.params.cartId;
    const userId = req.userData.userId;

    try {
        const query = { _id: cartId }
        await Cart.deleteOne(query)

        await User.updateOne(
            { _id: userId },
            {
                $pull: { carts: { "$in": cartId } }
            }
        )

        res.status(200).json({
            message: 'Item Removed Successfully From Cart!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getCartItemCount = async (req, res, next) => {

    const userId = req.userData.userId;

    try {

        const cartsId = await User.findOne({ _id: userId }).distinct('carts')

        res.status(200).json({
            data: cartsId.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleCartProduct = async (req, res, next) => {
    const userId = req.userData.userId;
    const productId = req.params.productId;

    try {

        const data = await Cart.findOne({ user: userId, product: productId }).select('selectedQty')

        res.status(200).json({
            data: data
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getCartItemsByUser = async (req, res, next) => {
    try {
        // const userId = "61b1ed84d672077da50472ae"
        const userId = req.userData.userId;
        if(!userId) return res.status(400).json({status: false, error: "Bad Request!"})
        const userExist = await User.findOne({_id: userId})
        if(!userExist) return res.json({status: false, error: "No User Found!"})

        var data = await Cart.find({ user: userId }).populate({
            path: "product",
            select: "productname productSlug prices images brand generic",
            populate: [
                {
                    path: 'prices.unit',
                    model: 'UnitType'
                },
                {
                    path: 'brand',
                    model: 'ProductBrand',
                    select: 'brandName brandSlug',
                },
                {
                    path: 'generic',
                    model: 'Generic',
                    select: 'name slug'
                }
            ]
        })
        var newData = []
        for (let index = 0; index < data.length; index++) {
            var priceObj = data[index].product.prices.find(o => o._id.toHexString() == data[index].priceId)
            newData.push({ ...data[index]._doc, price: priceObj})
        }
        return res.json({
            status: true,
            data: {
                cartItems: newData,
            },
            message: 'All Products Fetched Successfully!'
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: err.message })
    }
}