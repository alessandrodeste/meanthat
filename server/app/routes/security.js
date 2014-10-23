// routes/security.js

var passport    = require('passport');
var jwt         = require('jsonwebtoken');
var User        = require('../models/user');
var security    = require('../security/security');
var config 	    = require('../../config.js');

module.exports = function(app) {

    //-------------------------------------------------------------------
    // Execute logout // FIXME
    //-------------------------------------------------------------------
    app.get('/logout', function(req, res) {
        // FIXME: token is still in memory... how can I revoke it?
        req.logout();
        res.send(200);
    });
    
    //-------------------------------------------------------------------
    // Ping if is logged in
    //-------------------------------------------------------------------
    app.get('/api/secured/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? { 'user': req.user } : '0');
    });
    
    //-------------------------------------------------------------------
    // Execute login - POST
    //-------------------------------------------------------------------
    app.post('/login', security.local.login);
    
    //-------------------------------------------------------------------
    // Execute signup - POST // FIXME: send password via mail
    //-------------------------------------------------------------------
    app.post('/signup', security.local.signup);
    
    //-------------------------------------------------------------------
    // Check token recieved from client
    //-------------------------------------------------------------------
    app.post('/auth/google/callback', security.google.callback);

    
    
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
    /*
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
    */
    
    
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
    /*
    app.get('/unlink/local', function(req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
    
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