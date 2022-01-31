const AppVersion = require('../models/appVersion')
const moment = require('moment')
exports.addAppVersion = async (req, res) => {
    const { name, type, versionCode, versionName, updateDate, description, mandatory } = req.body;
    if (!name || !type || !versionCode || !versionName || !updateDate) return res.json({ status: false, message: "missing Fields" });

    const appVersion = new AppVersion({
        name: name,
        type: type,
        versionCode: versionCode,
        versionName: versionName,
        mandatory: mandatory ? mandatory : false,
        updateDate: updateDate,
        description: description
    })
    const data = await appVersion.save().catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });

    if (data) return res.json({ status: true, message: "App Version Added Successfully!", data });
    return res.json({ status: false, message: "Something Wrong!" })
}

exports.editAppVersion = async (req, res) => {
    const { _id, name, type, versionCode, versionName, updateDate, description, mandatory } = req.body;
    if (!_id || !name || !type || !versionCode || !versionName) return res.json({ status: false, message: "missing Fields" });
    const appVersionExist = await AppVersion.findOne({ _id: _id }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    if (!appVersionExist) return res.json({ status: false, message: "App Version do not Find" })
    const data = await AppVersion.findOneAndUpdate({ _id: _id }, {
        name: name,
        type: type,
        versionCode: versionCode,
        versionName: versionName,
        mandatory: mandatory ? mandatory : false,
        updateDate: moment(),
        description: description
    }, { new: true }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });

    if (data) return res.json({ status: true, message: "App Version Edited Successfully!", data });
    return res.json({ status: false, message: "Something Wrong!" })
}

exports.getAllAppVersion = async (req, res) => {
    const data = await AppVersion.find().catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    if (data) return res.json({ status: true, message: "App Versions Get Successfully!", data });
    return res.json({ status: false, message: "Something Wrong!" })

}

exports.getVersionDetailsById = async (req, res) => {
    const { _id } = req.body;
    if (!_id) return res.json({ status: false, message: "missingFields" });

    const data = await AppVersion.findOne({ _id: _id }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });

    if (data) return res.json({ status: true, message: "App Version Get Successfully!", data });
    return res.json({ status: false, message: "Something Wrong!" })
}

exports.checkingCurrectAppVersion = async (req, res) => {
    var { currentVersionCode, type } = req.body;
    currentVersionCode? null : currentVersionCode = req.query.currentVersionCode;
    type? null : type = req.query.type;
    if (!currentVersionCode || !type) return res.json({ status: false, message: "missing Fields" });

    const appVersion = await AppVersion.findOne({ type: type }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    console.log(appVersion);
    if (appVersion) {
        if (currentVersionCode < appVersion.versionCode) return res.json({ status: true, updateAvailable: true, data: appVersion })
        else return res.json({ status: true, updateAvailable: false })
    }
    else {
        return res.status(400).json({status: false, error: "Bad Request"});
    }
}