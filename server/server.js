// server.js

// BASE SETUP
// =============================================================================
var express      = require('express');
var app          = express(); 				
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var mongoose     = require('mongoose');
var config 	     = require('./config.js');
var passport     = require('passport');
var morgan       = require('morgan');
var flash        = require('connect-flash');
var expressJwt   = require('express-jwt'); // token

//var protectJSON= require('./app/security/protectJSON');
//var path       = require('path'); 
//var xsrf       = require('./app/security/xsrf');
//var namespace  = require('express-namespace');

// app.use(protectJSON); // is needed?!
app.use(morgan('dev'));                                     // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(cookieParser(config.server.cookieSecret));                                    // read cookies (needed for auth)
app.use(session({ secret: config.server.cookieSecret, cookie: { secure: true } }));   // session secret
app.use(passport.initialize());                             // Initialize PassportJS
app.use(passport.session());                                // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
//app.use(xsrf);                                            // Add XSRF checks to the request

// connect mongodb
// TODO: move to mongolab 
mongoose.connect('mongodb://' + config.mongo.dbUrl + '/' + config.security.dbName); // connect to our database

// Routing
// =============================================================================
// We are going to protect /api routes with JWT
app.use('/api/secured', expressJwt({secret: config.server.tokenSecret}));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send(401, 'Invalid token');
    }
});

//require('./app/security/strategies')(passport, config); // init passport strategies
require('./app/routes/security')(app);
require('./app/routes/cors')(app);
require('./app/routes/static')(app);

app.use('/api/test',                    require('./app/routes/test'));
app.use('/api/secured/tasks',           require('./app/routes/tasks'));
app.use('/api/secured/tasks',           require('./app/routes/task'));
app.use('/api/secured/users',           require('./app/routes/users'));
app.use('/api/secured/users/:user_id',  require('./app/routes/user'));

require('./app/routes/appFile')(app);

// START THE SERVER
// =============================================================================
app.listen(config.server.listenPort, config.server.ip, function(){
  //var addr = router.address();
  console.log("Server listening at", config.server.ip, ":", config.server.listenPort);
  
  // Open default page
  var open = require('open');
  open('http://' + config.server.ip + ':' + config.server.listenPort + '/');
});
