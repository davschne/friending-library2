'use strict';

require('../../app/js/client.js'); // load app (the source code version)
require('angular-mocks');

var testData = require("../../lib/test/test-data.js");

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
    it("should make a DELETE request at /api/self that includes an access token and then call the callback function with the response object", function() {
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

  describe("#getIncomingBookRequests", function() {
    it("should make a GET request at /api/self/book_requests/incoming that includes an access token and then call the callback function with the response object", function() {
      var book = testData.books[0];
      var bookRequests = [
        {
          isbn: book.ISBN[13] || book.ISBN[10],
          title: book.title,
          subtitle: book.subtitle,
          authors: book.authors,
          categories: book.categories,
          publisher: book.publisher,
          publisheddate: book.publishedDate,
          description: book.description,
          pagecount: book.pageCount,
          language: book.language,
          imagelink: book.imageLinks.thumbnail,
          imagelinksmall: book.imageLinks.smallThumbnail,
          copyid: 23,
          requesterid: 2187,
          requester_display_name: "Finn",
          request_date: "2016-01-27"
        }
      ];
      $httpBackend.expect(
        "GET",
        "/api/self/book_requests/incoming",
        {},
        function(headers) {
          return headers.Authorization == "Bearer " + token;
        }
      ).respond(200, bookRequests);
      http.getIncomingBookRequests(token, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, bookRequests]);
    });
  });

  describe("#getOutgoingBookRequests", function() {
    it("should make a GET request at /api/self/book_requests/outgoing that includes an access token and then call the callback function with the response object", function() {
      var book = testData.books[1];
      var bookRequests = [
        {
          isbn: book.ISBN[13] || book.ISBN[10],
          title: book.title,
          subtitle: book.subtitle,
          authors: book.authors,
          categories: book.categories,
          publisher: book.publisher,
          publisheddate: book.publishedDate,
          description: book.description,
          pagecount: book.pageCount,
          language: book.language,
          imagelink: book.imageLinks.thumbnail,
          imagelinksmall: book.imageLinks.smallThumbnail,
          copyid: 23,
          ownerid: 2187,
          owner_display_name: "Finn",
          request_date: "2016-01-27"
        }
      ];
      $httpBackend.expect(
        "GET",
        "/api/self/book_requests/outgoing",
        {},
        function(headers) {
          return headers.Authorization == "Bearer " + token;
        }
      ).respond(200, bookRequests);
      http.getOutgoingBookRequests(token, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, bookRequests]);
    });
  });
});
