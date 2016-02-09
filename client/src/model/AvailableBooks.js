"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "AvailableBooks", ["REST", function(rest) {
      return DataModel(rest.getAvailableBooks);
    }]
  );
};
