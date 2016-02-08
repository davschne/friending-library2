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
          },
          requester: {
            id           : r.requesterid,
            display_name : r.requester_display_name
          },
          request_date : r.request_date
        };
      };

      return DataModel(rest.getIncomingBookRequests, createBookRequestObject);
    }]
  );
};
