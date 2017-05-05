const Home = require('./handlers/home');
const Person = require('./handlers/Person');
const Joi = require('joi');

exports.register = (plugin, options, next) => {

  plugin.route([
    { method: 'GET', path: '/', config: Home.hello },
    { method: 'GET', path: '/restricted', config: Home.restricted },
    { method: 'GET', path: '/{path*}', config: Home.notFound },

    // Register
    { 
      method: 'POST', 
      path: '/register',
      handler: Person.register,
      config: {
        tags: ['api', 'Person'],
        validate: {
          payload: {
            email: Joi.string().email(),
            password: Joi.string().trim().min(6).max(255)
          }
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              '200': {
                'description': 'Success'/*,
                'schema': Joi.object({equals: Joi.number(),}).label('Result')*/
              },
              '400': {'description': 'Bad Request'}
            }
          }
        }
      }
    },

    // Get Persons
    {
      method: 'GET',
      path: '/persons',
      handler: Person.getPersons,
      config: {
        tags: ['api', 'Person'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          headers: Joi.object({
            'authorization': Joi.string().required()
          }).unknown()
        }
      }
    },

    // Get Person By ID
    {
      method: 'GET',
      path: '/persons/{id}',
      handler: Person.getPersonById,
      config: {
        tags: ['api', 'Person'],
        validate: {
          params: {
            id: Joi.number().integer()
          },
          headers: Joi.object({
            'authorization': Joi.string().required()
          }).unknown()
        },
        auth: {
          strategy: 'jwt',
        }
      }
    },

    // Update Person By ID
    {
      method: 'PUT',
      path: '/persons/{id}',
      handler: Person.updatePersonById,
      config: {
        tags: ['api', 'Person'],
        validate: {
          params: {
            id: Joi.number().integer()
          },
          payload: {
            firstName: Joi.string().trim().min(3).max(100),
            lastName: Joi.string().trim().min(3).max(100),
            age: Joi.number().integer()
          },
          headers: Joi.object({
            'authorization': Joi.string().required()
          }).unknown()
        },
        auth: {
          strategy: 'jwt',
        }
      }
    },

    // Add Person
    {
      method: 'POST',
      path: '/persons',
      handler: Person.addPerson,
      config: {
        tags: ['api', 'Person'],
        validate: {
          payload: {
            firstName: Joi.string().trim().min(3).max(100),
            lastName: Joi.string().trim().min(3).max(100),
            age: Joi.number().integer()
          },
          headers: Joi.object({
            'authorization': Joi.string().required()
          }).unknown()
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