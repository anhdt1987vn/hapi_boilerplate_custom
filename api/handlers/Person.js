'use strict';

const Boom = require('boom');
const JWT  = require('jsonwebtoken');
const Wreck = require('wreck');
const FB = require('fb');
const fs = require('fs');
//const redisClient = require('redis-connection')(); // instantiate redis-connection
const aguid = require('aguid');  // https://github.com/ideaq/aguid

const Person = require('../../models/Person');

const utilsPerson = require('../utils/persons/userFunctions');
const utilsGuest = require('../utils/guests/guestFunctions');

const jwt = require('../utils/jwt');
const SECRET_KEY = require('../../config/secret');


//const apn = require('../utils/notifications/');


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
          //apn;
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

  /*const urlEndpoint = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=";

  Wreck.get(urlEndpoint + request.params.id_token, (err, res, payload) => {
    //console.log(err);
    //const stream = Wreck.toReadableStream(payload, 'ascii');
    //const read = stream.read();

    var rs = JSON.parse(payload.toString());
    console.log(rs.email);

  });*/
  /*var GoogleAuth = require('google-auth-library');
  var auth = new GoogleAuth;
  var client = new auth.OAuth2('271348370500-5vc7vuqnnnlh6bvumtbjvkc6g6skvpm5.apps.googleusercontent.com', '', '');
  client.verifyIdToken(
      request.params.id_token,
      '271348370500-5vc7vuqnnnlh6bvumtbjvkc6g6skvpm5.apps.googleusercontent.com',
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
      function(e, login) {
        //console.log(e);
        //console.log(login);
        var payload = login.getPayload();
        var userid = payload['sub'];
        console.log(payload);
        // If request specified a G Suite domain:
        //var domain = payload['hd'];
      });*/

  // googleAccessToken = google_id_token
  // googleUserId = google sub | userId
  var googleAccessToken = request.payload.access_token;
  var googleUserId = request.payload.user_id;

  var GoogleAuth = require('google-auth-library');
  var auth = new GoogleAuth;
  var client = new auth.OAuth2('926379988966-t5sobkitrajm43sspc163uh3gi248mr1.apps.googleusercontent.com', '', '');

  client.verifyIdToken(
      googleAccessToken,
      '926379988966-t5sobkitrajm43sspc163uh3gi248mr1.apps.googleusercontent.com',
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
      function(e, login) {
        //console.log(e);
        //console.log(login);
        var payload = login.getPayload();

        // sub is googleUserId
        var userId = payload['sub'];

        if(userId != null){
          Person.query()
            .where('googleId', userId)
            .then(person => {

              if(person.length === 0){
     
                var session = {
                  deviceId: 'Android_1',
                  email: payload['email'],
                  name: payload['name'],
                  valid: true, // this will be set to false when the person logs out
                  id: aguid(), // a random session id
                  exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
                };
                utilsGuest.initialGuestSession(session, function(){
                  reply('Is Guest');
                });
                        
              }else{
                console.log('ok');
                
                console.log(person[0].googleId);

                if(person[0].googleId == userId && googleUserId == person[0].googleId){
                  var token = jwt.creatToken('did_123456', payload['email']);
                  console.log(token);
                  reply(token); 
                }else{
                  console.log('what ? ?? ');
                }
              }

            })
            .catch((err) => {
              console.log(err);
            });    
        }else{
          console.log('user_id not found');  
        }

        console.log(payload);
        // If request specified a G Suite domain:
        //var domain = payload['hd'];
      });

};


/**
 *
 * Login with Facebook
 *
 */
module.exports.facebookLogin = function(request, reply){

  var fbAccessToken = request.payload.access_token;
  var fbUserId = request.payload.user_id;


  FB.api('me', { fields: 'id,name,email,picture', access_token: fbAccessToken }, function (res) {
    //console.log(res.id);
    if(res.id != null){
      Person.query()
        .where('facebookId', res.id)
        .then(person => {

          if(person.length === 0){
 
            var session = {
              deviceId: 'Android_1',
              email: res.email,
              name: res.name,
              valid: true, // this will be set to false when the person logs out
              id: aguid(), // a random session id
              exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
            };
            utilsGuest.initialGuestSession(session, function(){
              reply('Is Guest');
            });
                    
          }else{
            console.log('ok');
            
            console.log(person[0].facebookId);

            if(person[0].facebookId == res.id && fbUserId == person[0].facebookId){
              var token = jwt.creatToken('did_123456', res.email);
              console.log(token);
              reply(token); 
            }else{
              console.log('what ? ?? ');
            }

            
          }

        })
        .catch((err) => {
          console.log(err);
        });  
    }else{
      console.log('user_id not found');
    }
    
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

  const util = require('util');
    //obj = /*Long and complex object*/;

  
  var telesign = require('telesign').setup({
    customerId: '253EADC1-99C3-49E4-810A-438F40FCC99C',
    apiKey: 'HTs0UmJTUOHUJ8XmQdECP/jX9moHT8adAy3ERp41rL97/8qn0fJJ+CQISCE2DzvAO4O7/9AGauYGNlsSejfNyQ=='
  });

  var options = {
    phoneNumber: '84969907605', // required
    ucid: 'BACF', // optional
    //originatingIp: '203.0.113.45', // optional
    //language: '', // optional, defaults to 'en-US'
    verifyCode: 12345 // optional, defaults to random value generated by TeleSign
    //template: 'Your code is $$CODE$$' // optional, must include a $$CODE$$ placeholder to integrate the verifyCode token
  };

  telesign.verify.sms(options, function(err, response) {
    // err: failed request or error in TeleSign response
    // response: JSON response from TeleSign
    if(err){
      console.log('Eror: ' + err);
      console.log(util.inspect(err, {depth: null}));
    }else{
      console.log('Res: ' + response);
    }
  });

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



module.exports.getMoviesByPerson = function (request, reply) {


  const person =  Person
      .query()
      .where('id', request.params.id)
      .eager('movies')
      .then(rs => {

        console.log(rs[0].movies[0].name);
        reply(rs[0].movies) 
      });
      
};
