"use strict";

var testData = require("../../lib/test/test-data.js");
var util     = require("../../lib/test/test-util.js");

describe("REST.js", function() {

  // the REST service under test
  var rest;
  // mock callback function
  var callback;
  // access token to use for API calls
  var access_token = "asdlfkJOWEIFJN485fvnj";
  // utility to check for token in HTTP headers
  var checkToken = function(headers) {
    return headers.Authorization == "Bearer " + access_token;
  };
  // mock REST service dependencies
  var TokenMock = { get: function() { return access_token; } };
  var LoginLogoutMock = { out: function() {} };
  // mock backend
  var $httpBackend;

  beforeEach(function() {
    // create Jasmine spies
    callback = jasmine.createSpy("callback");
    spyOn(LoginLogoutMock, "out");

    // mock the module
    angular.mock.module("friendingLibrary");
    // override REST's dependencies with mocks
    angular.mock.module(function($provide) {
      $provide.factory("Token", function() { return TokenMock; });
      $provide.factory("LoginLogout", function() { return LoginLogoutMock; });
    });

    inject(function(_$httpBackend_, REST) {
      $httpBackend = _$httpBackend_;
      rest         = REST;
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("error handler", function() {

    it("401: should call Log.out()", function() {
      // $rootScope.clientLogout = function() {};
      // spyOn($rootScope, "clientLogout");
      // Since the handler function will be called if there's an error on ANY
      // API call, we'll just choose one arbitrarily.
      $httpBackend.expect("DELETE", "/api/self", {}, checkToken).respond(401);
      rest.deleteUser(callback);
      $httpBackend.flush();
      expect(callback).not.toHaveBeenCalled();
      expect(LoginLogoutMock.out).toHaveBeenCalled();
    });

    it("any other error: should call the callback function with the response object", function() {
      var status = 500;
      $httpBackend.expect("DELETE", "/api/self", {}, checkToken).respond(status);
      rest.deleteUser(callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([{ status: status }, null]);
    });
  });

  describe("#deleteUser", function() {
    it("should make a DELETE request at /api/self that includes an access token and then call the callback function with the response object", function() {
      $httpBackend.expect("DELETE", "/api/self", {}, checkToken).respond(200, { message: "user deleted" });
      rest.deleteUser(callback);
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
      rest.getIncomingBookRequests(callback);
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
      rest.getOutgoingBookRequests(callback);
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
      rest.getBorrowedBooks(callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, borrowing]);
    });
  });

  describe("#getLentBooks", function() {
    it("should make a GET request at /api/self/books_lent that includes an access token and then call the callback function with the response object", function() {
      var lending = [
        util.formatBook(
          util.rand(testData.books),
          {
            copyid: 23,
            borrowerid: 2187,
            borrower_display_name: "Finn",
            checkout_date: "2016-01-28"
          }
        )
      ];
      $httpBackend.expect("GET", "/api/self/books_lent", {}, checkToken).respond(200, lending);
      rest.getLentBooks(callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, lending]);
    });
  });

  describe("#getOwnBooks", function() {
    it("should make a GET request at /api/self/books that includes an access token and then call the callback function with the response object", function() {
      var books = [
        util.formatBook(util.rand(testData.books), {copyids: [2, 3, 5, 7]})
      ];
      $httpBackend.expect("GET", "/api/self/books", {}, checkToken).respond(200, books);
      rest.getOwnBooks(callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, books]);
    });
  });

  describe("#createCopy", function() {
    it("should make a POST request at /api/books that includes an access token and data about the book and then call the callback function with the response object", function() {
      var book = util.rand(testData.books);
      var response = [{ copyid: 19 }];
      $httpBackend.expect("POST", "/api/books", book, checkToken).respond(200, response);
      rest.createCopy(book, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, response]);
    });
  });

  describe("#deleteCopy", function() {
    it("should make a POST request at /api/books/:copyid that includes an access token and then call the callback function with the response object", function() {
      var copyid = 29;
      var response = { message: "copy deleted" };
      $httpBackend.expect("DELETE", "/api/books/" + copyid, {}, checkToken).respond(200, response);
      rest.deleteCopy(copyid, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, response]);
    });
  });

  describe("#getAvailableBooks", function() {
    it("should make a GET request at /api/books/available that includes an access token and then call the callback function with the response object", function() {
      var books = [
        util.formatBook(
          util.rand(testData.books),
          {
            copyid: 11,
            ownerid: 2394872349,
            owner_display_name: "Bob",
          }
        )
      ];
      $httpBackend.expect("GET", "/api/books/available", {}, checkToken).respond(200, books);
      rest.getAvailableBooks(callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, books]);
    });
  });

  describe("#createBookRequest", function() {
    it("should make a POST request at /api/trans/request that includes an access token and the copyid and then call the callback function with the response object", function() {
      var copyid = 13;
      var response = { message: "Book requested" };
      $httpBackend.expect("POST", "/api/trans/request", { copyid: copyid }, checkToken).respond(200, response);
      rest.createBookRequest(copyid, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, response]);
    });
  });

  describe("#cancelBookRequest", function() {
    it("should make a DELETE request at /api/trans/request/:copyid that includes an access token and then call the callback function with the response object", function() {
      var copyid = 13;
      var response = { message: "Book request deleted"};
      $httpBackend.expect("DELETE", "/api/trans/request/" + copyid, {}, checkToken).respond(200, response);
      rest.cancelBookRequest(copyid, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, response]);
    });
  });

  describe("#checkoutBook", function() {
    it("should make a POST request at /api/trans/checkout that includes an access token in the headers and the copy ID and requester ID in the body, and then call the callback function with the response object", function() {
      var copyid = 13;
      var requesterid = 234908374;
      var response = { message: "Book checked out" };
      $httpBackend.expect(
        "POST",
        "/api/trans/checkout",
        { copyid: copyid, requesterid: requesterid },
        checkToken
      ).respond(200, response);
      rest.checkoutBook(copyid, requesterid, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, response]);
    });
  });

  describe("#denyBookRequest", function() {
    it("should make a POST request at /api/trans/deny that includes an access token and the copyid and then call the callback function with the response object", function() {
      var copyid = 13;
      var requesterid = 234908374;
      var response = { message: "Book request deleted"};
      $httpBackend.expect(
        "POST",
        "/api/trans/deny",
        { copyid: copyid, requesterid: requesterid },
        checkToken
      ).respond(200, response);
      rest.denyBookRequest(copyid, requesterid, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, response]);
    });
  });

  describe("#checkinBook", function() {
    it("should make a POST request at /api/trans/checkin that includes an access token in the headers and the copy ID in the body and then call the callback function with the response object", function() {
      var copyid = 13;
      var response = { message: "Book checked in" };
      $httpBackend.expect(
        "POST",
        "/api/trans/checkin",
        { copyid: copyid },
        checkToken
      ).respond(200, response);
      rest.checkinBook(copyid, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, response]);
    });
  });

  // TODO : Move this test to LoginLogout service tests

  xdescribe("#logout", function() {
    it("should make a POST request at /logout that includes an access token in the headers and then call the callback function with the response object", function() {
      var copyid = 13;
      var response = { message: "Logout successful" };
      $httpBackend.expect("POST", "/logout", {}, checkToken)
      .respond(200, response);
      rest.logout(callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, response]);
    });
  });

  // TODO : This method may be moved to a different service

  xdescribe("#queryGoogleBooks", function() {
    it("should make a GET request to the Google Books API, querying by ISBN, and then call the callback function with the response object", function() {
      var book = util.rand(testData.books);
      var ISBN = book.ISBN[13] || book.ISBN[10];
      $httpBackend.expect("GET", "https://www.googleapis.com/books/v1/volumes?q=isbn:" + ISBN + "&key=AIzaSyCDBfooq1pwrKzZzyUiBTa-cXHA25E63M0")
      .respond(200, book);
      rest.queryGoogleBooks(ISBN, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.count()).toEqual(1);
      expect(callback.calls.argsFor(0)).toEqual([null, book]);
    });
  });
});
