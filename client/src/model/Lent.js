"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "Lent", ["REST", function(rest) {
      return DataModel(rest.getLentBooks);
    }]
  );
};
