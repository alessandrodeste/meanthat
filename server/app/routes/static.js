var express = require('express');
var compression = require('compression')

module.exports =function(app, config) {
    // Serve up the favicon
    //app.use(express.favicon(config.server.distFolder + '/favicon.ico'));
    
    var oneDay = 86400000;
    
    // First looks for a static file: index.html, css, images, etc.
    app.use(config.server.staticUrl, compression());
    app.use(config.server.staticUrl, express.static(config.server.distFolder), { maxAge: oneDay });
    app.use(config.server.staticUrl, function(req, res, next) {
        res.send(404); // If we get here then the request for a static file is invalid
    });
};