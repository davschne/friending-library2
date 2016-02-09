"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "Borrowed", ["REST", function(rest) {
      return DataModel(rest.getBorrowedBooks);
    }]
  );
};
