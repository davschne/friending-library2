"use strict";

var testData = require("../../lib/test/test-data.js");
var util     = require("../../lib/test/test-util.js");

describe("Transact.js", function() {

  var Transact;
  var AvailableBooks;
  var OutgoingBookRequests;
  var OwnBooks;
  var IncomingBookRequests;
  var Lent;
  var REST;
  var $q;
  var $rootScope;

  // utility for testing error handling
  var rejectPromise = function() {
    var deferred = $q.defer();
    deferred.reject({ data: { message : "reason" } });
    return deferred.promise;
  };

  beforeEach(function() {
    angular.mock.module("friendingLibrary");
    // get required services from injector
    angular.mock.inject(function(_Transact_, _AvailableBooks_, _OutgoingBookRequests_, _OwnBooks_, _IncomingBookRequests_, _Lent_, _REST_, _$q_, _$rootScope_) {
      Transact             = _Transact_;
      AvailableBooks       = _AvailableBooks_;
      OutgoingBookRequests = _OutgoingBookRequests_;
      OwnBooks             = _OwnBooks_;
      IncomingBookRequests = _IncomingBookRequests_;
      Lent                 = _Lent_;
      REST                 = _REST_;
      $q                   = _$q_;
      $rootScope           = _$rootScope_;
    });
  });

  describe("#requestBook", function() {

    beforeEach(function() {
      this.copy = {
        copyid: 12,
        book  : util.rand(testData.books)
      };
    });

    it("should add a request to OutgoingBookRequests, remove the book from AvailableBooks, and post the operation to the REST service", function() {

      spyOn(OutgoingBookRequests, "add").and.callFake(function(request) {
        this.bookrequest = request;
      }.bind(this));
      spyOn(AvailableBooks, "del");

      spyOn(REST, "createBookRequest").and.callThrough();

      // test method
      Transact.requestBook(this.copy);

      expect(OutgoingBookRequests.add).toHaveBeenCalled();
      expect(OutgoingBookRequests.add.calls.argsFor(0)).toEqual([this.bookrequest]);
      expect(AvailableBooks.del).toHaveBeenCalled();
      expect(AvailableBooks.del.calls.argsFor(0)).toEqual([this.copy]);
      expect(REST.createBookRequest).toHaveBeenCalled();
      expect(REST.createBookRequest.calls.argsFor(0)).toEqual([this.bookrequest]);
    });

    it("on server error: should undo the client-side data model operations, adding the book back to AvailableBooks and removing the request from OutgoingBookRequests", function() {

      spyOn(AvailableBooks, "add");
      spyOn(OutgoingBookRequests, "del").and.callFake(function(request) {
        this.bookrequest = request;
      }.bind(this));

      spyOn(REST, "createBookRequest").and.callFake(rejectPromise);

      // test method
      Transact.requestBook(this.copy);

      // process async callbacks
      $rootScope.$apply();

      expect(AvailableBooks.add).toHaveBeenCalled();
      expect(AvailableBooks.add.calls.argsFor(0)).toEqual([this.copy]);
      expect(OutgoingBookRequests.del).toHaveBeenCalled();
      expect(OutgoingBookRequests.del.calls.argsFor(0)).toEqual([this.bookrequest]);
    });
  });

  describe("#cancelBookRequest", function() {

    beforeEach(function() {
      this.copy = {
        copyid: 13,
        book  : util.rand(testData.books)
      };
      this.bookrequest = {
        copy: this.copy,
        request_date: new Date()
      };
    });

    it("should remove a book request from OutgoingBookRequests, add the book to Available Books, and post the operation to the REST service", function() {

      spyOn(OutgoingBookRequests, "del");
      spyOn(AvailableBooks, "add");
      spyOn(REST, "cancelBookRequest").and.callThrough();

      Transact.cancelBookRequest(this.bookrequest);

      expect(OutgoingBookRequests.del).toHaveBeenCalled();
      expect(OutgoingBookRequests.del.calls.argsFor(0)).toEqual([this.bookrequest]);
      expect(AvailableBooks.add).toHaveBeenCalled();
      expect(AvailableBooks.add.calls.argsFor(0)).toEqual([this.copy]);
      expect(REST.cancelBookRequest).toHaveBeenCalled();
      expect(REST.cancelBookRequest.calls.argsFor(0)).toEqual([this.bookrequest]);
    });

    it("on server error: should undo the client-side data model operations, adding the request back to OutgoingBookRequests and removing the book from AvailableBooks", function() {

      spyOn(OutgoingBookRequests, "add");
      spyOn(AvailableBooks, "del");

      spyOn(REST, "cancelBookRequest").and.callFake(rejectPromise);

      Transact.cancelBookRequest(this.bookrequest);

      // process async callbacks
      $rootScope.$apply();

      expect(AvailableBooks.del).toHaveBeenCalled();
      expect(AvailableBooks.del.calls.argsFor(0)).toEqual([this.copy]);
      expect(OutgoingBookRequests.add).toHaveBeenCalled();
      expect(OutgoingBookRequests.add.calls.argsFor(0)).toEqual([this.bookrequest]);
    });
  });

  describe("#createCopy", function() {

    beforeEach(function() {
      this.book = util.rand(testData.books);
      this.copy; // to store the object passed to OwnBooks.add
      this.copyid = 14;
      // when called, save a reference to the created copy
      spyOn(OwnBooks, "add").and.callFake(function(_copy_) {
        this.copy = _copy_;
      }.bind(this));
    });

    it("should add a copy to OwnBooks, post the operation to the REST service, and asynchronously set the property 'copyid' on the copy in OwnBooks once the server response comes back", function() {

      spyOn(REST, "createCopy").and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve({ copyid: this.copyid });
        return deferred.promise;
      }.bind(this));

      Transact.createCopy(this.book);

      // process async callbacks
      $rootScope.$apply();

      expect(OwnBooks.add).toHaveBeenCalled();
      expect(OwnBooks.add.calls.argsFor(0)).toEqual([this.copy]);
      expect(REST.createCopy).toHaveBeenCalled();
      expect(REST.createCopy.calls.argsFor(0)).toEqual([this.book]);
      // copyid should be added (asynchronously) to the copy object
      expect(this.copy.copyid).toEqual(this.copyid);
    });

    it("on server error: should undo the client-side data model operations, remove the copy from OwnBooks", function() {

      spyOn(OwnBooks, "del");
      spyOn(REST, "createCopy").and.callFake(rejectPromise);

      Transact.createCopy(this.book);

      // process async callbacks
      $rootScope.$apply();

      expect(OwnBooks.del).toHaveBeenCalled();
      expect(OwnBooks.del.calls.argsFor(0)).toEqual([this.copy]);
    });
  });

  describe("#deleteCopy", function() {

    beforeEach(function() {
      this.copy = {
        book: util.rand(testData.books),
        copyid: 15
      };
    });

    it("should remove the copy from OwnBooks and post the operation to the REST service", function() {

      spyOn(OwnBooks, "del");
      spyOn(REST, "deleteCopy").and.callThrough();

      Transact.deleteCopy(this.copy);

      expect(OwnBooks.del).toHaveBeenCalled();
      expect(OwnBooks.del.calls.argsFor(0)).toEqual([this.copy]);
      expect(REST.deleteCopy).toHaveBeenCalled();
      expect(REST.deleteCopy.calls.argsFor(0)).toEqual([this.copy]);
    });

    it("on server error: should undo the client-side data model operations, adding the copy back to OwnBooks", function() {

      spyOn(OwnBooks, "add");
      spyOn(REST, "deleteCopy").and.callFake(rejectPromise);

      Transact.deleteCopy(this.copy);

      // process async callbacks
      $rootScope.$apply();

      expect(OwnBooks.add).toHaveBeenCalled();
      expect(OwnBooks.add.calls.argsFor(0)).toEqual([this.copy]);
    });
  });

  describe("#denyBookRequest", function() {

    beforeEach(function() {
      this.bookrequest = {
        copy: {
          copyid: 16,
          book: util.rand(testData.books)
        },
        requester: util.rand(testData.users),
        request_date: new Date()
      };
    });

    it("should remove the book request from IncomingBookRequests and post the operation to the REST service", function() {

      spyOn(IncomingBookRequests, "del");
      spyOn(REST, "denyBookRequest").and.callThrough();

      Transact.denyBookRequest(this.bookrequest);

      expect(IncomingBookRequests.del).toHaveBeenCalled();
      expect(IncomingBookRequests.del.calls.argsFor(0)).toEqual([this.bookrequest]);
      expect(REST.denyBookRequest).toHaveBeenCalled();
      expect(REST.denyBookRequest.calls.argsFor(0)).toEqual([this.bookrequest]);
    });

    it("on server error: should undo the client-side data model operations, adding the request back to IncomingBookRequests", function() {

      spyOn(IncomingBookRequests, "add");
      spyOn(REST, "denyBookRequest").and.callFake(rejectPromise);

      Transact.denyBookRequest(this.bookrequest);

      // process async callbacks
      $rootScope.$apply();

      expect(IncomingBookRequests.add).toHaveBeenCalled();
      expect(IncomingBookRequests.add.calls.argsFor(0)).toEqual([this.bookrequest]);
    });
  });

  describe("#checkoutBook", function() {

    beforeEach(function() {
      this.bookrequest = {
        copy: {
          copyid: 17,
          book: util.rand(testData.books)
        },
        requester: util.rand(testData.users),
        request_date: new Date()
      };
      // when called, save a reference to the created borrowing record
      spyOn(Lent, "add").and.callFake(function(borrowing) {
        this.borrowing = borrowing;
      }.bind(this));
    });

    it("should add a borrowing record to Lent, remove the corresponding request from IncomingBookRequests, remove the corresponding book from OwnBooks, and post the operation to the REST service", function() {

      spyOn(IncomingBookRequests, "del");
      spyOn(OwnBooks, "del");
      spyOn(REST, "checkoutBook").and.callThrough();

      Transact.checkoutBook(this.bookrequest);

      expect(Lent.add).toHaveBeenCalled();
      expect(Lent.add.calls.argsFor(0)).toEqual([this.borrowing]);
      expect(IncomingBookRequests.del).toHaveBeenCalled();
      expect(IncomingBookRequests.del.calls.argsFor(0)).toEqual([this.bookrequest]);
      expect(OwnBooks.del).toHaveBeenCalled();
      expect(OwnBooks.del.calls.argsFor(0)).toEqual([this.bookrequest.copy]);
      expect(REST.checkoutBook).toHaveBeenCalled();
      expect(REST.checkoutBook.calls.argsFor(0)).toEqual([this.borrowing]);
    });

    it("on server error: should undo the client-side data model operations, removing the borrowing record from Lent, adding the request back to IncomingBookRequests, and adding the book back to OwnBooks", function() {

      spyOn(Lent, "del");
      spyOn(IncomingBookRequests, "add");
      spyOn(OwnBooks, "add");

      spyOn(REST, "checkoutBook").and.callFake(rejectPromise);

      Transact.checkoutBook(this.bookrequest);

      // process async callbacks
      $rootScope.$apply();

      expect(Lent.del).toHaveBeenCalled();
      expect(Lent.del.calls.argsFor(0)).toEqual([this.borrowing]);
      expect(IncomingBookRequests.add).toHaveBeenCalled();
      expect(IncomingBookRequests.add.calls.argsFor(0)).toEqual([this.bookrequest]);
      expect(OwnBooks.add).toHaveBeenCalled();
      expect(OwnBooks.add.calls.argsFor(0)).toEqual([this.bookrequest.copy]);
    });
  });

  describe("#checkinBook", function() {

    beforeEach(function() {
      this.borrowing = {
        copy: {
          copyid: 18,
          book: util.rand(testData.books)
        },
        borrower: util.rand(testData.users),
        checkout_date: new Date()
      };
    });

    it("should remove the borrowing record from Lent, add the book to OwnBooks, and post the operation to the REST service", function() {

      spyOn(Lent, "del");
      spyOn(OwnBooks, "add");
      spyOn(REST, "checkinBook").and.callThrough();

      Transact.checkinBook(this.borrowing);

      expect(Lent.del).toHaveBeenCalled();
      expect(Lent.del.calls.argsFor(0)).toEqual([this.borrowing]);
      expect(OwnBooks.add).toHaveBeenCalled();
      expect(OwnBooks.add.calls.argsFor(0)).toEqual([this.borrowing.copy]);
      expect(REST.checkinBook).toHaveBeenCalled();
      expect(REST.checkinBook.calls.argsFor(0)).toEqual([this.borrowing]);
    });

    it("on server error: should undo the client-side data model operations, adding the borrowing record back to Lent and removing the book from OwnBooks", function() {

      spyOn(Lent, "add");
      spyOn(OwnBooks, "del");
      spyOn(REST, "checkinBook").and.callFake(rejectPromise);

      Transact.checkinBook(this.borrowing);

      // process async callbacks
      $rootScope.$apply();

      expect(Lent.add).toHaveBeenCalled();
      expect(Lent.add.calls.argsFor(0)).toEqual([this.borrowing]);
      expect(OwnBooks.del).toHaveBeenCalled();
      expect(OwnBooks.del.calls.argsFor(0)).toEqual([this.borrowing.copy]);
    });
  });
});
