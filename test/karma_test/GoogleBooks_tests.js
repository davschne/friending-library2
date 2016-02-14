"use strict";

var testData = require("../../lib/test/test-data.js");

describe("GoogleBooks.js", function() {

  // service under test
  var GoogleBooks;
  // mock call to GoogleBooks
  var $httpBackend;
  // callback spies
  var callback;
  var errorCallback;

  beforeEach(function() {
    // mock the app
    angular.mock.module("friendingLibrary");
    // create spy callbacks
    callback      = jasmine.createSpy("callback");
    errorCallback = jasmine.createSpy("errorCallback");

    angular.mock.inject(function(_GoogleBooks_, _$httpBackend_) {
      GoogleBooks = _GoogleBooks_;
      $httpBackend = _$httpBackend_;
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("#queryByISBN", function() {

    it("should query the Google Books API and, if a single match is found, return book data in the desired format, including selecting the 13-digit ISBN for the 'isbn' field", function() {
      var book = testData.books[0];
      var response = testData.GoogleBooksResponse;
      $httpBackend.expect("GET", "https://www.googleapis.com/books/v1/volumes?q=isbn:" + book.isbn).respond(200, response);
      GoogleBooks.queryByISBN(book.isbn).then(callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.argsFor(0)).toEqual([book]);
    });

    it("should query the Google Books API and, if no match is found, delegate error handling to the caller", function() {
      var book = testData.books[0];
      var invalidISBN = book.isbn.substring(1, 9);
      var response = {
        "kind": "books#volumes",
        "totalItems": 0
      };
      $httpBackend.expect("GET", "https://www.googleapis.com/books/v1/volumes?q=isbn:" + invalidISBN).respond(200, response);
      GoogleBooks.queryByISBN(invalidISBN).catch(errorCallback);
      $httpBackend.flush();
      expect(errorCallback).toHaveBeenCalled();
      expect(errorCallback.calls.argsFor(0)).toEqual([response]);
    });

    // TODO : add test for removing hyphen from entered ISBN
  });
});
