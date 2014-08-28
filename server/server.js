// server.js


// BASE SETUP
// =============================================================================
var express      = require('express'); 		// call express
var app          = express(); 				// define our app using express
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose     = require('mongoose');
var path         = require('path'); 
var config 			 = require('./app/config.js');
var security     = require('./app/security');
require('express-namespace');

// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(require('connect').bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.cookieParser());

// connect mongodb
mongoose.connect('mongodb://localhost/nodethatdb'); // connect to our database

// Routing
// =============================================================================
// Security checks
app.all('/api/security', function(req, res, next) {
  Console.log('check /api/security');
  // Free for all
  next();
});
app.all('/public', function(req, res, next) {
  Console.log('check /public');
  // Free for all
  next();
});
app.all('/*', function(req, res, next) {
  Console.log('check /*');
  // We require the user is authenticated to execute any action except login
  security.authenticationRequired(req, res, next);
});

// Rouging around
require('./app/routes/appFile').addRoutes(app, config);
require('./app/routes/static').addRoutes(app, config);

app.use('/api/security',         require('./app/routes/security'));
app.use('/api/tasks',            require('./app/routes/tasks'));
app.use('/api/tasks/:task_id',   require('./app/routes/task'));
app.use('/api/users',            require('./app/routes/users'));
app.use('/api/users/:user_id',   require('./app/routes/user'));

// This route deals enables HTML5Mode by forwarding missing files to the index.html
app.all('/*', function(req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: config.server.distFolder });
});


// START THE SERVER
// =============================================================================
app.listen(config.server.listenPort, config.server.ip, function(){
  //var addr = router.address();
  console.log("Server listening at", config.server.ip, ":", config.server.listenPort);
  
  // Open default page
  var open = require('open');
  open('http://' + config.server.ip + ':' + config.server.listenPort + '/');
});





// TODO: https://blog.liftsecurity.io/tag/headers

/*

per la sicurezza: 

https://github.com/strongloop/express/blob/master/examples/route-middleware/index.js

https://github.com/strongloop/express/blob/master/examples/auth/app.js

http://passportjs.org/guide/

http://www.sitepoint.com/local-authentication-using-passport-node-js/


*/