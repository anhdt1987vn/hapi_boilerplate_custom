'use strict';
const Good = require('good');
//const Handlebars = require('handlebars');

exports.register = (server, options, next) => {

  server.register({
    register: Good,
    options: {
      ops: { interval: 60000 },
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            response: '*',
            log: '*'
          }]
        }, {
          module: 'good-console' 
        }, 'stdout']
      }
    }
  },
    (err) => {

      if (err) {
        return next(err);
      }


      next();
    });

};

exports.register.attributes = {
  name: 'good-mor'
};
