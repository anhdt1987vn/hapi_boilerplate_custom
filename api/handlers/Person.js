'use strict';

//const objection = require('objection');
const Person = require('../../models/Person');
//const Joi = require('joi');
//const Boom = require('boom');
// const bcrypt = require('bcrypt'); // see: https://github.com/nelsonic/bcrypt



module.exports.register = function (request, reply) {

  let p = new Person();
  var salt = p.genRandomString(16);   //Gives us salt of length 16
  var passwordData = p.sha512(request.payload.password, salt);

  Person.query()
        .insert({email: request.payload.email, password: passwordData.passwordHash})
        .then(function (person){
          reply(person);
        })
        .catch(function(err){
          reply(err);
        });
};



/*module.exports.register = {
  //auth: 'jwt',
  handler: function (request, reply) {

    let p = new Person();
    var salt = p.genRandomString(16);   //Gives us salt of length 16
    var passwordData = p.sha512(request.payload.password, salt);

    Person.query()
          .insert({email: request.payload.email, password: passwordData.passwordHash})
          .then(function (person){
            reply(person);
          })
          .catch(function(err){
            reply(err);
          });
  }
};
*/

/*module.exports = [
  {
    method: 'post',
    path: '/register',
    config: {
      tags: ['api'],
      validate: {
        payload: {
          email: Joi.string().email(),
          password: Joi.string().trim().min(6).max(255)
        }
      },
      handler: (request, reply) => {
        let p = new Person();
        var salt = p.genRandomString(16);   //Gives us salt of length 16
        var passwordData = p.sha512(request.payload.password, salt);

        Person
              .query()
              .insert({
                email: request.payload.email,
                password: passwordData.passwordHash
              })
              .then(function (person){
                reply(person);
              })
              .catch(function(err){
                //console.log("catch");
                reply(err);
              })
      }
    }
  },*/
  /*{
    method: 'post',
    path: '/persons',
    config: {
      tags: ['api'],
      validate: {
        payload: {
          firstName: Joi.string().trim().min(3).max(100),
          lastName: Joi.string().trim().min(3).max(100),
          age: Joi.number().integer()
        }
      },  
      handler: (request, reply) => {

        Person
              .query()
              .insert({firstName: request.payload.firstName, lastName: request.payload.lastName, age: request.payload.age})
              .then(function (person) {

                reply(person);
              })
              .catch(function (err) {
                      
                console.log(err);
                reply(err);  
              })

      }
    }
  },*/
  /*{
      method: 'get',
      path: '/persons',
      config: {
        tags: ['api'],
          handler: (request, reply) => {

            Person
          .query()
            .then(function (people) {

              console.log(people[0] instanceof Person); // --> true
              console.log('there are', people.length, 'People in total');
              reply(people);
            })
            .catch(function (err) {

              var error = Boom.create(400, 'Bad request', { timestamp: Date.now() });
            });
        }
      }
  },*/
  // Get by ID
  /*{
    method: 'get',
    path: '/persons/{id}',
    config: {
      tags: ['api'],
      validate: {
        params: {
          id: Joi.number().integer()
        }
      },
      handler: (request, reply) => {

        Person
          .query()
          .findById(request.params.id)
          .then(function(person) {

            reply(person);
          })
          .catch(function (err) {

            reply(err);
          });
      }
    }
  },*/
  // Update by ID
  /*{
    method: 'put',
    path: '/persons/{id}',
    config: {
      tags: ['api'],
      validate: {
        params: {
          id: Joi.number().integer()
        },
        payload: {
          firstName: Joi.string().trim().min(3).max(100),
          lastName: Joi.string().trim().min(3).max(100),
          age: Joi.number().integer()
        }
      },
      handler: (request, reply) => {

        Person
          .query()
          .updateAndFetchById(request.params.id, {firstName: request.payload.firstName, lastName: request.payload.firstName, age: request.payload.age})
          .then(function(person){

            reply(person);
          })
          .catch(function(err){

            reply(err);
          });
      }
    }
  }*/
//];