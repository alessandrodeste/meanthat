var express = require('express'); 		// call express
var router  = express.Router(); 		// get an instance of the express Router

// Call models
var User     = require('../models/user.js');

router.route('/')

    // get the task with that id (accessed at GET http://localhost:8080/api/tasks/:task_id)
    .get(function(req, res) {
    	User.findById(req.params.user_id, function(err, task) {
    		if (err) { res.send(err); }
    		res.json(task);
    	});
    })
    
    // update the task with this id (accessed at PUT http://localhost:8080/api/tasks/:task_id)
	.put(function(req, res) {

		
	})
	
	// delete the task with this id (accessed at DELETE http://localhost:8080/api/tasks/:task_id)
	.delete(function(req, res) {
		
	});

module.exports = router;