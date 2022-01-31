const HeaderMenu = require("../models/headerMenu");
const { errorResponse, response } = require("../utils/utils");

module.exports.addHeaderMenu = async (req, res, next) => {
    try {
        const { title, url, status, serial } = req.body;
        //validations
        if (!title || !url) return res.status(400).json({ status: false, error: "Bad request!" })

        //checking deplicate available or not
        const menuExist = await HeaderMenu.findOne({ title: title });
        if (menuExist) return res.json({status: false, error: "A header menu with this title already exist!"});

        //Inserting data
        const headerMenu = new HeaderMenu({ title: title, url: url, status: status, serial: serial });
        const data = await headerMenu.save();
        return res.json({ status: true, message: "Header Menu Added Successfully!", data: data })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message });
    }
};

exports.editHeaderMenuById = async (req, res, next) => {
    try {
        const { _id, title, status, url, serial } = req.body;
        if (!_id || !title || !url || !serial) return res.status(400).json({ status: false, error: "Missing Fields" });
        const menuExist = await HeaderMenu.findOne({ _id: _id }).lean();
        if (!menuExist) return res.status(400).json({ status: false, error: "Header Menu Not Found!" })

        const menuExist2 = await HeaderMenu.findOne({ title: title });
        if (menuExist2 && menuExist2._id != _id) return res.json({status: false, error: "A header menu with this title already exist!"});

        await HeaderMenu.updateOne(
            { _id: _id },
            { $set: { title: title, url: url, status: status, serial: serial } }
        );
        return res.json({ status: true, message: "Header Menu Edited Successfully!" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: err.message });
    }
};

exports.deleteMenuById = async (req, res, next) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).json({status: false, error: "Bad Request!"})
        const menu = await HeaderMenu.findOne({ _id: _id }).lean();
        if (!menu) return res.json({status: false, error: "No Header Menu Found!"})
        const data = await HeaderMenu.deleteOne({ _id: _id });
        return res.json({status: true, message: "Header Menu Deleted Successfully!"})
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, error: err.message});
    }
};

exports.getAllHeaderMenus = async (req, res, next) => {
    try {
        var data = await HeaderMenu.find().sort({ serial: 1 });
        data.sort((a, b) => (a.serial != null ? a.serial : Infinity) - (b.serial != null ? b.serial : Infinity));
        return response(res, { message: "Header Menu Get Successfully!" }, data);
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};

exports.getHeaderMenuById = async (req, res, next) => {
    try {
        const { _id } = req.query;
        //validations
        if (!_id) return res.status(400).json({status: false, error: "Bad Request!"})

        const menu = await HeaderMenu.findOne({ _id: _id });
        return res.json({status: true, message: "Get Header Menu Successfully", data: menu})
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, error: err.message});
    }
};

exports.getAllHomeHeaderMenus = async (req, res, next) => {
    try {
        const menus = await HeaderMenu.find({ status: 1 }).sort({ serial: 1 });
        if (menus) return response(res, { message: "Header Menus Get Successfully!" }, menus);
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};
