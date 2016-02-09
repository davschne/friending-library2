"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "OutgoingBookRequests", ["REST", function(rest) {
      return DataModel(rest.getOutgoingBookRequests);
    }]
  );
};
