
const JWT         = require('jsonwebtoken');   // used to sign our content
const aguid       = require('aguid');  // https://github.com/ideaq/aguid

const SECRET_KEY = require('../../config/secret');

//const sessionKey = require('../utils/sessionKey');
//const JWT_ENCODING_ALGORITHM = config.get('jwt:algorithm');
//const JWT_SECRET_SEPARATOR = config.get('jwt:secret_separator');

var redisClient = require('redis-connection')(); // instantiate redis-connection

redisClient.set('redis', 'working');
redisClient.get('redis', function (rediserror, reply) {

  if(rediserror) {
    console.log(rediserror);
  }
  console.log('Redis is ' +reply.toString()); // confirm we can access redis
});

module.exports.creatToken = function(deviceId, email, type){
  var session = {
    deviceId: deviceId,
    email: email,
    valid: true, // this will be set to false when the person logs out
    id: type + "_" +aguid(), // a random session id
    type: type,
    exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
  };

  // create the session in Redis
  redisClient.set(session.id, JSON.stringify(session));
  //redisClient.expire(session.id, 30);
  // sign the session as a JWT
  var token = JWT.sign(session, SECRET_KEY); // synchronous
  //console.log(token); 
  return token;
};


// bring your own validation function
module.exports.validateFunc = function (decoded, request, callback) {
  console.log(" - - - - - - - DECODED token:");
  console.log(decoded);
  // do your checks to see if the session is valid
  redisClient.get(decoded.id, function (rediserror, reply) {
    /* istanbul ignore if */
    if(rediserror) {
      console.log(rediserror);
    }
    console.log(' - - - - - - - REDIS reply - - - - - - - ', reply);
    var session;
    if(reply) {
      session = JSON.parse(reply);
    }
    else { // unable to find session in redis ... reply is null
      return callback(rediserror, false);
    }

    if (session.valid === true && session.exp >= new Date().getTime()) {
      return callback(rediserror, true);
    }
    else {
      return callback(rediserror, false);
    }
  });
};

module.exports.updateToken = function(request, reply){
  // implement your own login/auth function here
  var decoded = JWT.decode(request.headers.authorization, SECRET_KEY);
  var session;
  redisClient.get(decoded.id, function(rediserror, redisreply) {

    if(rediserror) {
      console.log(rediserror);
    }
    session = JSON.parse(redisreply);
    console.log(' - - - - - - SESSION - - - - - - - -');
    console.log(session);
    // update the session to no longer valid:
    session.valid = false;
    session.ended = new Date().getTime();
    // create the session in Redis
    redisClient.set(session.id, JSON.stringify(session));
  });
};

