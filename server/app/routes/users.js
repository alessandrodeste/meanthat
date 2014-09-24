var express  = require('express'); 		// call express
var router   = express.Router(); 		// get an instance of the express Router
var security = require('../security/security');

// Call models
var User     = require('../models/user.js');

// FIXME: protect, only admin

router.route('/')

	.get(security.authenticationRequired, function(req, res) {
		User.find(function(err, task) {
			if (err) { res.send(err); }
			res.json(task);
		});
	});

module.exports = router;