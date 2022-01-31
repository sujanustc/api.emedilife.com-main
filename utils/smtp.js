var nodemailer = require("nodemailer");
require("dotenv").config();


/*
https://support.google.com/mail/answer/7126229?p=BadCredentials&visit_id=637749690694897599-2524737369&rd=2#cantsignin&zippy=%2Ci-cant-sign-in-to-my-email-client%2Cstep-change-smtp-other-settings-in-your-email-client
#Send Mail using Gmail
1. Go to https://mail.google.com/mail/u/0/?dispatcher_command=master_lookup#settings/fwdandpop
2. On IMAP access section turn on Enable IMAP and Save Changes
3. Go there https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4MtbedBYYRPEEJlDXiqnziDOEK_ifHBIJ-AFsCdszNshRAefvZMY3itDvGL9sjGy28dIaDzFEMKBiP9fSQ30wCwk2L_Tg
  and turn this on.
4. Then Follow the following Code
*/
const sendGMail = async (email) => {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    port:465,
    secure: true, // true for 465, false for other ports
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: 'yourgmail', // generated ethereal user
        pass: 'yourpass', // generated ethereal password
    },
    tls:{
        rejectUnAuthorized:true
    }
})

  var mailOptions = {
    from: 'yourgmail',
    to: 'receiveremail',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

const sendMail = async (email) => {

  console.log(email);
const smtpEndpoint = "email-smtp.eu-west-1.amazonaws.com";
const port = 587;

// Replace sender@example.com with your "From" address.
// This address must be verified with Amazon SES.
const senderAddress = "info@emedilife.com";

// Replace recipient@example.com with a "To" address. If your account
// is still in the sandbox, this address must be verified. To specify
// multiple addresses, separate each address with a comma.
var toAddresses = "dasujandb@gmail.com";

// Replace smtp_username with your Amazon SES SMTP user name.
const smtpUsername = "AKIAVUPD3GR6BZ272DNS";

// Replace smtp_password with your Amazon SES SMTP password.
const smtpPassword = "BI09uB041Mmnp5beqh1PPLYs9ZwNNANhhA8lRZ/1caxv";

// (Optional) the name of a configuration set to use for this message.
var configurationSet = "order";

// The subject line of the email
var subject = "Amazon SES test (Nodemailer)";

// The email body for recipients with non-HTML email clients.
var body_text = `Amazon SES Test (Nodemailer)
---------------------------------
This email was sent through the Amazon SES SMTP interface using Nodemailer.
`;

// The body of the email for recipients whose email clients support HTML content.
var body_html = `<html>
<head></head>
<body>
  <h1>Amazon SES Test (Nodemailer)</h1>
  <p>This email was sent with <a href='https://aws.amazon.com/ses/'>Amazon SES</a>
        using <a href='https://nodemailer.com'>Nodemailer</a> for Node.js.</p>
</body>
</html>`;

// The message tags that you want to apply to the email.
var tag0 = "key0=value0";
var tag1 = "key1=value1";

async function main(){

  // Create the SMTP transport.
  let transporter = nodemailer.createTransport({
    host: smtpEndpoint,
    port: port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUsername,
      pass: smtpPassword
    }
  });

  // Specify the fields in the email.
  let mailOptions = {
    to: "mizanurrahaman592@gmail.com",
    from: "info@emedilife.com",
    subject: subject,
    text: body_text,
    html: body_html,
    // Custom headers for configuration set and message tags.
    headers: {
      'X-SES-CONFIGURATION-SET': configurationSet,
      // 'X-SES-MESSAGE-TAGS': tag0,
      // 'X-SES-MESSAGE-TAGS': tag1
    }
  };

  // Send the email.
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent! Message ID: ", info.messageId);
}

main().catch(console.error);



//   var transporter = nodemailer.createTransport({
//     service: 'email-smtp.eu-west-1.amazonaws.com',
//     port:587,
//     secure: false, // true for 465, false for other ports
//     logger: true,
//     debug: true,
//     secureConnection: false,
//     auth: {
//         user: 'AKIAVUPD3GR6BZ272DNS',
//         pass: 'BI09uB041Mmnp5beqh1PPLYs9ZwNNANhhA8lRZ/1caxv',
//     },
//     tls:{
//         rejectUnAuthorized:true
//     }
// })

//   var mailOptions = {
//     from: 'info@emedilife.com',
//     to: email,
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
}

//     const nodemailer = require("nodemailer");

  // // async..await is not allowed in global scope, must use a wrapper
  // async function main() {
  //   // Generate test SMTP service account from ethereal.email
  //   // Only needed if you don't have a real mail account for testing
  //   let testAccount = await nodemailer.createTestAccount();

  //   // create reusable transporter object using the default SMTP transport
  //   let transporter = nodemailer.createTransport({
  //     host: "smtp.ethereal.email",
  //     port: 587,
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       user: testAccount.user, // generated ethereal user
  //       pass: testAccount.pass, // generated ethereal password
  //     },
  //   });

  //   // send mail with defined transport object
  //   let info = await transporter.sendMail({
  //     from: 'mizanurrahaman592@gmail.com', // sender address
  //     to: "dasujandb@gmail.com", // list of receivers
  //     subject: "Hello ✔", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: "<b>Hello world?</b>", // html body
  //   });

  //   console.log("Message sent: %s", info.messageId);
  //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //   // Preview only available when sending through an Ethereal account
  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  // }

  // main().catch(console.error);

  // return true;




  // create reusable transporter object using the default SMTP transport
  // try {
  //     let transporter = nodemailer.createTransport({
  //         host: process.env.SMTP_ENDPOINT,
  //         port: process.env.SMTP_PORT || 465,
  //         secure: true, // true for 465, false for other ports
  //         auth: {
  //             user: process.env.SMTP_USERNAME,
  //             pass: process.env.SMTP_PASSWORD,
  //         },
  //     });

  //     // send mail with defined transport object
  //     let info = await transporter.sendMail({
  //         from: process.env.SMTP_EMAIL, // sender address
  //         to: email, // list of receivers
  //         subject: "Hello ✔", // Subject line
  //         text: "Hello world?", // plain text body
  //         html: "<b>Hello world?</b>", // html body
  //     });

  //     console.log("Message sent: %s", info.messageId);
  //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //     // Preview only available when sending through an Ethereal account
  //     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  //     return true;

  // } catch (error) {
  //     console.log(error);
  // }

module.exports = { sendGMail, sendMail }