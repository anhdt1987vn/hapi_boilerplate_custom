'use strict';

const Handlebars = require('handlebars');

exports.register = (server, options, next) => {

  server.register([
    {
      register: require('inert')
    },
    {
      register: require('vision')
    },
    {
      // Tag routes with "api" for use with swagger.
      register: require('hapi-swagger'),
      options: {
        documentationPage: false,
        securityDefinitions: {
          'jwt': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
          }
        },
        security: [{ 'jwt': [] }],
        info: {
          'title': 'Test API Documentation',
          'description': 'This is a sample example of API documentation.'
        },
        grouping: 'tags'
      }
    }
  ],
    (err) => {

      if (err) {
        return next(err);
      }

      server.views({
        engines: { html: Handlebars },
        path: __dirname
      });

        // Swagger docs
      server.route({
        method: 'get',
        path: '/swagger',
        handler: { view: { template: 'swagger' } }
      });

      next();
    });

};

exports.register.attributes = {
  name: 'app-swagger'
};
