
// Require Post Schema from Model..
const Wishlist = require('../models/wishlist');
const User = require('../models/user');
const Product = require('../models/product');



 exports.addToWishlist = async (req, res, next) => {

    const userId = req.userData.userId;
    const data = req.body;
    const final = {...data, ...{user: userId}}

    try {
        const wishlist = new Wishlist(final);
        const saveData = await wishlist.save();

        await User.findOneAndUpdate({_id: userId}, {
            "$push": {
                wishlists: saveData._id
            }
        })

        res.status(200).json({
            message: 'Added to Wishlist Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
 }

exports.getWishlistItemByUser = async (req, res, next) => {


    try {
        const userId = req.userData.userId;

        const data = await User.findOne({_id: userId})
            .populate(
                {
                    path: 'wishlists _id',
                    populate: {
                        path: 'product',
                        select: 'productName productSlug categorySlug brandSlug price discountType discountAmount  quantity images'
                    }
                }).select('wishlists');

        let mData;
        if (data && data.wishlists) {
            mData = data.wishlists.map(m => {
                return {
                    _id: m._id,
                    product: m.product
                }
            })
        } else {
            mData = [];
        }

        res.status(200).json({
            data: mData,
            count: mData.length
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

exports.removeWishlistById = async (req, res, next) => {

    try {
        const userId = req.userData.userId;
        const wishlistId = req.params.id;

        await User.updateOne({_id: userId}, {$pull: {wishlists: wishlistId}});
        await Wishlist.deleteOne({_id: wishlistId});

        res.status(200).json({
            message: 'Item Removed From Wishlist!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getAllProductsFromWishlistByUserId = async (req, res, next) => {
    try {

        const userId = req.userData.userId;
        const wishlist = await Wishlist.find({user: userId});
        const ids = wishlist.map(function(wishlist) { return wishlist.product});
        const products = await Product.find({_id: {$in: ids}});


        res.status(200).json({

            data: products,
            message: "Wishlist Retrieved Successfully!"
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getStatusOfProductInWishlist = async (req, res, next) => {
    const userId = req.userData.userId;
    const productId = req.params.productId;

    try {

        const data = await Wishlist.findOne({user: userId, product: productId}).distinct('product')
        let message = "Item can be added to Wishlist";
        let exists = false;
        if (data.length === 1) {
            exists = true;
            message = "Item already exists in wishlist!";
        }
        res.status(200).json({
            // data: data.length,
            exists: exists,
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

exports.getWishlistCountFromDB = async (req, res, next) => {

    const userId = req.userData.userId;

    try {
        const count = await Wishlist.countDocuments({userId: userId});


        res.status(200).json({
            count: count,
            message: "Count Retrieved Successfully!"
        });

    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}
