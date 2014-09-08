

angular.module('services', ['ngResource'])

    .factory('VariablesService', function() {
        return {
            debugService : '?referer=' + (window.location.hostname === "localhost" ? "pippo" : window.location.hostname)
        };
    })

// Define the API

    .factory('Categorie', function($resource, VariablesService) {
        return $resource('http://wsro.xyz.it/resources/categorie' + VariablesService.debugService, {query:'@query'},
            {
                getAll: {method:'GET', isArray: false}
            }
        );
    })

    .factory('CMS', function($resource, VariablesService) {
        return $resource('http://wsro.xyz.it/cms/:page' + VariablesService.debugService, {page: '@page'},
            {
                home: {method:'GET', isArray: false, params:{page:"home"}},
                about: {method:'GET', isArray: false, params:{page:"about"}},
                contacts: {method:'GET', isArray: false, params:{page:"contacts"}}
            }
        );
    });

/*
// A RESTful factory for retrieving contacts from 'contacts.json'
.factory('contacts', ['$http', function ($http, utils) {
    var path = 'assets/contacts.json';
    var contacts = $http.get(path).then(function (resp) {
        return resp.data.contacts;
    });

    var factory = {};
    factory.all = function () {
        return contacts;
    };
    factory.get = function (id) {
        return contacts.then(function(){
            return utils.findById(contacts, id);
        })
    };
    return factory;
}]);*/