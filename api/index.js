const Home = require('./handlers/home');
const Person = require('./handlers/Person');
const Joi = require('joi');

exports.register = (plugin, options, next) => {

  plugin.route([
    { method: 'GET', path: '/', config: Home.hello },
    { method: 'GET', path: '/restricted', config: Home.restricted },
    { method: 'GET', path: '/{path*}', config: Home.notFound },

    { 
      method: 'POST', 
      path: '/register',
      handler: Person.register,
      config: {
        tags: ['api'],
        validate: {
          payload: {
            email: Joi.string().email(),
            password: Joi.string().trim().min(6).max(255)
          }
        },
        auth: {
          strategy: 'jwt',
        }
      }
    }

  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};