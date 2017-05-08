var nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({ // Yes. SMTP!
  host: "us-west-2.amazonses.com", // Amazon email SMTP hostname
  secureConnection: false, // use SSL
  port: 465, // port for secure SMTP
  auth: {
    user: "AKIAJAE5PFXZ27WGBKDQ", // Use from Amazon Credentials
    pass: "AuRggKDqeNW2EJvcJKWKOZGgs+UWohtM5zsPU629ChSi" // Use from Amazon Credentials
  }
});

// setup email data with unicode symbols
let mailOptions = {
  from: '"FreeMan 👻" <anhdt@atk.net.vn>', // sender address
  to: 'abc@gmail.com, opensource1987@gmail.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world ?', // plain text body
  html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message %s sent: %s', info.messageId, info.response);
});