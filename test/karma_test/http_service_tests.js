'use strict';

require('../../app/js/client.js'); // load app (the source code version)
require('angular-mocks');

describe("http_service.js", function() {

  var $httpBackend;
  var $rootScope;
  var http;
  var callback;
  var token = "asdlfkJOWEIFJN485fvnj";

  beforeEach(function() {
    callback = jasmine.createSpy("callback");
  });

  beforeEach(angular.mock.module("friendingLibrary"));

  // beforeEach(angular.mock.module(function($provide, _$rootScope_) {
  //   var rootScope = _$rootScope_.$new();
  //   rootScope.clientLogout = jasmine.createSpy("clientLogout");
  //   $provide.value("$rootScope", rootScope);
  // }));

  beforeEach(angular.mock.inject(function(_$httpBackend_, _$rootScope_, httpService) {
    $httpBackend = _$httpBackend_;
    $rootScope   = _$rootScope_;
    http         = httpService;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("error handler", function() {

    it("401: should call $rootScope.clientLogout", function() {
      $rootScope.clientLogout = function() {};
      spyOn($rootScope, "clientLogout");
      // Since the handler function will be called if there's an error on ANY
      // API call, we'll just choose one arbitrarily.
      $httpBackend.expect(
        "DELETE",
        "/api/self",
        {},
        function(headers) {
          return headers.Authorization == "Bearer " + token;
        }
      ).respond(401);
      http.deleteUser(token, callback);
      $httpBackend.flush();
      expect(callback).not.toHaveBeenCalled();
      expect($rootScope.clientLogout).toHaveBeenCalled();
    });

    it("any other error: should call the callback function with the response object", function() {
      var status = 500;
      $httpBackend.expect(
        "DELETE",
        "/api/self",
        {},
        function(headers) {
          return headers.Authorization == "Bearer " + token;
        }
      ).respond(status);
      http.deleteUser(token, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([{ status: status }, null]);
    });
  });

  describe("#deleteUser", function() {
    it("should make a DELETE request at /api/self that includes an access token and call the callback function with the response object", function() {
      $httpBackend.expect(
        "DELETE",
        "/api/self",
        {},
        function(headers) {
          return headers.Authorization == "Bearer " + token;
        }
      ).respond(200, { message: "user deleted" });
      http.deleteUser(token, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, { message: "user deleted" }]);
    });
  });
});
