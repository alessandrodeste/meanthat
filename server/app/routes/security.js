

var express = require('express'); 		// call express
var router  = express.Router(); 		// get an instance of the express Router


router.route('/login').post(function(req, res) {
	//security.login
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

module.exports = router;