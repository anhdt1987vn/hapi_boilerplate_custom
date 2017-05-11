const SECRET_KEY = require('../config/secret');
const jwt = require('../api/utils/jwt');
//var redisClient = require('redis-connection')(); // instantiate redis-connection

exports.register = function (plugin, options, next) {

  plugin.auth.strategy('jwt', 'jwt', {
    key: SECRET_KEY,
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: true
    },
    validateFunc: jwt.validateFunc
  });

  // Uncomment this to apply default auth to all routes
  //plugin.auth.default('jwt');

  next();
};


exports.register.attributes = {
  name: 'auth'
};