'use strict';

const Boom = require('boom');
//const JWT  = require('jsonwebtoken');
//const Wreck = require('wreck');
//const FB = require('fb');
//const fs = require('fs');
//const redisClient = require('redis-connection')(); // instantiate redis-connection

const Movie = require('../../models/Movie');
//const utilsPerson = require('../utils/persons/userFunctions');
const jwt = require('../utils/jwt');
//const SECRET_KEY = require('../../config/secret');

//const apn = require('../utils/notifications/')

//const SendMail = require('../utils/email/nodemailer_templates');


/*
 * Get Person by ID
 * @param {int} id 
 * @return {object} Person 
 */
/*module.exports.getMoviesByPersonID = function(request, reply){

  Movie.query()
        .findById(request.params.id)
        .then(function(person) {

          reply(person);
        })
        .catch(function (err) {

          reply(err);
        });
};
*/