

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