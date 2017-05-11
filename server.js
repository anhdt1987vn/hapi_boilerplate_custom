'use strict';

const Glue = require('glue');
const manifest = require('./config/manifest');

//console.log(manifest);

if (!process.env.PRODUCTION) {
  manifest.registrations.push({
    "plugin": {
      "register": "blipp",
      "options": {}
    }
  });
}

Glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {
  if (err) {
    console.log('server.register err:', err);
  }
  server.start(() => {
    console.log('✅  Server is listening on ' + server.info.uri.toLowerCase());
    server.generate_google_oauth2_url();
    console.log(server.generate_google_oauth2_url());
  });
});