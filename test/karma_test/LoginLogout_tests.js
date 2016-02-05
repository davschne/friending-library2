"use strict";

describe("LoginLogout.js", function() {

  // service under test
  var Log;

  describe("#in", function() {

    var $window;

    beforeEach(function() {
      // mock $window.location.href
      $window = { location: { href: "/" } };
      angular.mock.module("friendingLibrary");
      // substitute mock dependency
      angular.mock.module(function($provide) {
        $provide.factory("$window", function() { return $window; });
      });
      angular.mock.inject(function(LoginLogout) {
        Log = LoginLogout;
      });
    });

    it("should direct the browser to /login", function() {
      Log.in();
      expect($window.location.href).toEqual("/login");
    });
  });

  describe("#out", function() {

    var access_token = "askdjfh94ugnsoidfbpe9gprjbn";

    var $state;
    var Token;
    var $httpBackend;

    beforeEach(function() {
      angular.mock.module("friendingLibrary");

      Token = {
        get: function() { return access_token; },
        del: jasmine.createSpy("Token.del")
      };

      $state = {
        go: jasmine.createSpy("$state.go")
      };

      // substitute mock dependencies
      angular.mock.module(function($provide) {
        $provide.factory("$state", function() { return $state; });
        $provide.factory("Token", function() { return Token; });
      });
      angular.mock.inject(function(_$httpBackend_, LoginLogout) {
        $httpBackend = _$httpBackend_;
        Log = LoginLogout;
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("should make a POST request to /logout, delete the access token, and go to the 'public' UI state", function() {
      $httpBackend.expect(
        "POST", "/logout", {},
        function(headers) {
          return headers.Authorization == "Bearer " + access_token;
        }
      )
      .respond(200);
      Log.out();
      $httpBackend.flush();
      expect(Token.del).toHaveBeenCalled();
      expect($state.go).toHaveBeenCalled();
      expect($state.go.calls.argsFor(0)).toEqual(["public"]);
    });
  });
});
