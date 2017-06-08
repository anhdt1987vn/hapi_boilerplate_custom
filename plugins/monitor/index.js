'use strict';
const Monitor= require('hapijs-status-monitor')
//const Handlebars = require('handlebars');

exports.register = (server, options, next) => {

  server.register({
    register: Monitor,
    options: {
      title: 'hapi.js Status',
      path: '/status',
      spans: [{
        interval: 1,     // Every second
        retention: 60    // Keep 60 datapoints in memory
      }, {
        interval: 5,     // Every 5 seconds
        retention: 60
      }, {
        interval: 15,    // Every 15 seconds
        retention: 60
      }],
      routeConfig: {
        auth: false
      }  // Route options, see https://github.com/hapijs/hapi/blob/master/API.md#route-options
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
  name: 'monitor'
};
