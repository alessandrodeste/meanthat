exports.addRoutes = function(app, config) {
  
  
  app.use(function(req, res, next) {
    if ( req.user ) {
      console.log('Current User:', req.user.firstName, req.user.lastName);
    } else {
      console.log('Unauthenticated');
    }
    next();
  });
};