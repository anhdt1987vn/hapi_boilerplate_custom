const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'service.gemtek@gmail.com',
    pass: 'Duycuong@1987'
  }
});

        // setup email data with unicode symbols
let mailOptions = {
  from: '"FreeMan 👻" <service.gemtek@gmail.com>', // sender address
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