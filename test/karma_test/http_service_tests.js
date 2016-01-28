'use strict';

require('../../app/js/client.js'); // load app (the source code version)
require('angular-mocks');

var testData = require("../../lib/test/test-data.js");
var util     = require("../../lib/test/test-util.js");

describe("http_service.js", function() {

  var $httpBackend;
  var $rootScope;
  var http;
  var callback;
  var token = "asdlfkJOWEIFJN485fvnj";
  // check for token in HTTP headers
  var checkToken = function(headers) {
    return headers.Authorization == "Bearer " + token;
  };

  beforeEach(function() {
    callback = jasmine.createSpy("callback");
  });

  beforeEach(angular.mock.module("friendingLibrary"));

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
      $httpBackend.expect("DELETE", "/api/self", {}, checkToken).respond(401);
      http.deleteUser(token, callback);
      $httpBackend.flush();
      expect(callback).not.toHaveBeenCalled();
      expect($rootScope.clientLogout).toHaveBeenCalled();
    });

    it("any other error: should call the callback function with the response object", function() {
      var status = 500;
      $httpBackend.expect("DELETE", "/api/self", {}, checkToken).respond(status);
      http.deleteUser(token, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([{ status: status }, null]);
    });
  });

  describe("#deleteUser", function() {
    it("should make a DELETE request at /api/self that includes an access token and then call the callback function with the response object", function() {
      $httpBackend.expect("DELETE", "/api/self", {}, checkToken).respond(200, { message: "user deleted" });
      http.deleteUser(token, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, { message: "user deleted" }]);
    });
  });

  describe("#getIncomingBookRequests", function() {
    it("should make a GET request at /api/self/book_requests/incoming that includes an access token and then call the callback function with the response object", function() {
      var bookRequests = [
        util.formatBook(
          util.rand(testData.books),
          {
            copyid: 23,
            requesterid: 2187,
            requester_display_name: "Finn",
            request_date: "2016-01-27"
          }
        )
      ];
      $httpBackend.expect(
        "GET", "/api/self/book_requests/incoming", {}, checkToken).respond(200, bookRequests);
      http.getIncomingBookRequests(token, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, bookRequests]);
    });
  });

  describe("#getOutgoingBookRequests", function() {
    it("should make a GET request at /api/self/book_requests/outgoing that includes an access token and then call the callback function with the response object", function() {
      var bookRequests = [
        util.formatBook(
          util.rand(testData.books),
          {
            copyid: 23,
            ownerid: 2187,
            owner_display_name: "Finn",
            request_date: "2016-01-27"
          }
        )
      ];
      $httpBackend.expect("GET", "/api/self/book_requests/outgoing", {}, checkToken).respond(200, bookRequests);
      http.getOutgoingBookRequests(token, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, bookRequests]);
    });
  });

  describe("#getBorrowedBooks", function() {
    it("should make a GET request at /api/self/books_borrowed that includes an access token and then call the callback function with the response object", function() {
      var borrowing = [
        util.formatBook(
          util.rand(testData.books),
          {
            copyid: 23,
            ownerid: 2187,
            owner_display_name: "Finn",
            checkout_date: "2016-01-28"
          }
        )
      ];
      $httpBackend.expect("GET", "/api/self/books_borrowed", {}, checkToken).respond(200, borrowing);
      http.getBorrowedBooks(token, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, borrowing]);
    });
  });
});
