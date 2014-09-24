meanthat
========

This is a prototype of mean stack project. *For now, just an experiment.*

## What's working now?

- [ ] server (started)
- [ ] mongodb init (not started)
- [ ] client (not started)

## Goals

1. Find a compromise on folder/file organization
2. Try mongodb security and pattern
3. Configure Grunt to test his magics
4. Have a structured project to start others (no, I will not use yo for now)
5. Keep a repository to test new patterns or libraries

## What is not?

- it is not yo scaffolding

## TODO

- [ ] client
    - [ ] security
    - [ ] services (first taste)
    - [ ] notifications
- [ ] server
    - [ ] security local
    - [ ] security oauth2 google service (passport)
    - [ ] service task
    - [ ] service user
    - [ ] service tag_hierarchy
- [ ] remove useless comment

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

I thank: 
- [Angular-App](https://github.com/angular-app/angular-app) project
- [Devsmash](http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose)
- [Passport authentication flow overview](http://toon.io/understanding-passportjs-authentication-flow/)

- [Token!](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)

- [SPA auth](http://www.webdeveasy.com/single-page-application-authentication/)
- [AngularJS: Google+ Sign In Integration](https://blog.codecentric.de/en/2014/06/angularjs-google-sign-integration/)
- All nodejs/angularjs modules teams! :D


http://madhatted.com/2014/6/17/authentication-for-single-page-apps
https://github.com/enginous/angular-oauth
https://github.com/sahat/satellizer

- [Witold Szczerba](https://github.com/witoldsz/angular-http-auth)
