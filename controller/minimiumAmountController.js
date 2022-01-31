const MinimumAmount = require("../models/minimumAmount")
exports.addMinimumAmount = async (req, res) => {
    const { amount, status, title } = req.body;
    if (!amount || !title) return res.json({ status: false, message: "Missing Fields" });

    const minimumAmount = new MinimumAmount({ title: title, amount: amount, status: status })
    const data = await minimumAmount.save().catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    })

    if (data) return res.json({ status: true, message: "Minimum Amount Set Successfully" , data})
    else return res.json({ status: false, message: "something wrong. try again letter or contact to support" })
}

exports.editMinimumAmountById = async (req, res) => {
    const { _id, amount, status, title } = req.body
    if (!_id || !title || !amount) {return res.json({ status: false, message: "Missing fields" })}

    const isExist = await MinimumAmount.findOne({ _id: _id }).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });
    if (!isExist) return res.json({ status: false, message: "No Minimum amount find with this id" })

    const data = await MinimumAmount.updateOne({ _id: _id }, { title: title, amount: amount, status: status }).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });

    if (data) return res.json({ status: true, message: "Update Successfull", data })
    else return res.json({ status: false, message: "something wrong. try again letter or contact to support" })
}

exports.deleteMinimumAmountById = async (req, res) => {
    const { _id } = req.body;

    if (!_id) return res.json({ status: false, message: "Missing fields" })

    const isExist = await MinimumAmount.findOne({ _id: _id }).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });
    if (!isExist) return res.json({ status: false, message: "No Minimum amount find with this id" })

    const data = await MinimumAmount.deleteOne({ _id: _id }).catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });

    if (data) return res.json({ status: true, message: "Delete Successfull", data })
    else return res.json({ status: false, message: "something wrong. try again letter or contact to support" })
}

exports.getAllMinimumAmount = async (req, res) => {
    const data = await MinimumAmount.find().catch(error => {
        console.log(error);
        res.json({ status: false, error: error.message })
    });

    if (data) return res.json({ status: true, message: "All Minimum Amount List Get Successfully Successfull" , data})
    else return res.json({ status: false, message: "something wrong. try again letter or contact to support" })
}