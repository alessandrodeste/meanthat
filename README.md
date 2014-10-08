meanthat
========

This is a prototype of mean stack project. *For now, just for fun.*

## Status

Is NOT working

## Goals

1. [ ] Find a compromise on folder/file organization
2. [ ] Try mongodb security and pattern
3. [ ] Configure Grunt to test his magics
4. [ ] Have a structured project to start others (no, I will not use yo for now)
5. [ ] Keep a repository to test new patterns or libraries

## What is not?

- it is not yo scaffolding

## TODO

- [ ] client
    - [ ] security
    - [ ] services (first taste)
    - [ ] notifications
- [ ] server
    - [ ] security local
    - [ ] security oauth2 google service
    - [ ] service task
    - [ ] service user

## To Run

1. configurations
    1. server/config.js.ori to server/config.js
    2. client/app/src/config.js.ori to client/app/src/config.js
2. start mongodb
3. /server/npm install
4. /client/npm install
5. /client/grunt default
6. /server/node initDb.js
7. /server/node server.js

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