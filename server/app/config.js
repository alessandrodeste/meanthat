var path = require('path');

module.exports = {
  mongo: {
    dbUrl: 'https://api.mongolab.com/api/1',            // The base url of the MongoLab DB server
    apiKey: '16NtN8-wSxdVnzJspLvwzQU2iE9HgAHW'          // Our MongoLab API key
  },
  security: {
    dbName: 'nodethatdb',                               // The name of database that contains the security information
    usersCollection: 'users'                            // The name of the collection contains user information
  },
  server: {
    listenPort: process.env.PORT || 3000,               // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    securePort: 8433,                                   // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
    ip: process.env.IP || "0.0.0.0",
    distFolder: path.resolve(__dirname, '../public/'),  // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    staticUrl: '/',                               // The base url from which we serve static files (such as js, css and images)
    cookieSecret: 'angular-app'                         // The secret for encrypting the cookie
    
  }
};