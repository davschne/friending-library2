"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "IncomingBookRequests", ["REST", function(rest) {

      var createBookRequestObject = function(r) {
        return {
          copy: {
            copyid: r.copyid,
            //    not needed - user is owner
            //******************************
            // owner : {
            //   id      : r.ownerid,
            //   display_name : r.owner_display_name
            // },
            book : {
              ISBN          : r.ISBN,
              title         : r.title,
              subtitle      : r.subtitle,
              authors       : r.authors,
              categories    : r.categories,
              publisher     : r.publisher,
              publisheddate : r.publisheddate,
              description   : r.description,
              pagecount     : r.pagecount,
              language      : r.language,
              imagelink     : r.imagelink,
              imagelinksmall: r.imagelinksmall
            }
          },
          requester: {
            id           : r.requesterid,
            display_name : r.requester_display_name
          },
          request_date : r.request_date
        };
      };

      return DataModel(rest.getIncomingBookRequests, createBookRequestObject);

      // var bookrequests = [];

      // var refresh = function() {
      //   rest.getIncomingBookRequests(function(records) {
      //     // create copy objects
      //     records.map(createBookRequestObject);
      //     bookrequests = records;
      //   });
      // };

      // // utility to find the index of a copy in the array by its copyid
      // // could speed this up to lg N if the array is sorted by copyid

      // // var findIndexByID = function(copyid) {
      // //   for (var i = 0; i < bookrequests.length; i++) {
      // //     if (bookrequests[i].copyid === copyid) return i;
      // //   }
      // //   return null;
      // // };

      // // on loading the service, populate the bookrequests array
      // refresh();

      // return {
      //   getAll: function() {
      //     refresh();
      //     return bookrequests;
      //   },
      //   add: function(copy) { bookrequests.push(copy); },
      //   del: function(copy) { bookrequests.splice(indexOf(copy), 1); }
      // };
    }]
  );
};
