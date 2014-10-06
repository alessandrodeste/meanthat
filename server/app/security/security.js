// security/security.js

var User        = require('../models/user');
var moment      = require('moment');
var jwt         = require('jsonwebtoken');
var config 	    = require('../../config.js');

var security = {
    
    //-------------------------------------------------------------------
    // Only authenticated users Middleware
    //-------------------------------------------------------------------
    authenticationRequired: function(req, res, next) {
        console.log('authRequired');
        if (req.isAuthenticated()) {
          next();
        } else {
          res.json(401, User.filterOutputUser(req.user));
        }
    },
    //-------------------------------------------------------------------
    // Only admin users Middleware
    //-------------------------------------------------------------------
    adminRequired: function(req, res, next) {
        console.log('adminRequired');
        if (req.user && req.user.admin ) {
          next();
        } else {
          res.json(401, User.filterOutputUser(req.user));
        }
    },
    //-------------------------------------------------------------------
    // Generate JSON Web Token
    //-------------------------------------------------------------------
    createToken: function(user) {
        var profile = {
            username: user.username,
            email: user.email,
            id: user.id
        };
        
        // We are sending the profile inside the token
        var token = jwt.sign(profile, config.server.tokenSecret, { expiresInMinutes: 60*5 });
        
        return token;
    }
  
   /*
// Login Required Middleware
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    
    if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
    }
    
    req.user = payload.sub;
    next();
}
*/
};

module.exports = security;