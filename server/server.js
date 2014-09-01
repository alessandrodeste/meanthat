// server.js


// BASE SETUP
// =============================================================================
var express      = require('express');
var app          = express(); 				
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose     = require('mongoose');
var path         = require('path'); 
var config 			 = require('./app/config.js');
var security     = require('./app/security/security');
var protectJSON  = require('./app/security/protectJSON');
var passport     = require('passport');
var morgan       = require('morgan');
var flash        = require('connect-flash');
//var xsrf         = require('./app/security/xsrf');
require('express-namespace');

app.use(morgan('dev'));                                     // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(protectJSON); // is needed?!

app.use(flash());
app.use(express.cookieParser(config.server.cookieSecret));  // Hash cookies with this secret
app.use(express.cookieSession());                           // Store the session in the (secret) cookie
app.use(passport.initialize());                             // Initialize PassportJS
app.use(passport.session());                                // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
//app.use(xsrf); // is needed??!                            // Add XSRF checks to the request
security.initialize(config.mongo.dbUrl, config.mongo.apiKey, config.security.dbName, config.security.usersCollection); // Add a Mongo strategy for handling the authentication

// connect mongodb
mongoose.connect('mongodb://localhost/nodethatdb'); // connect to our database

// Routing
// =============================================================================
// Security checks
app.all('/api/security', function(req, res, next) {
  console.log('check /api/security');
  // Free for all
  next();
});
app.all('/public', function(req, res, next) {
  console.log('check /public');
  // Free for all
  next();
});
app.all('/*', function(req, res, next) {
  console.log('check /*');
  // We require the user is authenticated to execute any action except login
  //security.authenticationRequired(req, res, next);
});

// Routing around
require('./app/routes/appFile')(app, config);
require('./app/routes/static')(app, config);
// app.* style
app.namespace('/api/security', function () { require('./app/routes/security')(app, config); });
// route style
app.use('/api/tasks',            require('./app/routes/tasks'));
app.use('/api/tasks',            require('./app/routes/task'));
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