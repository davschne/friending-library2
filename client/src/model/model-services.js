"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary
  .factory("AvailableBooks", ["REST", function(rest) {
    return DataModel(rest.getAvailableBooks);
  }])
  .factory("OwnBooks", ["REST", function(rest) {
    return DataModel(rest.getOwnBooks);
  }])
  .factory("OutgoingBookRequests", ["REST", function(rest) {
    return DataModel(rest.getOutgoingBookRequests);
  }])
  .factory("IncomingBookRequests", ["REST", function(rest) {
    return DataModel(rest.getIncomingBookRequests);
  }])
  .factory("Borrowed", ["REST", function(rest) {
    return DataModel(rest.getBorrowedBooks);
  }])
  .factory("Lent", ["REST", function(rest) {
    return DataModel(rest.getLentBooks);
  }]);
};
