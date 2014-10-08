// routes/security.js

var passport    = require('passport');
var jwt         = require('jsonwebtoken');
var request     = require('request');
var User        = require('../models/user');
var security    = require('../security/security');
var config 	    = require('../../config.js');

module.exports = function(app) {

    //-------------------------------------------------------------------
    // Execute logout // FIXME
    //-------------------------------------------------------------------
    app.get('/logout', function(req, res) {
        req.logout();
        res.send(200);
    });
    
    //-------------------------------------------------------------------
    // Ping if is logged in // FIXME
    //-------------------------------------------------------------------
    app.get('/api/secured/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? { 'user': req.user } : '0');
    });
    
    //-------------------------------------------------------------------
    // Execute login - POST
    //-------------------------------------------------------------------
    app.post('/login', function(req, res, next) {

        var password = req.body.password;
        var email = req.body.email;

        // Use lower-case e-mails to avoid case-sensitive e-mail matching
        if (email) {email = email.toLowerCase(); }

        // asynchronous
        process.nextTick(function() {

            // attempt to authenticate user
            User.getAuthenticated(email, password, function(err, user, reason) {

                if (err) {
                    return res.status(400).send( err.message );
                }

                // login was successful if we have a user
                if (user) {
                    return res.send({ token: security.createToken(user) });
                }

                // otherwise we can determine why we failed
                var reasons = User.failedLogin;
                switch (reason) {
                    case reasons.MAX_ATTEMPTS:
                        // send email or otherwise notify user that account is
                        // temporarily locked
                        return res.status(400).send({ message: 'Login Error: user blocked' });
                    default:
                    case reasons.NOT_FOUND:
                    case reasons.PASSWORD_INCORRECT:
                        // note: these cases are usually treated the same - don't tell
                        // the user *why* the login failed, only that it did
                        return res.status(400).send({ message: 'Login Error: check user and password' });
                }
            });
        });

    });
    
    //-------------------------------------------------------------------
    // Execute signup - POST // FIXME
    //-------------------------------------------------------------------
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    
    //-------------------------------------------------------------------
    // Check token recieved from client
    //-------------------------------------------------------------------
    app.post('/auth/google/callback', function(req, res, next) {
         
            var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
            
            /*
            //var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
            var params = {
                client_id:      req.body.client_id,
                client_secret:  config.external_api.googleAuth.clientSecret,
                code:           req.body.access_token,
                //redirect_uri:   config.external_api.googleAuth.callbackURL, 
                grant_type:     'authorization_code'
            };*/
            
            var accessTokenUrl = 'https://www.googleapis.com/oauth2/v1/tokeninfo';
            var params = {
                client_id:      req.body.client_id,
                access_token:   req.body.access_token
            };
            
            // Step 1. Exchange authorization code for access token.
            request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
            
                //var accessToken = token.access_token;
                var accessToken = req.body.access_token;
                var headers = { Authorization: 'Bearer ' + accessToken };
                
                // Step 2. Retrieve profile information about the current user.
                request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
                
                    // Step 3a. Link user accounts.
                    if (req.headers.authorization) {
                        User.findOne({ 'google.id': profile.sub }, function(err, existingUser) {
                            if (existingUser) {
                                return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
                            }
                        
                            var token = req.headers.authorization.split(' ')[1];
                            var payload = jwt.decode(token, config.TOKEN_SECRET);
                        
                            User.findById(payload.sub, function(err, user) {
                                if (!user) {
                                    return res.status(400).send({ message: 'User not found' });
                                }
                                
                                // Save google user
                                user.google.id = profile.sub;
                                user.username = user.displayName || profile.name;
                                user.name = user.displayName || profile.name;
                                user.email = profile.email;
                                user.save(function(err) {
                                    res.send({ token: security.createToken(user) });
                                });
                            });
                        });
                    } else {
                        // Step 3b. Create a new user account or return an existing one.
                        User.findOne(
                            { 'google.id': profile.sub }, 
                            function(err, existingUser) {
                                if (existingUser) {
                                    var security_token = security.createToken(existingUser);
                                    return res.send({ token: security_token });
                                }
                            
                                var user = new User();
                                user.google.id = profile.sub;
                                user.username = profile.name;
                                user.name = profile.name;
                                user.email = profile.email;
                                user.save(function(err) {
                                    res.send({ token: security.createToken(user) });
                                });
                            }
                        );
                    }
                });
            });
    });

    
    
    // google ---------------------------------
    // send to google to do the authentication
    //app.get('/auth/google', passport.authenticate('google', {
    //    scope: ['profile', 'email']
    //}));
    
    
       /*
    app.get('/auth/google/callback',
       function(req, res, next) {
          passport.authenticate('google', {session: false}, 
            function(err, user, info) {
                if (err) { return next(err); }
                if (!user) { return res.send(401); }
                
                // We are sending the profile inside the token
                var token = jwt.sign(user, config.server.tokenSecret, { expiresInMinutes: 60*5 });
                
                console.log("callback log");
                console.log(token);
                
                res.json({ token: token });
            })(req, res, next);
       });

 
    app.get('/auth/google/callback', 
        function(req, res, next) {
            passport.authenticate('google', function(err, user, info) {
                if (err) {
                  return next(err); // will generate a 500 error
                }
                if (!user) {
                  return res.redirect('/');
                }
                return res.redirect('/');
            });//(req, res, next);
    });*/
   
   /*
   app.get('/auth/google/callback', 
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });
  */
    
    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================
    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', {
            message: req.flash('loginMessage')
        });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    
    /*
    // google ---------------------------------
    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', {
        scope: ['profile', 'email']
    }));
    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));
        */
    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future
    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
    /*
    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });*/
};
/*
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
*/