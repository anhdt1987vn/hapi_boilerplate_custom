'use strict';

const Boom = require('boom');
const Person = require('../../../models/Person');
const objIsEmpty = require('../common.js').objIsEmpty;

module.exports.verifyUniqueUser = function (request, reply) {

  // Find an entry from the database that
  // matches either the email
  Person.query()
        .where('email', request.payload.email)
        .then(person => {

          // Check whether the email
          // is already taken and error out if so
          //if(person.length !== 0){
          if(!objIsEmpty(person)){

            if(person[0].email === request.payload.email){

              var error = Boom.create(400, 'Bad request', { timestamp: Date.now() });
              reply(error);
              return;
            }
          }
          // If everything checks out, send the payload through
          // to the route handler

          reply(request.payload);
        })
        .catch((err) => {
          console.log(err);
        });
};



module.exports.emailIsExist = function (email, doneChecking) {

  // Find an entry from the database that
  // matches either the email
  Person.query()
        .where('email', email)
        .then(person => {

          // Check whether the email
          // is already taken and error out if so
          //if(person.length !== 0){
          if(objIsEmpty(person)){

            return;
          }

          doneChecking(person[0].salt);
        })
        .catch((err) => {
          console.log(err);
        });

  //call back
  // doneChecking(salt);
};