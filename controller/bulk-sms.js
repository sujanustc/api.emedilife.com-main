const request = require('request');
var urlencode = require('urlencode');

exports.sendBulkSms = async (req, res, next) => {

    try {
        const message = urlencode(req.body.message);
        const phoneNo = req.body.phoneNo;
        if(!message || !phoneNo) return res.status(400).json({status: false, error: "Bad Request!"})

        const url = 'http://66.45.237.70/api.php?username=' + process.env.bulkSmsUsername + '&password=' + process.env.bulkSmsPassword + '&number=' + phoneNo + '&message=' + message;
        // const url = 'http://66.45.237.70/maskingapi.php?username=' + process.env.bulkSmsUsername + '&password=' + process.env.bulkSmsPassword + '&number=' + phoneNo + '&message=' + message + '&senderid=' + process.env.bulkSmsSenderId;

        // console.log(url)
        let result = '';
        let options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        request(options, function (error, response) {
            if (error) {
                // console.log(error)
                result = error;
            }
            if (response && response.body) {
                result = response.body;
            }
            // console.log(response)
        });

        return res.json({
            success: true,
            status: true,
            message: 'Success',
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, error: err.message})
    }
}
