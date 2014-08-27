// CrossDomain XmlHttpRequest

var express = require('express'); 		// call express
var router  = express.Router(); 		// get an instance of the express Router

exports.addRoutes = function(app, config) {

    
    // Risoluzione cross domain
    router.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By",' 3.2.1');
        res.header("Content-Type", "application/json;charset=utf-8");
        if(req.method==='OPTIONS') {
        	console.log("option");
          res.send(200);
        } else {
        	console.log(req.method);
          next();
        }
    });

};