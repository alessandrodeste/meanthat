describe('security', function() {

    var $rootScope, $http, $httpBackend, status, userInfo;

    angular.module('test',[]).constant('I18N.MESSAGES', messages = {});
    beforeEach(module('security', 'test', 'security/login/form.tpl.html'));
    beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$http_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $http = _$http_;

        userInfo = { id: '1111', email: 'ale@test.com', firstName: 'Ale', lastName: 'Ale'};
        $httpBackend.when('GET', '/current-user').respond(200, { user: userInfo });
    }));

    describe('showLogin', function() {
        it("should open the dialog", function() {
            service.showLogin();
            $rootScope.$digest();
            expect(angular.element('.login-form').length).toBeGreaterThan(0);
        });
    });

    describe("currentUser", function() {

        it("should be unauthenticated to begin with", function() {
            expect(service.isAuthenticated()).toBe(false);
            expect(service.isAdmin()).toBe(false);
            expect(service.currentUser).toBe(null);
        });
        it("should be authenticated if we update with user info", function() {
            var userInfo = {};
            service.currentUser = userInfo;
            expect(service.isAuthenticated()).toBe(true);
            expect(service.isAdmin()).toBe(false);
            expect(service.currentUser).toBe(userInfo);
        });
        it("should be admin if we update with admin user info", function() {
            var userInfo = { admin: true };
            service.currentUser = userInfo;
            expect(service.isAuthenticated()).toBe(true);
            expect(service.isAdmin()).toBe(true);
            expect(service.currentUser).toBe(userInfo);
        });

        it("should not be authenticated or admin if we clear the user", function() {
            var userInfo = { admin: true };
            service.currentUser = userInfo;
            expect(service.isAuthenticated()).toBe(true);
            expect(service.isAdmin()).toBe(true);
            expect(service.currentUser).toBe(userInfo);

            service.currentUser = null;
            expect(service.isAuthenticated()).toBe(false);
            expect(service.isAdmin()).toBe(false);
            expect(service.currentUser).toBe(null);
        });
    });
/*
    describe('requestCurrentUser', function() {
        it('makes a GET request to current-user url', function() {
            expect(service.isAuthenticated()).toBe(false);
            $httpBackend.expect('GET', '/current-user');
            service.requestCurrentUser().then(function(data) {
                resolved = true;
                expect(service.isAuthenticated()).toBe(true);
                expect(service.currentUser).toBe(userInfo);
            });
            $httpBackend.flush();
            expect(resolved).toBe(true);
        });
        it('returns the current user immediately if they are already authenticated', function() {
            userInfo = {};
            service.currentUser = userInfo;
            expect(service.isAuthenticated()).toBe(true);
            service.requestCurrentUser().then(function(data) {
                resolved = true;
                expect(service.currentUser).toBe(userInfo);
            });
            expect(resolved).toBe(true);
        });
    });
*/
});