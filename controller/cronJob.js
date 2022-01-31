const CronJob = require('../models/cronJob');
const { getOffset } = require('../utils/utils');
exports.getAllCronJobList = async (req, res) => {
    try {
        var { pageSize, page, errorOnly } = req.body;
        var pLimit = parseInt(pageSize);
        pLimit = pLimit ? pLimit : 50
        page = page ? page : 1
        let { offset, limit } = getOffset(page, pLimit);
        if (!errorOnly) {
            const data = await CronJob.find().skip(offset).limit(limit).sort({ createdAt: -1 }).catch(error => {
                console.log(error);
                res.json({ status: false, error: error.message })
            });
            const count = await CronJob.countDocuments().catch(error => {
                console.log(error);
                res.json({ status: false, error: error.message })
            });
            if (data) {
                return res.status(200).json({
                    data,
                    count: count,
                    message: 'All CronJon fetch Successfully!'
                });
            }
        }
        else {
            const data = await CronJob.find({ error: { $ne: null } }).skip(offset).limit(limit).sort({ createdAt: -1 }).catch(error => {
                console.log(error);
                res.json({ status: false, error: error.message })
            });
            const count = await CronJob.countDocuments({ error: { $ne: null } }).catch(error => {
                console.log(error);
                res.json({ status: false, error: error.message })
            });
            if (data) {
                return res.status(200).json({
                    data,
                    count: count,
                    message: 'All CronJon fetch Successfully!'
                });
            }
        }

    } catch (err) {
        res.status(500).json({ status: false, error: err.message })
    }
}
