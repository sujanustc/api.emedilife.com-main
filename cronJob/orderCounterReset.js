var cron = require('node-cron');
const UniqueId = require('../models/unique-id')
const moment = require('moment')
const CronJob = require("../models/cronJob")

cron.schedule('00 00 * * *', async () => {
    try {
        await UniqueId.findOneAndUpdate({}, { dailyOrderId: 0 })
        console.log(`Running a job at ${moment()} at Asia/Dhaka timezone`);
        const cronJob = new CronJob({name: "Daily Order Counter Reset", status: 1, error: null});
        await cronJob.save()
    } catch (error) {
        console.log(error);
        const cronJob = new CronJob({name: "Daily Order Counter Reset", status: 0, error: error});
        await cronJob.save()
    }
}, {
    scheduled: true,
    timezone: "Asia/Dhaka"
});
