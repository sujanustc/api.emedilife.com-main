const request = require('request');

exports.sendBulkSms = (phoneNo, message) => {
    const url = 'http://66.45.237.70/api.php?username=' + process.env.bulkSmsUsername + '&password=' + process.env.bulkSmsPassword + '&number=' + phoneNo + '&message=' + message;
    console.log(url)
    // const url = 'http://66.45.237.70/maskingapi.php?username=' + process.env.bulkSmsUsername + '&password=' + process.env.bulkSmsPassword + '&number=' + phoneNo + '&message=' + message + '&senderid=' + process.env.bulkSmsSenderId;

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
        if (response.body) {
            result = response.body;
        }
        // console.log(response)
    });
}
