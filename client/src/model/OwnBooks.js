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
            isbn          : r.isbn,
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
    }]
  );
};
