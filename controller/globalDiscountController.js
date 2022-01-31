const GlobalDiscount = require("../models/globalDiscount")
const setGlobalDiscount = async (req, res) => {
    try {
        const { newUserDiscount, generalDiscount } = req.body;
        const globalDiscount = new GlobalDiscount({
            newUserDiscount: newUserDiscount,
            generalDiscount: generalDiscount
        })
        const data = await globalDiscount.save();
        return res.json({ status: true, message: "Global Discount Set Successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}

const editGlobalDiscount = async (req, res) => {
    try {
        const { newUserDiscount, generalDiscount } = req.body;
        await GlobalDiscount.findOneAndUpdate({}, {
            newUserDiscount: newUserDiscount,
            generalDiscount: generalDiscount
        })
        return res.json({ status: true, message: "Global Discount Update Successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}

const checkGlobalDiscountByUserId = async (req, res) =>{
    try {
        const {phoneNo} = req.body;
        if(!phoneNo) return res.status(400).json({status: false, message: "Missing Fields!"})
        const data = await GlobalDiscount.findOne();
        if(!data) return res.json({status: false, discount: 0, message: "No Discount Set Yet!"})
        const isExist = await User.findOne({phoneNo: phoneNo})
        if(!isExist || isExist.checkouts.length == 0){
            return res.json({status: true, discount: data.newUserDiscount})
        }
        return res.json({status: true, discount: data.generalDiscount})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = {
    setGlobalDiscount,
    editGlobalDiscount,
    checkGlobalDiscountByUserId
}