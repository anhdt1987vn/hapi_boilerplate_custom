var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

var transporter = nodemailer.createTransport(ses({
  accessKeyId: 'AKIAIVBE2K6I6NTRU55A',
  secretAccessKey: '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',
  region: 'us-west-2'
}));

transporter.sendMail({
  from: 'anhdt@atk.net.vn',
  to: 'duycuong87vn@gmail.com',
  subject: 'My Amazon SES Simple Email',
  text: 'Amazon SES is cool'
});

/*var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');

var mailOptions = {
  from: 'from@example.com',
  to: 'to@example.com',
  text: 'This is some text',
  html: '<b>This is some HTML</b>',
};
function callback(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Message sent: ' + info.response);
  }
}

// Send e-mail using AWS SES
mailOptions.subject = 'Nodemailer SES transporter';
var sesTransporter = nodemailer.createTransport(sesTransport({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2'
}));
sesTransporter.sendMail(mailOptions, callback);

// Send e-mail using SMTP
mailOptions.subject = 'Nodemailer SMTP transporter';
var smtpTransporter = nodemailer.createTransport({
  port: 465,
  host: 'email-smtp.us-west-2.amazonaws.com',
  secure: true,
  auth: {
    user: process.env.AWS_ACCESS_KEY_ID,
    pass: process.env.AWS_SECRET_ACCESS_KEY,
  },
  debug: true
});
smtpTransporter.sendMail(mailOptions, callback);*/