//const env = require('env2')('.env');
//console.log(process.env.TEMPLATE_DIRECTORY);


var sendemail   = require('sendemail'); // no api key
var email = sendemail.email;
sendemail.set_template_directory(process.env.TEMPLATE_DIRECTORY);

//sendemail.verifyEmail("duycuong87vn@gmail.com");

var person = {
  name : "Jenny",
  //email: "your.name+test" + Math.random() + "@gmail.com",
  email: "anhdt@atk.net.vn",
  senderEmailAddress: process.env.SENDER_EMAIL_ADDRESS,
  replyToAddress: "duycuong87vn@gmail.com",
  subject:"Welcome to ATK Services :)"
};

email('welcome', person, function(error, result){
  console.log(' - - - - - - - - - - - - - - - - - - - - -> email sent: ');
  console.log(result);
  console.log(error);
  console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
});