const ProductAuthenticator = require('../models/product-authenticator');


exports.addSingleProductAuthenticator = async (req, res, next) => {

    try {

        const data = req.body;
        const dataExists = await ProductAuthenticator.findOne(
            {$or: [{imei: data.imei, sn: data.sn}]}
        ).lean();

        if (dataExists) {
            const error = new Error('A product authenticator with this imei or sn already exists');
            error.statusCode = 406;
            next(error)
        } else {
            const authenticator = new ProductAuthenticator(data);
            const authenticatorRes = await authenticator.save();
            res.status(200).json({
                response: authenticatorRes,
                message: 'Product Authenticator Added Successfully!'
            });
        }

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.insertManyProductAuthenticator = async (req, res, next) => {

    try {
        const data = req.body;
        // await ProductAuthenticator.deleteMany({});
        const result = await ProductAuthenticator.insertMany(data);

        res.status(200).json({
            message: `${result && result.length ? result.length : 0} ProductAuthenticator\'s imported Successfully!`
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllProductAuthenticator = async (req, res, next) => {
    try {

        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = ProductAuthenticator.find();

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const results = await query;
        const count = await ProductAuthenticator.countDocuments();

        res.status(200).json({
            data: results,
            count: count
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

exports.getProductAuthenticatorByProductAuthenticatorId = async (req, res, next) => {

    try {
        const authenticatorId = req.params.id;
        const productProductAuthenticator = await ProductAuthenticator.findOne({_id: authenticatorId});

        res.status(200).json({
            data: productProductAuthenticator
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.checkProductAuthenticate = async (req, res, next) => {

    try {
        const data = req.body.imeiOrSn;

        console.log(data)

        const productProductAuthenticator = await ProductAuthenticator.findOne(
            { $or: [ { imei: data }, { sn: data } ] }
        )

        console.log(productProductAuthenticator)

        res.status(200).json({
            success: productProductAuthenticator ? true : false
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.editProductAuthenticatorData = async (req, res, next) => {

    try {
        const updatedData = req.body;
        await ProductAuthenticator.updateOne({_id: updatedData._id}, {$set: updatedData})

        res.status(200).json({
            message: 'ProductAuthenticator Updated Successfully!'
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

exports.deleteProductAuthenticatorByProductAuthenticatorId = async (req, res, next) => {

    try {
        const authenticatorId = req.params.id;
        await ProductAuthenticator.deleteOne({_id: authenticatorId});

        res.status(200).json({
            message: 'ProductAuthenticator Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getProductAuthenticatorBySearch = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray1 = newQuery.map((str) => ({imei: RegExp(str, 'i')}));
        const queryArray2 = newQuery.map((str) => ({sn: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        let productProductAuthenticator = ProductAuthenticator.find({
            $or: [
                {$and: queryArray1},
                {$and: queryArray2},
            ]
        });

        if (pageSize && currentPage) {
            productProductAuthenticator.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productProductAuthenticator;
        const count = results.length;


        res.status(200).json({
            data: results,
            count: count
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
