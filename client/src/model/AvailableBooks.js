"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "AvailableBooks", ["REST", {function(rest) {

      var copies = [];

      var refresh = function() {
        rest.getAvailableBooks(function(records) {
          // create copy objects
          records.map(function(r) {
            return {
              copyid: r.copyid,
              owner : {
                ownerid: r.ownerid,
                display_name: r.owner_display_name
              },
              book : {
                ISBN,
                title,
                subtitle,
                authors,
                categories,
                publisher,
                publishedDate,
                description,
                pageCount,
                language,
                imageLink,
                imageLinkSmall
              }
            };
          });
          copies = records;
        });
      };

      // utility to find the index of a copy in the array by its copyid
      // could speed this up to lg N if the array is sorted by copyid
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
        getAll: function() {
          refresh();
          return copies;
        },
        add: function(copy) { copies.push(copy); },
        del: function(copyid) { copies.splice(findIndexByID(copyid), 1); }
      };
    }}]
  );
};
