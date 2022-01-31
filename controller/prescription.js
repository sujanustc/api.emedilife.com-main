const Prescription = require("../models/prescription")
const User = require("../models/user");
const { getOffset, getMetaData } = require("../utils/utils");
const moment = require('moment')
exports.getAllPrescriptionByUser = async (req, res) => {
    try {
        var { pageSize, currentPage: page } = req.query;
        const userId = req.userData.userId
        if (!userId) return res.json({ status: false, message: "Missing Fields" })
        const userExist = await User.findOne({ _id: userId })
        if (!userExist) return res.json({ status: false, message: "User not Found" })

        var pLimit = parseInt(pageSize);
        let { offset, limit } = getOffset(page, pLimit);
        var data = await Prescription.find({ userId: userId, deletedAt: null }).skip(offset).limit(limit).sort({ createdAt: -1 })
        const count = await Prescription.countDocuments({ userId: userId, deletedAt: null })

        return res.status(200).json({
            status: true,
            data: data,
            count: count,
            message: 'All Prescription fetch Successfully!'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.renamePrescriptionByIdByUser = async (req, res) => {
    try {
        var { title, prescriptionId } = req.body;
        const userId = req.userData.userId
        if (!prescriptionId || !title || !userId) return res.json({ status: false, message: "Missing Fields" })
        const prescriptionExist = await Prescription.findOne({ _id: prescriptionId, deletedAt: null })
        if (!prescriptionExist) return res.json({ status: false, message: "Prescription Not Found" })

        const data = await Prescription.updateOne({ _id: prescriptionId, deletedAt: null }, { title: title })
        return res.status(200).json({
            status: true,
            data: data,
            message: 'Prescription Renamed Successfully!'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }

}

exports.getSinglePrescriptionByIdByUser = async (req, res) => {
    try {
        var { prescriptionId } = req.query;
        const userId = req.userData.userId
        if (!userId || !prescriptionId) return res.json({ status: false, error: "Missing Fields" })
        const prescriptionExist = await Prescription.findOne({ _id: prescriptionId, deletedAt: null })
        if (!prescriptionExist) return res.json({ status: false, error: "Prescription Not Found" })
        return res.status(200).json({
            status: true,
            data: prescriptionExist,
            message: 'Prescription find Successfully!'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.softDeletePrescriptonByUser = async (req, res) => {
    try {
        const { prescriptionId } = req.body;
        if (!prescriptionId) return res.status(400).json({ status: false, error: "Missing Fields" })
        const prescriptionExist = await Prescription.findOne({ _id: prescriptionId })
        if (!prescriptionExist) return res.json({ status: false, error: "Prescription Not Found" })
        await Prescription.updateOne({ _id: prescriptionId }, { deletedAt: moment() })

        return res.status(200).json({
            status: true,
            message: 'Prescription deleted Successfully!'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.uploadPrescription = async (req, res) => {
    try {
        var { title, images } = req.body
        const userId = req.userData.userId
        if (!images) return res.status(400).json({ status: false, error: "Bad Request!" })

        if (!title) {
            var prescriptionCount = await Prescription.countDocuments({ userId: userId })
            prescriptionCount += 1;
            title = "Prescription" + prescriptionCount;
        }

        const prescription = new Prescription({ userId: userId, title: title, images: images })
        await prescription.save()

        return res.json({ status: true, data: prescription, message: "Prescription Uploaded Successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.getAllPrescriptionForApp = async (req, res) => {
    try {
        const { pageSize = 6, page = 1 } = req.query;
        const userId = req.userData.userId
        if (!userId) return res.json({ status: false, message: "Missing Fields" })
        const userExist = await User.findOne({ _id: userId })
        if (!userExist) return res.json({ status: false, message: "User not Found" })

        const { offset, limit } = getOffset(page, parseInt(pageSize));

        var data = await Prescription.find({ userId: userId, deletedAt: null }).skip(offset).limit(limit).sort({ createdAt: -1 })
        const count = await Prescription.countDocuments({ userId: userId, deletedAt: null })

        return res.json({
            status: true,
            data: {
                prescriptions: data,
                metaData: await getMetaData(page, count, offset, limit)
            },
            message: "Get Prescriptions Successfully!"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}