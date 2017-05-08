const path = require('path');

const EmailTemplate = require('email-templates').EmailTemplate;
const nodemailer = require('nodemailer');
//var wellknown = require('nodemailer-wellknown')
const async = require('async');
const Handlebars = require('handlebars');

var templatesDir = path.resolve(__dirname, 'templates');

//console.log(templatesDir);

Handlebars.registerHelper('capitalize', function capitalize (context) {
  return context.toUpperCase();
});

Handlebars.registerPartial('name',
  '{{ capitalize name.first }} {{ capitalize name.last }}'
);

var template = new EmailTemplate(path.join(templatesDir, 'welcome-email'));

//console.log(template);

// Prepare nodemailer transport object
let transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'service.gemtek@gmail.com',
    pass: 'Duycuong@1987'
  }
});

// An example users object with formatted email function
let locals = {
  email: 'duycuong87vn@gmail.com',
  name: {
    first: 'Duy',
    last: 'Cuong'
  }
};

// Send a single email
template.render(locals, function (err, results) {
  if (err) {
    return console.error(err);
  }

  // send mail with defined transport object
  transport.sendMail({
    from: 'Free Man <service.gemtek@gmail.com>',
    to: locals.email,
    subject: 'Welcome to ATK ✔',
    html: results.html,
    text: results.text
  }, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
});

// ## Send a batch of emails and only load the template once

/*var users = [
  {
    email: 'opensource1987@gmail.com',
    name: {
      first: 'Pappa',
      last: 'Pizza'
    }
  },
  {
    email: 'anhdt@atk.net.vn',
    name: {
      first: 'Mister',
      last: 'Geppetto'
    }
  }
]

// Send 10 mails at once
async.mapLimit(users, 10, function (item, next) {
  template.render(item, function (err, results) {
    if (err) return next(err)
    transport.sendMail({
      from: 'Free Man <service.gemtek@gmail.com>',
      to: item.email,
      subject: 'Mangia gli spaghetti con polpette!',
      html: results.html,
      text: results.text
    }, function (err, responseStatus) {
      if (err) {
        return next(err)
      }
      next(null, responseStatus.message)
    })
  })
}, function (err) {
  if (err) {
    console.error(err)
  }
  console.log('Succesfully sent %d messages', users.length)
})*/


