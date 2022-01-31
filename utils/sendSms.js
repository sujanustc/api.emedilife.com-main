const axios = require("axios").default;

const sendSms = async (message, phoneNo) => {
    const { data } = await axios.post(`http://66.45.237.70/api.php?username=${process.env.bulkSmsUsername}&password=${process.env.bulkSmsPassword}&number=${phoneNo}&message=${message}`, {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).catch(error => { console.log(error); })

    var responses = data.split("|");
    const code = responses[0];
    // 1000 = Invalid user or Password
    // 1002 = Empty Number
    // 1003 = Invalid message or empty message
    // 1004 = Invalid number
    // 1005 = All Number is Invalid 
    // 1006 = insufficient Balance 
    // 1009 = Inactive Account
    // 1010 = Max number limit exceeded
    // 1101 = Success
    const object = {
        status: true,
        message: data,
        error: null
    }
    if (code == 1101) {
        object.status = true;
    } else {
        object.status = false;
    }
    if (code == 1101) {
        object.message = "success";
    }
    else if (code == 1000) {
        object.error = "Invalid user or Password";
    }
    else if (code == 1002) {
        object.error = "Empty Number";
    }
    else if (code == 1003) {
        object.error = "Invalid message or empty message";
    }
    else if (code == 1004) {
        object.error = "Invalid number";
    }
    else if (code == 1005) {
        object.error = "All Number is Invalid ";
    }
    else if (code == 1006) {
        object.error = "insufficient Balance ";
    }
    else if (code == 1009) {
        object.error = "Inactive Account";
    }
    else if (code == 1010) {
        object.error = "Max number limit exceeded";
    } else {
        object.error = "something wrong . contact to support";
    }
    return object
}
module.exports = {
    sendSms
};

