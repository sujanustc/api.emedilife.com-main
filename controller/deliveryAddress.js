const DeliveryAddress = require('../models/deliveryAddress')
const User = require('../models/user')
const moment = require('moment')

const addDeliveryAddress = async (req, res) => {
    try {
        var { name, phoneNo, email, type, districtId, areaId, address, isDefault, othersTitle } = req.body
        const userId = req.userData.userId

        if (!userId || !name || !phoneNo || !type || !districtId || !areaId || !address) return res.status(400).json({ status: false, error: "Bad Request!" })
        if (type != "HOME" && type != "OFFICE" && type != "OTHERS") return res.status(400).json({ status: false, error: "Bad Request!" })

        const isUserExist = await User.findOne({ _id: userId })
        if (!isUserExist) return res.json({ status: false, error: "No User Found!" })

        isUserExist.addresses.length == 0 ? isDefault = true : null
        if (isDefault) {
            if (!isUserExist.fullName) await User.updateOne({ _id: userId }, { fullName: name })
            if (!isUserExist.email && email) await User.updateOne({ _id: userId }, { email: email })
            await DeliveryAddress.updateMany({ userId: userId }, { isDefault: false })
        }

        const deliveryAddress = new DeliveryAddress({
            userId: userId,
            type: type,
            othersTitle: type == "OTHERS" ? (othersTitle ? othersTitle : "Others") : null,
            name: name,
            phoneNo: phoneNo,
            email: email,
            districtId: districtId,
            areaId: areaId,
            address: address,
            isDefault: isDefault
        })

        const data = await deliveryAddress.save()
        await User.updateOne({ _id: userId }, { "$push": { addresses: data._id } })

        return res.json({
            status: true,
            data: data,
            message: "Delivery Address Added Successfully!"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const getAllDeliveryAddressByUser = async (req, res) => {
    try {
        const userId = req.userData.userId
        if (!userId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const data = await DeliveryAddress.find({ userId: userId, deletedAt: null }).populate([
            {
                path: "districtId",
                select: "district"
            },
            {
                path: "areaId",
                select: "area"
            }
        ])

        return res.json({
            status: true,
            data: data,
            message: "All Delivery Address Get Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const getDeliveryAddressById = async (req, res) => {
    try {
        const userId = req.userData.userId
        const { deliveryAddressId } = req.query
        if (!userId || !deliveryAddressId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const data = await DeliveryAddress.findOne({ userId: userId, deletedAt: null, _id: deliveryAddressId }).populate([
            {
                path: "districtId",
                select: "district"
            },
            {
                path: "areaId",
                select: "area"
            }
        ])

        return res.json({
            status: true,
            data: data,
            message: "Delivery Address Get Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const editDeliveryAddressById = async (req, res) => {
    try {
        const { deliveryAddressId, name, phoneNo, email, type, districtId, areaId, address, isDefault, othersTitle } = req.body
        const userId = req.userData.userId
        if (!deliveryAddressId || !userId || !name || !phoneNo || !type || !districtId || !areaId || !address) return res.status(400).json({ status: false, error: "Bad Request!" })
        if (type != "HOME" && type != "OFFICE" && type != "OTHERS") return res.status(400).json({ status: false, error: "Bad Request!" })

        const isUserExist = await User.findOne({ _id: userId })
        if (!isUserExist) return res.json({ status: false, error: "No User Found!" })

        if (isDefault) await DeliveryAddress.updateMany({ userId: userId }, { isDefault: false })

        const data = await DeliveryAddress.findByIdAndUpdate({ _id: deliveryAddressId, deletedAt: null, userId: userId }, {
            type: type,
            othersTitle: type == "OTHERS" ? (othersTitle ? othersTitle : "Others") : null,
            name: name,
            phoneNo: phoneNo,
            email: email,
            districtId: districtId,
            areaId: areaId,
            address: address,
            isDefault: isDefault
        }, { new: true })

        return res.json({
            status: true,
            data: data,
            message: "Delivery Address Edited Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const setAsDefaultDeliveryAddress = async (req, res) => {
    try {
        const { deliveryAddressId } = req.body
        const userId = req.userData.userId
        if (!deliveryAddressId || !userId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const isExist = await DeliveryAddress.findOne({ _id: deliveryAddressId, deletedAt: null, userId: userId })
        if (!isExist) return res.json({ status: false, error: "No Delivery Address Exist!" })

        await DeliveryAddress.updateMany({ userId: userId }, { isDefault: false })
        await DeliveryAddress.updateOne({ _id: deliveryAddressId }, { isDefault: true })

        return res.json({
            status: true,
            message: "Set Default Address Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const deleteDeliveryAddressById = async (req, res) => {
    try {
        const userId = req.userData.userId
        const { deliveryAddressId } = req.body
        if (!deliveryAddressId || !userId) return res.status(400).json({ status: false, error: "Bad Request!" })

        const isExist = await DeliveryAddress.findOne({ _id: deliveryAddressId, deletedAt: null, userId: userId })
        if (!isExist) return res.json({ status: false, error: "No Delivery Address Exist!" })

        if (isExist.isDefault) return res.json({ status: false, error: "Default Address Can Not Be Deleted! Change It First!" })

        await DeliveryAddress.updateOne({ _id: deliveryAddressId }, { deletedAt: moment() })

        return res.json({
            status: true,
            message: "Address Deleted Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = {
    addDeliveryAddress,
    getAllDeliveryAddressByUser,
    getDeliveryAddressById,
    editDeliveryAddressById,
    setAsDefaultDeliveryAddress,
    deleteDeliveryAddressById
}