'use strict';

const Boom = require('boom');
/*const Person = require('../../../models/Person');
const objIsEmpty = require('../common.js').objIsEmpty;*/
var redisClient = require('redis-connection')(); // instantiate redis-connection

module.exports.trackingGuest = function (session, callback) {
  redisClient.set('guest_' + session.id, JSON.stringify(session));
  callback();
};

module.exports.initialGuestSession = function (session, callback) {
  //redisClient.set('guest_' + session.id, JSON.stringify(session));
  redisClient.hset('GUESTS', session.id, JSON.stringify(session));
  callback();
};
