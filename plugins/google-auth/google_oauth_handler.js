
const JWT = require('jsonwebtoken'); // session stored as a JWT cookie

const SECRET_KEY = require('../../config/secret');

module.exports = function custom_handler(req, reply, tokens, profile) {

  //console.log(req);
  //console.log(reply);
  //console.log(tokens);
  //console.log(profile);
  if(profile) {
    // extract the relevant data from Profile to store in JWT object
    var session = {
      firstname : profile.name.givenName, // the person's first name e.g: Anita
      image    : profile.image.url,      // profile image url
      id       : profile.id,             // google+ id
      exp      : Math.floor(new Date().getTime()/1000) + 7*24*60*60, // Epiry in seconds!
      agent    : req.headers['user-agent']
    };

    // create a JWT to set as the cookie:
    var token = JWT.sign(session, SECRET_KEY);
    // store the Profile and Oauth tokens in the Redis DB using G+ id as key
    // Detailed Example...? https://github.com/dwyl/hapi-auth-google/issues/2

    profile.tokens = tokens;
    profile.valid = true;
    
    var redisClient = require('redis-connection')();
    redisClient.set(session.id, JSON.stringify(profile), function (err, res) {

      // reply to client with a view
      return reply("Hello " +profile.name.givenName + " You Logged in Using Goolge!" + JSON.stringify(profile))
      .state('token', token); // see: http://hapijs.com/tutorials/cookies
    });
  }else {
    return reply("Sorry, something went wrong, please try again.");
  }
};