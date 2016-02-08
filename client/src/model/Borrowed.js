"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "Borrowed", ["REST", function(rest) {

      var createBorrowingObject = function(r) {
        return {
          copy: {
            copyid: r.copyid,
            owner : {
              id           : r.ownerid,
              display_name : r.owner_display_name
            },
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
          // not needed - user is borrower
          // *****************************
          // borrower: {
          //   id           : r.id,
          //   display_name : r.display_name
          // },
          },
          checkout_date : r.checkout_date,
          // due_date      : r.due_date
        };
      };

      return DataModel(rest.getBorrowedBooks, createBorrowingObject);
    }]
  );
};
