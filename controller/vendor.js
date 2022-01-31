// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const Vendor = require('../models/vendor');


/**
 * Vendor Registration
 * Vendor Login
 */

exports.vendorRegistration = async (req, res, next) => {
    // const errors = validationResult(req);
    // // Check Input validation Error with Error Handler..
    // if (!errors.isEmpty()) {
    //     const error = new Error('Input Validation Error! Please complete required information.');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     next(error)
    //     return;
    // }

    // Main..
    const bodyData = req.body;
    const password = bodyData.password;
    const hashedPass = bcrypt.hashSync(password, 8);

    // delete bodyData.password;
    const registrationData = {...bodyData, ...{password: hashedPass}}
    const vendor = new Vendor(registrationData);

    Vendor.findOne({
        phoneNo: bodyData.phoneNo
    })
        .then(vendorExists => {
            if (vendorExists) {
                const error = new Error('A vendor with this phone no already registered!');
                error.statusCode = 401;
                throw error;
            } else {
                return vendor.save();
            }
        })
        .then(newVendor => {
            res.status(200).json({
                message: 'Vendor Registration Success!',
                vendorId: newVendor._id
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.vendorLogin = (req, res, next) => {
    const phoneNo = req.body.phoneNo;
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body)
    let filter;
    let loadedVendor;
    let token;

    if (phoneNo === null) {
        filter = {email: email}
    } else {
        filter = {phoneNo: phoneNo}
    }

    // // For Find Account for login..
    Vendor.findOne(filter)
        .then(vendor => {
            if (!vendor) {
                const error = new Error('A Vendor with this phone or email no could not be found!');
                error.statusCode = 401;
                next(error)
                return;
            }
            loadedVendor = vendor;
            // authorizedRole = vendor.selectRole;
            return bcrypt.compareSync(password, vendor.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('You entered a wrong password!');
                error.statusCode = 401;
                next(error)
                return;
            }
            // For Json Token Generate..
            token = jwt.sign({
                    phoneNo: loadedVendor.phoneNo,
                    email: loadedVendor.email,
                    vendorId: loadedVendor._id
                },
                process.env.JWT_PRIVATE_KEY, {
                    expiresIn: '24h'
                }
            );

            res.status(200).json({
                token: token,
                expiredIn: 86400
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}

exports.getLoginVendorInfo = async (req, res, next) => {
    try {
        const loginVendorId = req.vendorData.vendorId;
        const selectString = req.query.select;

        let vendor;

        if (selectString) {
            vendor = Vendor.findById(loginVendorId).select(selectString)
        } else {
            vendor = Vendor.findById(loginVendorId).select('-password')
        }
        const data = await vendor;

        res.status(200).json({
            data: data,
            message: 'Successfully Get vendor info.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getVendorLists = async (req, res, next) => {
    try {
        const vendors = await Vendor.find().select('-password -carts -checkouts')

        res.status(200).json({
            data: vendors,
            message: 'Successfully all vendor list.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
