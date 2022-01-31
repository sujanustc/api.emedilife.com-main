const Warranty = require('../models/warranty');
const utils = require('../helpers/utils')


exports.addSingleWarranty = async (req, res, next) => {

    try {

        const data = req.body;
        const dataExists = await Warranty.findOne({invoiceNumber: data.invoiceNumber}).lean();

        if (dataExists) {
            const error = new Error('A product warranty with this invoiceNumber already exists');
            error.statusCode = 406;
            next(error)
        } else {
            const warranty = new Warranty(data);
            const warrantyRes = await warranty.save();
            res.status(200).json({
                response: warrantyRes,
                message: 'Warranty Added Successfully!'
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

exports.insertManyWarranty = async (req, res, next) => {

    try {
        const data = req.body;
        // await Warranty.deleteMany({});
        const result = await Warranty.insertMany(data);

        res.status(200).json({
            message: `${result && result.length ? result.length : 0} Warranty\'s imported Successfully!`
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllWarranty = async (req, res, next) => {
    try {

        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = Warranty.find();

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const results = await query;
        const count = await Warranty.countDocuments();

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

exports.getWarrantyByWarrantyId = async (req, res, next) => {

    try {
        const warrantyId = req.params.warrantyId;
        const productWarranty = await Warranty.findOne({_id: warrantyId});

        res.status(200).json({
            data: productWarranty,
            message: 'Warranty Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.checkWarrantByCustomerPhoneNo = async (req, res, next) => {

    try {
        const customerPhoneNo = req.body.customerPhoneNo;

        const productWarranty = await Warranty.find({customerPhoneNo: customerPhoneNo})

        res.status(200).json({
            success: !!(productWarranty && productWarranty.length)
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getWarrantDataByCustomer = async (req, res, next) => {

    try {
        const customerPhoneNo = req.body.customerPhoneNo;
        const select = req.body.select;

        const productWarranty = await Warranty.find({customerPhoneNo: customerPhoneNo})
            .select(select ? select : '');

        res.status(200).json({
            data: productWarranty,
            success: !!(productWarranty && productWarranty.length)
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.trackWarrantDownloadHistory = async (req, res, next) => {

    try {
        const userId = req.userData.userId;
        const id = req.body._id;


        await Warranty.findOneAndUpdate(
            {_id: id},
            {$set: {user: userId, lastDownload: utils.getDateString(new Date())}, $inc: {totalDownload: 1}},
            {new: true, upsert: true}
        )

        res.status(200).json({
            success: true
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editWarrantyData = async (req, res, next) => {

    try {
        const updatedData = req.body;
        await Warranty.updateOne({_id: updatedData._id}, {$set: updatedData})

        res.status(200).json({
            message: 'Warranty Updated Successfully!'
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

exports.deleteWarrantyByWarrantyId = async (req, res, next) => {

    try {
        const warrantyId = req.params.warrantyId;
        await Warranty.deleteOne({_id: warrantyId});

        res.status(200).json({
            message: 'Warranty Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getWarrantyBySearch = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({invoiceNumber: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        let productWarranty = Warranty.find({
            $or: [
                {$and: queryArray}
            ]
        });

        if (pageSize && currentPage) {
            productWarranty.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productWarranty;
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
