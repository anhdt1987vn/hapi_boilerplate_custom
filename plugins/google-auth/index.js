'use strict';

const GoogleAuth = require('hapi-auth-google');
require('dotenv').config();

var opts = {
  REDIRECT_URL: '/googleauth', // must match google app redirect URI from step 2.8
  handler: require('./google_oauth_handler.js'), // your handler
  config: {  // optional route config (as for any route in hapi)
    description: 'Google auth callback',
    notes: 'Handled by hapi-auth-google plugin',
    tags: ['plugin']
  },
  access_type: 'online', // options: offline, online
  approval_prompt: 'auto', // options: always, auto
  scope: 'https://www.googleapis.com/auth/plus.profile.emails.read', // ask for their email address
  // can use process.env or if you prefer, define here in options:
  BASE_URL: process.env.BASE_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};

//console.log(process.env.BASE_URL);
//console.log(process.env.GOOGLE_CLIENT_ID);
//console.log(process.env.GOOGLE_CLIENT_SECRET);

exports.register = (server, options, next) => {

  server.register({
    register: GoogleAuth,
    options: opts
  },
    (err) => {

      if (err) {
        return next(err);
      }


      next();
    });

};

exports.register.attributes = {
  name: 'google-auth'
};