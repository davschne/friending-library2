"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "OwnBooks", ["REST", function(rest) {

      var createCopyObject = function(r) {
        return {
          copyid: r.copyid,
          // not needed - user is owner
          // **************************
          // owner : {
          //   ownerid      : r.ownerid,
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
            volumelink    : r.volumelink
          }
        };
      };

      return DataModel(rest.getOwnBooks, createCopyObject);

      // var copies = [];

      // var refresh = function() {
      //   rest.getOwnBooks(function(records) {
      //     // create copy objects
      //     records.map(createCopyObject);
      //     copies = records;
      //   });
      // };

      // // utility to find the index of a copy in the array by its copyid
      // // could speed this up to lg N if the array is sorted by copyid

      // // var findIndexByID = function(copyid) {
      // //   for (var i = 0; i < copies.length; i++) {
      // //     if (copies[i].copyid === copyid) return i;
      // //   }
      // //   return null;
      // // };

      // // on loading the service, populate the copies array
      // refresh();

      // return {
      //   getAll: function() {
      //     refresh();
      //     return copies;
      //   },
      //   add: function(copy) { copies.push(copy); },
      //   del: function(copy) { copies.splice(indexOf(copy), 1); }
      // };
    }]
  );
};
