const Notification = require("../models/notification");
const { errorResponse, response, getOffset } = require("../utils/utils");

//Admin Functions
exports.addNotification = async (req, res) => {
    try {
        const { title, body, url, status, platformType, roleType, sendingType, receivers } = req.body;

        //validations
        if (!title || !body || !platformType || !roleType || !sendingType) return response(res, { message: "Missing Fields", status: false, statusCode: 400 });

        //Inserting Data
        const notification = new Notification({
            title: title,
            body: body,
            url: url,
            status: status,
            platformType: platformType,
            roleType: roleType,
            sendingType: sendingType,
            receivers: receivers
        });
        const data = await notification.save();

        //Checking and responsing
        if (data) return response(res, { message: "Notification Created Successfully!" }, data);
        return errorResponseonse(res, "Something wrong . Please try agian later or contact to support!");
    }
    catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
}

exports.adminDeleteNotificationById = async (req, res) => {
    try {
        const { _id } = req.body;

        //validations
        if (!_id) return response(res, { message: "Missing Fields", status: false, statusCode: 400 });
        if (_id.length != 24) return response(res, { message: "Id is not Valid", status: false, statusCode: 400 })

        //Finding Data
        const isExist = await Notification.findOne({ _id: _id });
        if (!isExist) return response(res, { message: "No Notification find with this _id", status: false, statusCode: 400 });

        //Deleting Data
        const data = await Notification.deleteOne({ _id: _id })

        //Checking and responsing
        if (data) return response(res, { message: "Notification Deleted Successfully!" }, data);
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    }
    catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
}

exports.adminEditNotificationById = async (req, res) => {
    try {
        const { _id, title, body, url, status, platformType, roleType, sendingType, receivers } = req.body;

        console.log(req.body);
        //validations
        if (!_id || !title || !body || !platformType || !roleType || !sendingType) return response(res, { message: "Missing Fields", status: false, statusCode: 400 });

        //Updating Data
        const data = await Notification.updateOne({ _id: _id }, {
            title: title,
            body: body,
            url: url,
            status: status,
            platformType: platformType,
            roleType: roleType,
            sendingType: sendingType,
            receivers: receivers
        })

        //Checking and responsing
        if (data) return response(res, { message: "Notification Updated Successfully!" }, data);
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    }
    catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
}

exports.adminGetAllNotification = async (req, res) => {
    try {
        var pLimit = parseInt(req.query.pageSize);
        var page = req.query.page;
        let { offset, limit } = getOffset(page, pLimit);
        var data = await Notification.find().skip(offset).limit(limit).sort({ createdAt: -1 });
        const count = await Notification.countDocuments();

        //Checking and responsing
        if (data) return res.status(200).json({ data, count: count, message: 'All Notification fetch Successfully!' });
        else return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    }
    catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
}

exports.adminGetNotificationById = async (req, res) => {
    try {
        const notificationId = req.query.notificationId

        if (!notificationId) return res.json({ status: false, message: "Missing Fields" });

        const isExist = await Notification.findOne({ _id: notificationId })
        if (!isExist) return res.json({ status: false, message: "Notification not find with this Id" })

        const data = await Notification.findOne({ _id: notificationId })

        //Checking and responsing
        if (data) return res.status(200).json({ data, message: 'All Notification fetch Successfully!' });
        else return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    }
    catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
}

//User Functions
exports.userDeleteNotificationById = async (req, res) => {
    try {
        const notificationId = req.query.notificationId;
        if (!notificationId) return res.json({ status: false, message: "Missing Fields" })

        res.json({ status: true, message: "comming soon" })
    }
    catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
}

exports.userDeleteAllNotification = async (req, res) => {
    try {
        const userId = req.query.userId
        const data = await Notification.deleteMany({/* filter here */ });

        //Checking and responsing
        if (data) return response(res, { message: "Notification deleted Successfully!" }, data);
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    }
    catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
}

exports.userGetAllNotificationByUserId = async (req, res) => {
    try {
        const userId = req.query.userId
        var pLimit = parseInt(req.query.pageSize);
        var page = req.query.page;
        let { offset, limit } = getOffset(page, pLimit);
        var data = await Notification.find().skip(offset).limit(limit).sort({ createdAt: -1 });
        const count = await Notification.countDocuments();

        //Checking and responsing
        if (data) return res.status(200).json({ data, count: count, message: 'All Notification fetch Successfully!' });
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    }
    catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
}

exports.userGetNotificationById = async (req, res) => {
    try {
        const notificationId = req.query.notificationId
        const count = await Notification.countDocuments();

        //Checking and responsing
        if (data) return res.status(200).json({ data, message: 'Comming soon' });
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    }
    catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
}

