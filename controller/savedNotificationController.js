const { writeAsync } = require('jimp')
const SavedNotification = require('../models/savedNotification')
const { response, errorResponse, getOffset } = require('../utils/utils')
exports.addSavedNotification = async (req, res) => {
    const { title, body } = req.body
    if (!title || !body) return res.json({ status: false, message: "Missing Fields" })

    const isExist = await SavedNotification.findOne({ title: title, body: body }).catch((error) => {
        console.log(error);
        res.json({ status: false, error: error.message })
    })
    if (isExist) return res.json({ status: false, message: "A notification with same title and body already exist" });

    const savedNotification = new SavedNotification({ title: title, body: body });
    const data = await savedNotification.save().catch((error) => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });
    //Checking and responsing
    if (data) return response(res, { message: "Notification Saved Successfully!" }, data);
    return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
}

exports.editSavedNotificaton = async (req, res) => {
    const { _id, title, body } = req.body
    if (!_id || !title || !body) return response(res, { message: "Missing Fields" })

    const isExist = await SavedNotification.findOne({ _id: _id }).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    })
    if (!isExist) return response(res, { message: "No Saved Notification Found with this _id" })

    const isExist2 = await SavedNotification.findOne({ title: title, body: body }).catch((error) => {
        console.log(error);
        res.json({ status: false, error: error.message })
    })
    if (isExist2) return res.json({ status: false, message: "A notification with same title and body already exist" });

    const data = await SavedNotification.updateOne({ _id: _id }, { title: title, body: body }).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    })
    //Checking and responsing
    if (data) return response(res, { message: "Notification Edited Successfully!" }, data);
    return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
}

exports.deleteSavedNotificationById = async (req, res) => {
    const { _id } = req.body;
    if (!_id) return response(res, { message: "Missing Fields" })

    const isExist = await SavedNotification.findOne({ _id: _id }).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    })
    if (!isExist) return response(res, { message: "No Saved Notification Found with this _id" })

    const data = await SavedNotification.deleteOne({ _id: _id }).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    })

    if (data) return response(res, { message: "Notification deleted Successfully!" }, data);
    return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
}

exports.getSavedNotificationById = async (req, res) => {
    const { _id } = req.body;
    if (!_id) return response(res, { message: "Missing Fields" })

    const data = await SavedNotification.findOne({ _id: _id }).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    })

    if (data) return response(res, { message: "Notification find Successfully!" }, data);
    return errorResponse(res, "Something wrong . Please try agian later or contact to support!");

}

exports.getAllNotificaitonByPagination = async (req, res) => {
    var pLimit = parseInt(req.query.pageSize);
    var page = req.query.page;
    let { offset, limit } = getOffset(page, pLimit);
    var results = await SavedNotification.find().skip(offset).limit(limit).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });
    const count = await SavedNotification.countDocuments().catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });

    res.status(200).json({
        results,
        count: count,
        message: 'All Saved Notification fetch Successfully!'
    });
}

exports.getAllNotificaiton = async (req, res) => {
    var results = await SavedNotification.find().catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });
    const count = await SavedNotification.countDocuments().catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });

    res.status(200).json({
        results,
        count: count,
        message: 'All Saved Notification fetch Successfully!'
    });
}

