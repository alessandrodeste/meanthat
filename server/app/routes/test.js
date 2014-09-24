
var express  = require('express'); 		// call express
var router   = express.Router(); 		// get an instance of the express Router
var Task     = require('../models/task.js');
var security = require('../security/security');

// on routes that end in /tasks
// ----------------------------------------------------
router.route('/')

    .get(function(req, res) {
      console.log("ping");
      res.json({message: "pong"});
    });

module.exports = router;