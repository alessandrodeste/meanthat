// appFile.js


module.exports = function(app, config) {
     
    // cross domain xhr
    app.all('*', function(req, res, next) {
        if(req.method==='OPTIONS') {
        	console.log("option");
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "X-Requested-With");
          res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
          res.header("X-Powered-By",' 3.2.1');
          res.header("Content-Type", "application/json;charset=utf-8");
          res.send(200);
        } else {
        	console.log(req.method);
          next();
        }
    });
    
  app.use(function(req, res, next) {
    if ( req.user ) {
      console.log('Current User:', req.user.firstName, req.user.lastName);
    } else {
      console.log('Unauthenticated');
    }
    next();
  });
};

