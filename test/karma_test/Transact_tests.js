"use strict";

describe("Transact.js", function() {
  // service under test
  var Transact;
  // mock dependencies
  var AvailableBooks;
  var OutgoingBookRequests;
  var OwnBooks;
  var IncomingBookRequests;
  var Lent;
  var rest;

  beforeEach(function() {
    angular.mock.module("friendingLibrary");

    // mock services by creating spy objects

    // methods present on each Data Model service
    var methods = ["add", "del", "getAll"];

    AvailableBooks       = jasmine.createSpyObject("AvailableBooks", methods);
    OutgoingBookRequests = jasmine.createSpyObject("OutgoingBookRequests", methods);
    OwnBooks             = jasmine.createSpyObject("OwnBooks", methods);
    IncomingBookRequests = jasmine.createSpyObject("IncomingBookRequests", methods);
    Lent                 = jasmine.createSpyObject("Lent", methods);
    rest = jasmine.createSpyObject("REST", [
      "createBookRequest",
      "cancelBookRequest",
      "createCopy",
      "deleteCopy",
      "denyBookRequest",
      "checkoutBook",
      "checkinBook",
    ]);

    // substitute mock dependencies
    angular.mock.module(function($provide) {
      $provide.factory("AvailableBooks", function() {
        return AvailableBooks;
      });
      $provide.factory("OutgoingBookRequests", function() {
        return OutgoingBookRequests;
      });
      $provide.factory("OwnBooks", function() {
        return OwnBooks;
      });
      $provide.factory("IncomingBookRequests", function() {
        return IncomingBookRequests;
      });
      $provide.factory("Lent", function() {
        return Lent;
      });
      $provide.factory("REST", function() {
        return rest;
      });
    });
    // get reference to service under test from injector
    angular.mock.inject(function(_Transact_) {
      Transact = _Transact_;
    });
  });

  describe("#requestBook", function() {

    it("should add a request to OutgoingBookRequests, remove the book from AvailableBooks, and post the operation to the REST service");

    it("on server error: should undo the client-side data model operations, adding the book back to AvailableBooks and removing the request from OutgoingBookRequests");
  });

  describe("#cancelBookRequest", function() {

    it("should remove a book request from OutgoingBookRequests, add the book to Available Books, and post the operation to the REST service");

    it("on server error: should undo the client-side data model operations, adding the request back to OutgoingBookRequests and removing the the book from AvailableBooks");
  });

  describe("#createCopy", function() {

    it("should add a copy to OwnBooks and post the operation to the REST service");

    it("on server error: should undo the client-side data model operations, remove the copy from OwnBooks");
  });

  describe("#deleteCopy", function() {

    it("should remove the copy from OwnBooks and post the operation to the REST service");

    it("on server error: should undo the client-side data model operations, adding the copy back to OwnBooks");
  });

  describe("#denyBookRequest", function() {

    it("should remove the book request from IncomingBookRequests and post the operation to the REST service");

    it("on server error: should undo the client-side data model operations, adding the request back to IncomingBookRequests");
  });

  describe("#checkoutBook", function() {

    it("should add a borrowing record to Lent, remove the corresponding request from IncomingBookRequests, remove the corresponding book from OwnBooks, and post the operation to the REST service");

    it("on server error: should undo the client-side data model operations, removing the borrowing record from Lent, adding the request back to IncomingBookRequests, and adding the book back to OwnBooks");
  });

  describe("#checkinBook", function() {

    it("should remove the borrowing record from Lent, add the book to OwnBooks, and post the operation to the REST service");

    it("on server error: should undo the client-side data model operations, adding the borrowing record back to Lent and removing the book from OwnBooks");
  });
});
