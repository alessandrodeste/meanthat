meanthat
========

MEAN stack project playground. *just for fun.*

## Goals

1. Test Angular.js libraries
    - sub-goal: I miss AMD module... 
2. Test Node.js libraries
3. Test Grunt magics
4. Learn tests driven tools
5. Learn mongodb security and pattern
6. Test yo integrations

## Status

It's partially working
- client side:
    - grunt compile status: OK
    - CRUD demo module (aka tasks) in progress
    - google oauth2 authentication (full client) is implemented, refactor needed
    - authentication token
    - routing with ui-router
- server side:
    - working status: OK
    - authentication in progress
    - CRUD demo module (aka tasks) in progress

## TODO

- client
    - [ ] security
    - [ ] services (first taste)
    - [ ] notifications
    - [ ] i18n
    - [ ] use promises/queues on services request
- server
    - [ ] security local
    - [ ] service task
    - [ ] service user
    - [ ] use mongolab
    - [ ] try couchdb

## To Run

1. configurations:
    1. cp server/config.js.ori server/config.js
    2. cp client/app/src/config.js.ori client/app/src/config.js
2. install packages:
    1. /server/npm install
    2. /client/npm install
    3. /client/bower install
3. install client:
    1. /client/grunt default
4. install and start mongodb
5. install server:
    1. /server/node initDb.js
6. start server:
    1. /server/node server.js

## Thank you time

### AngularJs
- [Angular-App](https://github.com/angular-app/angular-app) great project scaffolding 
- [Devsmash](http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose) nice implementation

### NodeJs
- [Passport flow overview](http://toon.io/understanding-passportjs-authentication-flow/) great guide
- [Token!](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) Great token example

### SPA Authentication
- [Satelizer](https://github.com/sahat/satellizer) Best SPA Social Authentication help!
- [SPA auth](http://www.webdeveasy.com/single-page-application-authentication/)
- [AngularJS: Google+ Sign In Integration](https://blog.codecentric.de/en/2014/06/angularjs-google-sign-integration/)
- [Witold Szczerba](https://github.com/witoldsz/angular-http-auth)
- [authentication SPA](http://madhatted.com/2014/6/17/authentication-for-single-page-apps)
- [angular-oauth](https://github.com/enginous/angular-oauth)

### G+ login
- [google-api-nodejs-client](https://github.com/google/google-api-nodejs-client/)
- [SignIn Button](http://garage.socialisten.at/2013/03/hacking-google-plus-the-sign-in-button/)
- [G+ Angular JS Integration](https://blog.codecentric.de/en/2014/06/angularjs-google-sign-integration/)
- [Node authentication](http://scotch.io/tutorials/javascript/easy-node-authentication-linking-all-accounts-together)

### future reading, security issues:
- [csrf and node](http://sporcic.org/2012/06/csrf-with-nodejs-and-express/)
- [csrf and SPA](http://www.mircozeiss.com/lockit-050-auth-for-single-page-apps-and-csrf/)
- [secure spa](http://danielstudds.com/setting-up-passport-js-secure-spa-part-1/)
- [JWT](http://jwt.io/)