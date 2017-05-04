'use strict';

const Knex = require('knex');
const Config = require('../../db/knexfile');
const Model = require('objection').Model;

exports.register = (server, option, next) => {
  // Initialize knex.
  const knex = Knex(Config.development);
  //console.log(knex);
  Model.knex(knex);
  next();
};

exports.register.attributes = {
  name: 'knex'
};
