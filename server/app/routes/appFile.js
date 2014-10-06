// appFile.js
var config 	     = require('../../config.js');

module.exports = function(app) {
    // This route deals enables HTML5Mode by forwarding missing files to the index.html
    // Security: Free4All
    app.all('/*', function(req, res) {
      // Just send the index.html for other files to support HTML5Mode
      res.sendfile('index.html', { root: config.server.distFolder });
    });
};

