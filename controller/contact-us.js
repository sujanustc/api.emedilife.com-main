const ContactUs = require('../models/contact-us');
const nodemailer = require("nodemailer");


exports.addContactUs = async (req, res, next) => {

    try {
        const data = req.body;
        const contactUs = new ContactUs(data);
        await contactUs.save();


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CONTACT_GMAIL,
                pass: process.env.CONTACT_GMAIL_PASS
            },
        });

        const receivingMailStr = data.receivingMails.toString();

        const info = await transporter.sendMail({
            from: `"Contact Us" <${data.email}>`,
            replyTo: data.email,
            to: receivingMailStr, // list of receivers
            subject: data.subject, // Subject line
            // text: "Hello this is text body", // plain text body
            html: `
            <h1>Subject: ${data.subject}</h1>
            <h2>Name: ${data.name}</h2>
            <h2>Email: ${data.email}</h2>
            <h2>Phone No: ${data.phoneNo}</h2>
            <h3>Address: ${data.address}</h3>
            <h3>Query Type: ${data.queryType}</h3>
            <p>Message: ${data.message}</p>
            `, // html body
        });


        res.status(200).json({
            data: true,
            messageId: info.messageId,
            message: 'Contact Information Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllContactUs = async (req, res, next) => {

    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = ContactUs.find();


        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }
        const newsletterCount = await ContactUs.countDocuments();

        const data = await query

        res.status(200).json({
            data: data,
            count: newsletterCount
        });
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getContactUsById = async (req, res, next) => {

    try {
        const id = req.params.id;
        const data = await ContactUs.findOne({_id: id});

        res.status(200).json({
            data: data,
            message: 'Successfully Get data!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editContactUs = async (req, res, next) => {
    try {
        const updatedData = req.body;
        await ContactUs.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            data: true,
            message: 'Store Information Updated Successfully!'
        });

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteContactUsById = async (req, res, next) => {

    const id = req.params.id;
    await ContactUs.deleteOne({_id: id});

    try {
        res.status(200).json({
            message: 'Contact Info Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * SUBMIT COMPLIMENT
 */
exports.addSubmitComplaint = async (req, res, next) => {

    try {
        const data = req.body;
        const receivingMailStr = data.receivingMails.toString();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CONTACT_GMAIL,
                pass: process.env.CONTACT_GMAIL_PASS
            },
        });

        const info = await transporter.sendMail({
            from: `"Submit Complaint" <${data.email}>`,
            replyTo: data.email,
            to: receivingMailStr, // list of receivers
            subject: data.subject, // Subject line
            // text: "Hello this is text body", // plain text body
            html: `
            <h1>Subject: ${data.subject}</h1>
            <h2>Name: ${data.name}</h2>
            <h2>Email: ${data.email}</h2>
            <h2>Phone No: ${data.phoneNo}</h2>
            <h3>Address: ${data.address}</h3>
            <p>Message: ${data.message}</p>
            `, // html body
        });

        res.status(200).json({
            data: true,
            messageId: info.messageId,
            message: 'Submit Complaint Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * SUBMIT COMPLIMENT
 */
exports.addAfterSaleSupport = async (req, res, next) => {

    try {
        const data = req.body;
        const receivingMailStr = data.receivingMails.toString();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CONTACT_GMAIL,
                pass: process.env.CONTACT_GMAIL_PASS
            },
        });

        const info = await transporter.sendMail({
            from: `"After Sale Support" <${data.email}>`,
            replyTo: data.email,
            to: receivingMailStr, // list of receivers
            subject: data.subject, // Subject line
            // text: "Hello this is text body", // plain text body
            html: `
            <h1>Subject: ${data.subject}</h1>
            <h2>Name: ${data.name}</h2>
            <h2>Email: ${data.email}</h2>
            <h2>Phone No: ${data.phoneNo}</h2>
            <h3>Address: ${data.address}</h3>
            <h3>Invoice Number: ${data.invoiceNumber}</h3>
            <p>Message: ${data.message}</p>
            `, // html body
        });

        res.status(200).json({
            data: true,
            messageId: info.messageId,
            message: 'After Sale Support Data Sent Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


/**
 * NODE MAIL
 */

exports.sentMailByNodemailer = async (req, res, next) => {
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CONTACT_GMAIL,
                pass: process.env.CONTACT_GMAIL_PASS
            },
        });

        const info = await transporter.sendMail({
            from: process.env.CONTACT_GMAIL, // sender address
            to: 'ikbal.sazib@gmail.com', // list of receivers
            subject: "Test mail from nodeJS", // Subject line
            text: "Hello this is text body", // plain text body
            html: "<b>Hello this is html body</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.status(200).json({
            data: "Message sent: %s " + info.messageId,
            message: 'Contact Information Added Successfully!'
        });
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
