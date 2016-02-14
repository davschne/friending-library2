"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory("GoogleBooks", ["$http", "$q", function($http, $q) {

    var getBook = function(querystring) {

      var formatBookObject = function(data) {

        // convention : use only 13-digit ISBNs
        var getISBN_13 = function(array) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].type == "ISBN_13") return array[i].identifier;
          }
        };

        // info on Google Books' resource representation:
        //   https://developers.google.com/books/docs/v1/reference/volumes#resource

        var v = data.volumeInfo;

        return {
          isbn          : getISBN_13(v.industryIdentifiers),
          title         : v.title,
          subtitle      : v.subtitle,
          authors       : v.authors,
          categories    : v.categories,
          publisher     : v.publisher,
          publisheddate : v.publishedDate,
          description   : v.description,
          pagecount     : v.pageCount,
          language      : v.language,
          imagelink     : v.imageLinks.smallThumbnail,
          volumelink    : v.canonicalVolumeLink
        };
      };

      var baseURL = "https://www.googleapis.com/books/v1/volumes";
      var url     = baseURL + "?q=" + querystring;

      return $http({ method: "GET", url: url })
      .then(function(res) {
        // if successful, there should only be one item
        if (res.data.totalItems == 1) {
          return formatBookObject(res.data.items[0]);
        }
        // otherwise delegate error handling to caller
        return $q.reject(res.data);
      });
    };

    return {
      // returns Promise resolving to book object
      queryByISBN: function(isbn) {
        isbn = isbn.split("-").join(""); // remove hyphens, if any
        var querystring = "isbn:" + isbn;
        return getBook(querystring);
      }
    };
    // other query types
    // -----------------
    // - intitle:     in title field
    // - inauthor:    in author field
    // - inpublisher: in publisher field
    // - subject:     in category list
  }]);
};
