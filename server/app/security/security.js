// security/security.js

var moment      = require('moment');
var jwt         = require('jsonwebtoken');
var request     = require('request');
var config 	    = require('../../config.js');
var User        = require('../models/user');

var security = {
    
    //-------------------------------------------------------------------
    // Only authenticated users Middleware
    //-------------------------------------------------------------------
    authenticationRequired: function(req, res, next) {
        console.log('authRequired');
        if (req.isAuthenticated()) {
          next();
        } else {
          res.json(401, User.filterOutputUser(req.user));
        }
    },
    //-------------------------------------------------------------------
    // Only admin users Middleware
    //-------------------------------------------------------------------
    adminRequired: function(req, res, next) {
        console.log('adminRequired');
        if (req.user && req.user.admin ) {
          next();
        } else {
          res.json(401, User.filterOutputUser(req.user));
        }
    },
    //-------------------------------------------------------------------
    // Generate JSON Web Token
    //-------------------------------------------------------------------
    createToken: function(user) {
        var profile = {
            username: user.username,
            email: user.email,
            id: user.id
        };
        
        // We are sending the profile inside the token
        var token = jwt.sign(profile, config.server.tokenSecret, { expiresInMinutes: 60*5 });
        
        return token;
    },
    
    //-------------------------------------------------------------------
    // Local strategies
    //-------------------------------------------------------------------
    local: {
        
        //-------------------------------------------------------------------
        // Execute login
        //-------------------------------------------------------------------
        login: function(req, res, next) {

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
                            return res.status(400).send({ message: 'User blocked' });
                        default:
                        case reasons.NOT_FOUND:
                        case reasons.PASSWORD_INCORRECT:
                            // note: these cases are usually treated the same - don't tell
                            // the user *why* the login failed, only that it did
                            return res.status(400).send({ message: 'Check user and password' });
                    }
                });
            })
        },
        
        //-------------------------------------------------------------------
        // Execute Signup
        //-------------------------------------------------------------------
        signup: function(req, res, next) {
    
            var password = req.body.password;
            var email = req.body.email;
    
            // Use lower-case e-mails to avoid case-sensitive e-mail matching
            if (email) {email = email.toLowerCase(); }
    
            // asynchronous
            process.nextTick(function() {
    
                // if the user is not already logged in:
                if (!req.user) {
                    User.findOne({ 'local.email': email }, function(err, user) {
                        
                        // if there are any errors, return the error
                        if (err) {
                            return res.status(400).send( err.message );
                        }
                        // check to see if theres already a user with that email
                        if (user) {
                            return res.status(400).send( { message: 'That email is already taken.' } );
                            
                        } else {
                            // create the user
                            var newUser = new User();
                            newUser.role = 1;
                            newUser.username = email;
                            newUser.email = email;
                            newUser.local.email = email;
                            newUser.local.password = password;
                            newUser.save(function(err) {
                                if (err) {    
                                    return res.status(400).send( err.message );
                                }
                                return res.send({ token: security.createToken(newUser) });
                            });
                        }
                    });
                }
                
                // if the user is logged in but has no local account...
                else if (!req.user.local.email) {
                    
                    // ...presumably they're trying to connect a local account
                    var user = req.user;
                    user.local.email = email;
                    user.local.password = user.generateHash(password);
                    user.save(function(err) {
                        if (err) {
                            return res.status(400).send( err.message );
                        }
                        return res.send({ token: security.createToken(user) });
                    });
                }
                else {
                    // user is logged in and already has a local account
                    return res.status(200).send( { message: 'Already signed up' } );
                }
            })
    
        }
        
    }, // End local strategies
  
    //-------------------------------------------------------------------
    // Google strategies
    //-------------------------------------------------------------------
    google: {
        
        //-------------------------------------------------------------------
        // Google login callback
        //-------------------------------------------------------------------
        callback: function(req, res, next) {
         
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
        }
    } // End google strategies

   /*
// Login Required Middleware
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    
    if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
    }
    
    req.user = payload.sub;
    next();
}
*/
};

module.exports = security;