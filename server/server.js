// server.js


// BASE SETUP
// =============================================================================
var express      = require('express');
var app          = express(); 				
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var mongoose     = require('mongoose');
var config 			 = require('./config.js');
var passport     = require('passport');
var morgan       = require('morgan');
var flash        = require('connect-flash');
//var protectJSON  = require('./app/security/protectJSON');
//var path         = require('path'); 
//var xsrf       = require('./app/security/xsrf');
//var namespace    = require('express-namespace');

// app.use(protectJSON); // is needed?!
app.use(morgan('dev'));                                     // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(cookieParser(config.server.cookieSecret));                                    // read cookies (needed for auth)
app.use(session({ secret: config.server.cookieSecret, cookie: { secure: true } }));   // session secret
app.use(passport.initialize());                             // Initialize PassportJS
app.use(passport.session());                                // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
//app.use(xsrf); // is needed??!                            // Add XSRF checks to the request

// init passport strategies
require('./app/security/strategies')(passport, config);

// connect mongodb
// TODO: move to mongolab 
mongoose.connect('mongodb://' + config.mongo.dbUrl + '/' + config.security.dbName); // connect to our database

// Routing
// =============================================================================
app.get('/ping', function(req, res) {
  console.log("ping");
  res.json({message: "pong"});
});

//
// Routing around
//
require('./app/routes/security')(app, config);
require('./app/routes/cors')(app, config);
require('./app/routes/static')(app, config);

app.use(function(req, res, next) {
  if (req.isAuthenticated()  ) { // req.user
    console.log('Current User:', req.user.firstName, req.user.lastName);
  } else {
    console.log('Unauthenticated');
  }
  next();
});


app.use('/api/tasks',            require('./app/routes/tasks'));
app.use('/api/tasks',            require('./app/routes/task'));
app.use('/api/users',            require('./app/routes/users'));
app.use('/api/users/:user_id',   require('./app/routes/user'));

require('./app/routes/appFile')(app, config);

// START THE SERVER
// =============================================================================
app.listen(config.server.listenPort, config.server.ip, function(){
  //var addr = router.address();
  console.log("Server listening at", config.server.ip, ":", config.server.listenPort);
  
  // Open default page
  var open = require('open');
  open('http://' + config.server.ip + ':' + config.server.listenPort + '/');
});


/*

per la sicurezza: 

https://blog.liftsecurity.io/tag/headers
 
https://github.com/strongloop/express/blob/master/examples/route-middleware/index.js

https://github.com/strongloop/express/blob/master/examples/auth/app.js

http://www.sitepoint.com/local-authentication-using-passport-node-js/

*/