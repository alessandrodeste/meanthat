var express  = require('express'); 		// call express
var router   = express.Router(); 		// get an instance of the express Router
var Task     = require('../models/task.js');
var security = require('../security/security');

// on routes that end in /tasks
// ----------------------------------------------------
router.route('/')

	// create a task (accessed at POST http://localhost:8080/api/tasks)
	.post(security.authenticationRequired , function(req, res) {
		
		var task = new Task();
		task.descr = req.body.descr;  
		task.uid = req.body.uid;  

		// save the task and check for errors
		task.save(function(err) {
			if (err) { res.send(err); }
			res.json({ message: 'task created!' });
		});
	})
	
	.get(security.authenticationRequired, function(req, res) {
		Task.find(function(err, task) {
			if (err) { res.send(err); }
			res.json(task);
		});
	});

module.exports = router;