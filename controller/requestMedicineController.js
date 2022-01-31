const RequestMedicine = require("../models/requestMedicine")
const Prescription = require("../models/prescription")
const { getOffset } = require("../utils/utils")
const sendRequestForMedicine = async (req, res) => {
    try {
        const data = req.body
        if (!data.name || !data.phone || !data.district || !data.area || !data.fullAddress)
            return res.status(400).json({ status: false, error: "Bad Request!" })
        if ((!data.images || data.images.length == 0 || data.images == []) && (!data.requestedItems || data.requestedItems.length == 0 || data.requestedItems == []))
            return res.status(400).json({ status: false, error: "Bad Request!" })
        var prescriptionId = null
        if (data.images.length) {
            const count = await Prescription.countDocuments();
            const prescription = new Prescription({
                title: "Prescription" + count,
                images: data.images
            })
            const savedPrescription = await prescription.save()
            prescriptionId = savedPrescription._id
        }
        const requestMedicine = new RequestMedicine({
            name: data.name,
            phone: data.phone,
            email: data.email,
            district: data.district,
            area: data.area,
            fullAddress: data.fullAddress,
            userNote: data.userNote,
            requestedItems: data.requestedItems,
            prescriptionId: prescriptionId
        })
        const savedRequestMedicine = await requestMedicine.save()
        return res.json({
            status: true,
            message: "Medicine Request Sent Successfully!",
            data: savedRequestMedicine
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const getAllMedicineRequest = async (req, res) => {
    try {
        const { filter, pageSize, page } = req.query
        var pLimit = parseInt(pageSize);
        let { offset, limit } = getOffset(page, pLimit);
        var data, count
        if (filter) {
            data = await RequestMedicine.find(JSON.parse(filter)).skip(offset).limit(limit).sort({ createdAt: -1 });
            count = await RequestMedicine.countDocuments(JSON.parse(filter))
        } else {
            data = await RequestMedicine.find().skip(offset).limit(limit).sort({ createdAt: -1 });
            count = await RequestMedicine.countDocuments()
        }
        return res.json({
            status: true,
            message: "Request Medicine Get Successfully!",
            data: data,
            count: count
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const getSingleMedicineRequest = async (req, res) => {
    try {
        const { _id } = req.query
        if (!_id) return res.status(400).json({ status: false, error: "Bad Request!" })
        const data = await RequestMedicine.findOne({ _id: _id }).populate(["prescriptionId", "district", "area"])
        return res.json({
            status: true,
            message: "Request Medicine Get Successfully!",
            data: data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const changeRequestMedicineStatusById = async (req, res) => {
    try {
        const { _id, status } = req.body
        if (!_id || !status) return res.status(400).json({ status: false, error: "Bad Request!" })
        await RequestMedicine.findByIdAndUpdate(_id, { status: status })
        return res.json({
            status: true,
            message: "Updated Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const addAdminNoteForRequestMedicine = async (req, res) => {
    try {
        const { _id, adminNote } = req.body
        if (!_id || !adminNote) return res.status(400).json({ status: false, error: "Bad Request!" })
        await RequestMedicine.findByIdAndUpdate(_id, { adminNote: adminNote })

        return res.json({
            status: true,
            message: "Note Added Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = {
    sendRequestForMedicine,
    getAllMedicineRequest,
    getSingleMedicineRequest,
    changeRequestMedicineStatusById,
    addAdminNoteForRequestMedicine
}