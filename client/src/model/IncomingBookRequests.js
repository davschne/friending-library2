"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "IncomingBookRequests", ["REST", function(rest) {
      return DataModel(rest.getIncomingBookRequests);
    }]
  );
};
