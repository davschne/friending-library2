"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "OwnBooks", ["REST", function(rest) {
      return DataModel(rest.getOwnBooks);
    }]
  );
};
