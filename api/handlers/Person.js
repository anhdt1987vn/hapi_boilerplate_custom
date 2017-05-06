'use strict';

const Person = require('../../models/Person');
const Boom = require('boom');
//const SendMail = require('../utils/email/email');
const nodemailer = require('nodemailer');



/*
* Register function
*/
module.exports.register = function (request, reply) {

  let p = new Person();
  var salt = p.genRandomString(16);   //Gives us salt of length 16
  var passwordData = p.sha512(request.payload.password, salt);

  Person.query()
        .insert({email: request.payload.email, password: passwordData.passwordHash})
        .then(function (person){

          //SendMail;
          
          reply(person);

        })
        .catch(function(err){

          reply(err);
        });
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
    to: request.payload.email + ', abc@gmail.com, opensource1987@gmail.com', // list of receivers
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
};


/*
* GetPersons function
* @return {list} list persons
*/
module.exports.getPersons = function(request, reply){

  Person.query()
        .then(function (people) {

          console.log(people[0] instanceof Person); // --> true
          console.log('there are', people.length, 'People in total');
          reply(people);
        })
        .catch(function () {

          var error = Boom.create(400, 'Bad request', { timestamp: Date.now() });
          reply(error);
        });
};
  

/*
 * Get Person by ID
 * @param {int} id 
 * @return {object} Person 
 */
module.exports.getPersonById = function(request, reply){

  Person.query()
        .findById(request.params.id)
        .then(function(person) {

          reply(person);
        })
        .catch(function (err) {

          reply(err);
        });
};


/**
 *
 * Update Person By ID
 * @param {json object} 
 */
module.exports.updatePersonById = function(request, reply){

  Person.query()
        .patchAndFetchById(request.params.id,{firstName: request.payload.firstName, lastName: request.payload.lastName, age: request.payload.age})
        .then(function(person){

          reply(person);
        })
        .catch(function(err){
          
          console.log(err);
          reply(err);
        });
};


/**
 *
 * Add Person
 * @param {json object} person information
 */
module.exports.addPerson = function(request, reply){

  Person.query()
        .insert({
          firstName: request.payload.firstName, 
          lastName: request.payload.lastName, 
          age: request.payload.age
        })
        .then(function (person) {

          reply(person);
        })
        .catch(function (err) {
                      
          console.log(err);
          reply(err);  
        });
};