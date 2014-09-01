var express = require('express'); // call express
var router = express.Router(); // get an instance of the express Router

// Call models
var Task = require('../models/task.js');
/*
// route middleware to validate :name
router.param('task_id', function(req, res, next, name) {
	// do validation on name here
	// blah blah validation
	// log something so we know its working
	console.log('doing name validations on ' + name);

	// once validation is done save the new item in the req
	req.name = name;
	// go to the next thing
	next();	
});
*/
router.route('/:task_id')

// get the task with that id (accessed at GET http://localhost:8080/api/tasks/:task_id)
.get(function(req, res) {
	Task.findById(req.params.task_id, function(err, task) {
		if (err) {
			res.send(err);
		}
		res.json(task);
	});
})

// update the task with this id (accessed at PUT http://localhost:8080/api/tasks/:task_id)
.put(function(req, res) {

	// use our task model to find the task we want
	Task.findById(req.params.task_id, function(err, task) {

		if (err) {
			res.send(err);
		}

		task.descr = req.body.descr; // update the task info
		task.uid = req.body.uid;

		// save the task
		task.save(function(err) {
			if (err) {
				res.send(err);
			}

			res.json({
				message: 'Task updated!'
			});
		});

	});
})

// delete the task with this id (accessed at DELETE http://localhost:8080/api/tasks/:task_id)
.delete(function(req, res) {
	Task.remove({
		_id: req.params.task_id
	}, function(err, task) {
		if (err) {
			res.send(err);
		}

		res.json({
			message: 'Successfully deleted'
		});
	});
});

module.exports = router;