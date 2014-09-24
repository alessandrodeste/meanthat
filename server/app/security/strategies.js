// strategies.js


// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../models/user');

module.exports = function(passport, configAuth) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializeUser: ' + user.id);
        done(null, user.id);
        //done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser: ' + id);
        User.findById(id, function(err, user){
            console.log('deserializeUser found:', user);
            if(!err) done(null, user);
            else done(err, null)  
        });
    });
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function() {
                
                // attempt to authenticate user
                User.getAuthenticated(email, password, function(err, user, reason) {
                    if (err) 
                        return done(err);
            
                    // login was successful if we have a user
                    if (user) {
                        // handle login success
                        console.log('login success');
                        return done(null, user);
                    }
            
                    // otherwise we can determine why we failed
                    var reasons = User.failedLogin;
                    switch (reason) {
                        case reasons.NOT_FOUND:
                            // return done(null, false, req.flash('loginMessage', 'No user found.'));
                        case reasons.PASSWORD_INCORRECT:
                            // note: these cases are usually treated the same - don't tell
                            // the user *why* the login failed, only that it did
                            //return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                            return done(null, false, req.flash('loginMessage', 'Login Error: check user and password'));
                        case reasons.MAX_ATTEMPTS:
                            // send email or otherwise notify user that account is
                            // temporarily locked
                            return done(null, false, req.flash('loginMessage', 'Login Error: user blocked'));
                    }
                });
            });
        }));
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function() {
                // TODO: move to model.user
                // if the user is not already logged in:
                if (!req.user) {
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);
                        // check to see if theres already a user with that email
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        }
                        else {
                            // create the user
                            var newUser = new User();
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.save(function(err) {
                                if (err)
                                    return done(err);
                                return done(null, newUser);
                            });
                        }
                    });
                    // if the user is logged in but has no local account...
                }
                else if (!req.user.local.email) {
                    // ...presumably they're trying to connect a local account
                    var user = req.user;
                    user.local.email = email;
                    user.local.password = user.generateHash(password);
                    user.save(function(err) {
                        if (err)
                            return done(err);
                        return done(null, user);
                    });
                }
                else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }
            });
        }));
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
            clientID: configAuth.external_api.googleAuth.clientID,
            clientSecret: configAuth.external_api.googleAuth.clientSecret,
            callbackURL: configAuth.external_api.googleAuth.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function() {
                
                // check if the user is already logged in
                if (!req.user) {
                    User.findOne({
                        'google.id': profile.id
                    }, function(err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.google.token) {
                                user.google.token = token;
                                user.google.name = profile.displayName;
                                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                                user.save(function(err) {
                                    if (err)
                                        return done(err);
                                    return done(null, user);
                                });
                            }
                            return done(null, user);
                        }
                        else {
                            var newUser = new User();
                            newUser.google.id = profile.id;
                            newUser.google.token = token;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                            newUser.save(function(err) {
                                if (err)
                                    return done(err);
                                return done(null, newUser);
                            });
                        }
                    });
                }
                else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session
                    user.google.id = profile.id;
                    user.google.token = token;
                    user.google.name = profile.displayName;
                    user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                    user.save(function(err) {
                        if (err)
                            return done(err);
                        return done(null, user);
                    });
                }
            });
        }));
};