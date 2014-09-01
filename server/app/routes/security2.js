

var express = require('express'); 		// call express
var router  = express.Router(); 		// get an instance of the express Router
var passport = require('passport');


router.route('/login').post(function(req, res, next) {
	function authenticationFailed(err, user, info){
      if (err) { return next(err); }
      if (!user) { return res.json(filterUser(user)); }
      req.logIn(user, function(err) {
        if ( err ) { return next(err); }
        return res.json(filterUser(user));
      });
    }
    return passport.authenticate(MongoStrategy.name, authenticationFailed)(req, res, next);
});

router.route('/logout').post(function(req, res) {
	//security.logout
});
    
router.route('/current-user').get(function(req, res) {
	//security.sendCurrentUser
});

// Retrieve the current user only if they are authenticated
router.route('/authenticated-user').get(function(req, res) {
  //security.authenticationRequired(req, res, function() { security.sendCurrentUser(req, res); });
});

// Retrieve the current user only if they are admin
router.route('/admin-user').get(function(req, res) {
  // security.adminRequired(req, res, function() { security.sendCurrentUser(req, res); });
});

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
//app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
//    app.get('/auth/google/callback',
        //passport.authenticate('google', {
          //      successRedirect : '/profile',
          //      failureRedirect : '/'
        //}));
    /*        
// output            
  // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });
    */
module.exports = router;