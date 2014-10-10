

angular.module('services', ['ngResource'])

    // TODO: move to restangular ?
    // Define the API

    .factory('Tasks', ['$resource', function($resource) {
        var Tasks = $resource('/api/secured/tasks', {},
            {
                all: {method:'GET', isArray: true}
            }
        );
        return Tasks;
    }])
    

    
/*
    .factory('CMS', function($resource) {
        return $resource('http://wsro.xyz.it/cms/:page', {page: '@page'},
            {
                home: {method:'GET', isArray: false, params:{page:"home"}},
                about: {method:'GET', isArray: false, params:{page:"about"}},
                contacts: {method:'GET', isArray: false, params:{page:"contacts"}}
            }
        );
    })*/
    ;

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