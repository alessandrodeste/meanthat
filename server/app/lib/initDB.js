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
        
        initDB.adminUser = new initDB.User({
            //initDB.adminUser.id = 'admin';
        	username: 'admin',
        	role: 10,
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
        
    }
};

module.exports = initDB;

