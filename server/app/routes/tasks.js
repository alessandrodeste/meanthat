var express = require('express'); 		// call express
var router  = express.Router(); 		// get an instance of the express Router

// Call models
var Task     = require('../models/task.js');

exports.addRoutes = function(app, config) {
        
    // on routes that end in /tasks
    // ----------------------------------------------------
    router.route('/tasks')
    
    	// create a task (accessed at POST http://localhost:8080/api/tasks)
    	.post(function(req, res) {
    		
    		var task = new Task();
    		task.descr = req.body.descr;  
    		task.uid = req.body.uid;  
    
    		// save the task and check for errors
    		task.save(function(err) {
    			if (err) { res.send(err); }
    			res.json({ message: 'task created!' });
    		});
    	
    		
    	})
    	
    	.get(function(req, res) {
    		Task.find(function(err, task) {
    			if (err) { res.send(err); }
    			res.json(task);
    		});
    	});
    
    router.route('/tasks/:task_id')
    
        // get the task with that id (accessed at GET http://localhost:8080/api/tasks/:task_id)
        .get(function(req, res) {
        	Task.findById(req.params.task_id, function(err, task) {
        		if (err) { res.send(err); }
        		res.json(task);
        	});
        })
        
        // update the task with this id (accessed at PUT http://localhost:8080/api/tasks/:task_id)
    	.put(function(req, res) {
    
    		// use our task model to find the task we want
    		Task.findById(req.params.task_id, function(err, task) {
    
    			if (err) { res.send(err); }
    
    			task.descr = req.body.descr; 	// update the task info
    			task.uid = req.body.uid;  
    			
    			// save the task
    			task.save(function(err) {
    				if (err) { res.send(err); }
    
    				res.json({ message: 'Task updated!' });
    			});
    
    		});
    	})
    	
    	// delete the task with this id (accessed at DELETE http://localhost:8080/api/tasks/:task_id)
    	.delete(function(req, res) {
    		Task.remove({
    			_id: req.params.task_id
    		}, function(err, task) {
    			if (err) { res.send(err); }
    
    			res.json({ message: 'Successfully deleted' });
    		});
    	});

    app.use('/api', router);
};