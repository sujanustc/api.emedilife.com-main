const FooterLinkHeader = require('../models/footerLinkHeader')
const addFooterLinkHeader = async (req, res) => {
    try {
        const { title, serial, status } = req.body;
        if (!title || !serial) return res.status(400).json({ status: false, message: "Missing Fields" })

        const isExist = await FooterLinkHeader.findOne({ title: title })
        if (isExist) return res.status(200).json({ status: false, message: "This Title is Already Exist! Try Another One!" })

        const footerLinkHeader = new FooterLinkHeader({
            title: title,
            serial: serial,
            status: status,
        });
        const savedFooterLinkHeader = await footerLinkHeader.save();

        res.json({ status: true, data: savedFooterLinkHeader })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error })
    }
}

const editFooterLinkHeader = async (req, res) =>{
    try {
        const {_id, title, serial, status} = req.body;
        if(!_id || !title || !serial) return res.status(400).json({status: false, message: "Missing Fields"})

        const isExist = await FooterLinkHeader.findOne({_id: _id})
        if(!isExist) return res.json({status: false, message: "No Footer Link Header exist with this ID"})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error })
    }
}

const deleteFooterLinkHeader = async (req, res) =>{

}


module.exports = {addFooterLinkHeader}