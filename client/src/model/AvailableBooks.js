"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "AvailableBooks", ["REST", {function(rest) {

      var copies = [];

      var refresh = function() {
        rest.getAvailableBooks(function(records) {
          copies = records;
        });
      };

      // utility to find the index of a copy in the array by its copyid
      var findIndexByID = function(copyid) {
        for (var i = 0; i < copies.length; i++) {
          if (copies[i].copyid === copyid) return i;
        }
        return null;
      };

      // on loading the service, populate the copies array
      refresh();

      return {
        refresh: refresh,
        getAll: function() { return copies; },
        add: function(copy) { copies.push(copy); },
        del: function(copyid) { copies.splice(findIndexByID(copyid), 1); }
      };
    }}]
  );
};
