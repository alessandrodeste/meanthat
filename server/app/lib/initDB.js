// code for initializing the DB w/ an admin user

var mongoose     = require('mongoose');


var initDB = {
    
    User: null,
    adminUser: null, 

    initialize: function(config) {
        initDB.apiKey = config.mongo.apiKey;
        initDB.baseUrl = config.mongo.dbUrl + '/databases/' + config.security.dbName + '/collections/';
        initDB.usersCollection = config.security.usersCollection;
        
        mongoose.connect('mongodb://' + config.mongo.dbUrl + '/' + config.security.dbName); // connect to our database
        initDB.User = require('../models/user');
        initDB.Task = require('../models/task');
        
        initDB.adminUser = new initDB.User({
            //initDB.adminUser.id = 'admin';
        	username: 'admin',
        	role: 10,
        	email: 'admin@abc.com',
        	local: {email: 'admin@abc.com', password: 'admin'}
        });
    },
  
    addAdminUser: function(done) {
        var query = initDB.User.findOne({username:'admin'});
        query.exec(function (err, person) {
            if (err) console.log("ERRORE:", err);
            console.log(person);
            if (!person) {
                console.log('Creating new Admin User');
                initDB.adminUser.save();
                console.log('Created new Admin User');
            } else {
                console.log('Admin User already present');
            }
        });
        
    },
    
    addTasks: function(done) {
        var task; 
        task = new initDB.Task({
        	user: 'admin',
            title: 'Task 1 Test',
            descr: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
            tags: ['test', 'first'],
            fg_close: false,
            fg_archived: false
        });
        task.save();
        console.log('Created new Task');
           
        task = new initDB.Task({
        	user: 'admin',
            title: 'Task 2 Test',
            descr: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
            tags: ['test', 'first'],
            fg_close: false,
            fg_archived: false
        });
        task.save();
        console.log('Created new Task');
    }
};

module.exports = initDB;

