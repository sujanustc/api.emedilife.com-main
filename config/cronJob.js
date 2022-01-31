const schedule = require("node-schedule");
const Product = require("../models/product");
const utils = require("../helpers/utils")

// const expDate = new Date('2021-09-11T17:06:14+06:00');

// schedule.scheduleJob(expDate, () => {
//     console.log('NODE JOB Called in Date', new Date().toString())
// });

// const sJob = schedule.scheduleJob("0 */2 * * *", () => {
//   console.log("NODE JOB Called in Every schedule time", new Date().toString());
//   updateData().then();

//   // setTimeout(() => {
//   //     sJob.cancel();
//   // }, 1000)
// });

async function updateData() {
  const today = utils.getDateString(new Date());
  const campaignProducts = await Product.find({
    $or: [
      { campaignStartDate: { $ne: null } },
      { campaignEndDate: { $ne: null } },
    ],
  });

  campaignProducts.forEach((f, i) => {
    // Time Logic
    const expDate = utils.getDateString(f.campaignEndDate);
    const timeLeftDay = utils.getDateDifference("d", expDate, today);
    if (timeLeftDay <= 0) {
      Product.findByIdAndUpdate(f._id, {
        $set: {
          discountAmount: 0,
          campaignStartDate: null,
          campaignEndDate: null,
        },
      }).exec();
    } else {
      // console.log('Time Not Expired')
    }
  });
}

require('../cronJob/orderCounterReset')