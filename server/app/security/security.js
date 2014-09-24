
// load up the user model
var User = require('../models/user');

var security = {
  authenticationRequired: function(req, res, next) {
    console.log('authRequired');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json(401, User.filterOutputUser(req.user));
    }
  },
  adminRequired: function(req, res, next) {
    console.log('adminRequired');
    if (req.user && req.user.admin ) {
      next();
    } else {
      res.json(401, User.filterOutputUser(req.user));
    }
  }
};

module.exports = security;