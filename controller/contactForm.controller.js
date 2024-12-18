//node-mailer requirements
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

async function contactForm(req, res, models) {
  try {
    const myEmail = "bertramvwsteam@gmail.com";
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email provider
      auth: {
        user: myEmail,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const { firstName, lastName, email, subject, message } = req.body;

    //add email to database
    const emailToDB = await models.emails.create({
      emailFrom: email,
      message: message,
      firstName: firstName,
      lastName: lastName,
      subject: subject,
    });

    if (emailToDB) {
      console.log("email added to database");
    } else {
      console.log("email not added to database");
    }

    const mailOptions = {
      from: myEmail,
      to: myEmail,
      subject:
        "stagebooked message from " +
        firstName +
        " " +
        lastName +
        "regarding: " +
        subject,
      text:
        "New message from " +
        email +
        "at " +
        Date.now() +
        "regarding: " +
        subject +
        ". message: " +
        message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("success");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = contactForm;
