'use strict';

module.exports = function(app) {

  app.factory('httpService', ['$http', function($http) {

    function APICall(obj, token, callback) {
      /*
      @param :  obj = {
                  url: <string>
                  method: <string>
                  [data: <string>]
                }
      @param :  access token <string>
      @param :  callback <function>
      */
      $http({
        method: obj.method,
        url: obj.url,
        headers: {'Authorization': 'Bearer ' + token},
        data: obj.data

        // white space in 'Bearer ' + token is crucial.
        // e.g. : "Bearer 1223142134"
      })
        .success(callback)
        .error(function(err) {
          console.log(err);
        });
    }

    return {
      getUser: function(token, callback) {
        APICall({ method: 'GET', url: '/api/self' }, token, callback);
      },

      getIncomingBookRequests: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/book_requests_incoming'
        }, token, callback);
      },

      getOutgoingBookRequests: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/book_requests_outgoing'
        }, token, callback);
      },

      getBooksBorrowed: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/books_borrowed'
        }, token, callback);
      },

      getBooksLent: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/books_lent'
        }, token, callback);
      },

      getBooks: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/books'
        }, token, callback);
      },

      connectGoogleBooks: function(userData, callback) {
        APICall({
          method: 'GET',
          url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + userData + '&key=AIzaSyCDBfooq1pwrKzZzyUiBTa-cXHA25E63M0'
        }, token, callback);
      },

      createBook: function(token, userData, callback) {
        APICall({
          method: 'POST', url: '/api/books', data: userData
        }, token, callback);
      },

      removeBook: function(token, bookId, callback) {
        APICall({
          method: 'DELETE', url: '/api/books/' + bookId
        }, token, callback);
      },

      availableBooks: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/books/available'
        }, token, callback);
      },

      requestBook: function(token, bookId, callback) {
        APICall({
          method: 'POST', url: '/api/trans/request',
          data: bookId
        }, token, callback);
      },

      cancelRequest: function(token, bookId, callback) {
        APICall({
          method: 'DELETE', url: '/api/trans/request/' + bookId
        }, token, callback);
      },

      approveRequest: function(token, userData, callback) {
        APICall({
          method: 'POST', url: '/api/trans/checkout', data: userData
        }, token, callback);
      },

      denyRequest: function(token, userData, callback) {
        APICall({
          method: 'POST', url: '/api/trans/deny', data: userData
        }, token, callback);
      },

      bookReturn: function(token, userData, callback) {
        APICall({
          method: 'POST', url: '/api/trans/checkin', data: userData
        }, token, callback);
      },

      logOut: function(token, callback) {
        APICall({
          method: 'POST', url: '/logout'
        }, token, callback);
      }
    };
  }]);

};
