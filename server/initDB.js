
// To db setup:
// node server/initDB.js

var config       = require('./config');
var initDB       = require('./app/lib/initDB');

console.log('************** START');

initDB.initialize(config);
initDB.addAdminUser(function() {});

console.log('************** END');
