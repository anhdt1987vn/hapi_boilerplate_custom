//var serviceAccount = require("../../../serviceAccountKey.json");
const path = require('path');
const fs = require('fs');

//path.resolve

console.log(path.resolve(__dirname, '../../../config/APNsAuthKey_7F926WW9H2.p8'));
console.log(". = %s", path.resolve("."));
console.log("__dirname = %s", path.resolve(__dirname));

const settings = {
  apn: {
    token: {    
      //key:  path.resolve('../../config/APNsAuthKey_7F926WW9H2.p8'), // optionally: fs.readFileSync('./certs/key.p8') 
      key: path.resolve(__dirname, '../../../config/APNsAuthKey_7F926WW9H2.p8'),
      keyId: '7F926WW9H2',
      teamId: '2QGHCWRLL7'
    }
  }
};

//console.log(settings);
const PushNotifications = new require('node-pushnotifications');
const push = new PushNotifications(settings);

// Single destination
//const registrationIds = '20e7ac752b39cf45f6abcd50700fe4743ed3775adc9dadf56f1c461274ade29';



// Multiple destinations
const registrationIds = [];
registrationIds.push('220e7ac752b39cf45f6abcd50700fe4743ed3775adc9dadf56f1c461274ade29');
//registrationIds.push('20e7ac7 52b39cf4 5f6abcd5 0700fe47 43ed3775 adc9dadf 56f1c461 274ade29');
//registrationIds.push('ccbe6433 3bfbc096 c4c980d9 1c602b03 90797e51 c79ae1f2 a36e295f fcd559ae');
//registrationIds.push('ccbe64333bfbc096c4c980d91c602b0390797e51c79ae1f2a36e295ffcd559ae');
//ccbe6433 3bfbc096 c4c980d9 1c602b03 90797e51 c79ae1f2 a36e295f fcd559ae


/*{
    retryLimit: data.retries || -1,
    expiry: data.expiry || ((data.timeToLive || 28 * 86400) + Math.floor(Date.now() / 1000)),
    priority: data.priority === 'normal' ? 5 : 10,
    encoding: data.encoding,
    payload: data.custom || {},
    badge: data.badge,
    sound: data.sound || 'ping.aiff',
    alert: data.alert || {
        title: data.title,
        body: data.body,
        'title-loc-key': data.titleLocKey,
        'title-loc-args': data.titleLocArgs,
        'loc-key': data.locKey,
        'loc-args': data.locArgs,
        'launch-image': data.launchImage,
        action: data.action,
    },
    topic: data.topic, // Required
    category: data.category || data.clickAction,
    contentAvailable: data.contentAvailable,
    mdm: data.mdm,
    urlArgs: data.urlArgs,
    truncateAtWordEnd: data.truncateAtWordEnd,
    collapseId: data.collapseKey,
    mutableContent: data.mutableContent || 0,
}*/

/*const data = {
  title: 'New push notification from VNHOME',
  body: 'fuck you',
  sound: 'mySound.aiff',
  custom: {
    sender: 'appfeel-test',
  },
  topic:'com.sunrise.edu.EduMobile'
}*/
const data = {
  title: 'VNHOME NOTIFICATIONS', // REQUIRED
  body: 'Powered by ADMIN-ATK', // REQUIRED
  custom: {
    sender: 'ADMIN-ATK',
  },
  priority: 'high', // gcm, apn. Supported values are 'high' or 'normal' (gcm). Will be translated to 10 and 5 for apn. Defaults to 'high'
  //collapseKey: '', // gcm for android, used as collapseId in apn
  //clickAction: '', // gcm for android. In ios, category will be used if not supplied
  //locKey: '', // gcm, apn
  //bodyLocArgs: '', // gcm, apn
  //retries: 1, // gcm, apn
  //encoding: '', // apn
  //badge: 2, // gcm for ios, apn
  //sound: 'ping.aiff', // gcm, apn
  //alert: {}, // apn, will take precedence over title and body
  //titleLocKey: '', // apn and gcm for ios
  //titleLocArgs: '', // apn and gcm for ios
  //launchImage: '', // apn and gcm for ios
  action: 'Test Action', // apn and gcm for ios
  topic: 'com.sunrise.edu.EduMobile', // apn and gcm for ios
  //category: '', // apn and gcm for ios
  contentAvailable: 'Test Content Available', // apn and gcm for ios
  //mdm: '', // apn and gcm for ios
  //urlArgs: '', // apn and gcm for ios
  //truncateAtWordEnd: true, // apn and gcm for ios
  //mutableContent: 0, // apn
  //expiry: Math.floor(Date.now() / 1000) + 28 * 86400, // seconds
  //timeToLive: 28 * 86400, // if both expiry and timeToLive are given, expiry will take precedency
};

// You can use it in node callback style
push.send(registrationIds, data, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
    console.log(result[0].message);
  }
});

// Or you could use it as a promise:
/*push.send(registrationIds, data)
    .then((results) => {
      console.log('#___5----HEREEEEEEEEEEE');
      console.log(results);
    })
    .catch((err) => {
      console.log('#___6----HEREEEEEEEEEEE');
      console.log(err);
    });*/