'use strict';

const Boom = require('boom');
const JWT  = require('jsonwebtoken');
const Wreck = require('wreck');
const FB = require('fb');
const fs = require('fs');
//const redisClient = require('redis-connection')(); // instantiate redis-connection

const Person = require('../../models/Person');
const utilsPerson = require('../utils/persons/userFunctions');
const jwt = require('../utils/jwt');
const SECRET_KEY = require('../../config/secret');

const apn = require('../utils/notifications/')

//const SendMail = require('../utils/email/nodemailer_templates');

/*
* Register function
*/
module.exports.register = function (request, reply) {

  let p = new Person();
  var salt = p.genRandomString(16);   //Gives us salt of length 16
  var passwordData = p.sha512(request.payload.password, salt);

  Person.query()
        .insert({email: request.payload.email, password: passwordData.passwordHash, salt: passwordData.salt})
        .then(function (person){
          apn;
          //SendMail;
          
          reply(person);

        })
        .catch(function(err){

          reply(err);
        });
};


/**
 *
 * Login function
 * 
 */
module.exports.login = function (request, reply) {
  utilsPerson.emailIsExist(request.payload.email, function(salt){

    let p = new Person();
    //var salt = p.genRandomString(16);   //Gives us salt of length 16
    var passwordData = p.sha512(request.payload.password, salt);
    console.log(passwordData);
    Person.query()
        .where('password', passwordData.passwordHash)
        .then(person => {

          // Check whether the email
          // is already taken and error out if so
          if(person.length === 0){
          //if(objIsEmpty(person)){
            reply('No Person');
          
          }else{
            console.log('ok');
            var token = jwt.creatToken('did_123456', request.payload.email);
            console.log(token);
            reply(token);
          }

        })
        .catch((err) => {
          console.log(err);
        });
  });
};

/**
 *
 * Login with Google+
 *
 */
module.exports.googleLogin = function(request, reply){

  const urlEndpoint = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=";

  Wreck.get(urlEndpoint + request.params.id_token, (err, res, payload) => {
    //console.log(err);
    //const stream = Wreck.toReadableStream(payload, 'ascii');
    //const read = stream.read();

    var rs = JSON.parse(payload.toString());
    console.log(rs.email);

  });


};


/**
 *
 * Login with Facebook
 *
 */
module.exports.facebookLogin = function(request, reply){

  FB.api('me', { fields: 'id,name,email,picture', access_token: request.params.access_token }, function (res) {
    console.log(res);
  });
  
};


/**
 *
 * Logout
 *
 */
module.exports.logout = function(request, reply) {

  jwt.updateToken(request, reply);
  reply({text: 'You have been logged out!'});

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