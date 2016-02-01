'use strict';

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    'RESTService',
    ['$http', 'authService', function($http, auth) {

      function APICall(obj, token, callback) {
        /*
        @param :  obj = {
                    url: <string>
                    method: <string>
                    [data: <string>]
                  }
        @param :  callback <function>
        */
        $http({
          method: obj.method,
          url: obj.url,
          headers: {'Authorization': 'Bearer ' + auth.getToken()},
          data: obj.data || {}
        })
        .success(function(data, status, headers, config) {
          callback(null, data);
        })
        .error(function(data, status, headers, config) {
          handle(status, callback);
        });
      }

      // TODO : move this logic elsewhere (or at least the logout)
      function handle(status, callback) {
        switch (status) {
          // API call unauthorized because of invalid token
          // case 401:
          //   $rootScope.clientLogout();
          //   break;
          default:
            callback({ status: status }, null);
        }
      }

      return {

        deleteUser: function(callback) {
          APICall({ method: 'DELETE', url: '/api/self' }, callback);
        },

        getIncomingBookRequests: function(callback) {
          APICall({
            method: 'GET', url: '/api/self/book_requests/incoming'
          }, callback);
        },

        getOutgoingBookRequests: function(callback) {
          APICall({
            method: 'GET', url: '/api/self/book_requests/outgoing'
          }, callback);
        },

        getBorrowedBooks: function(callback) {
          APICall({
            method: 'GET', url: '/api/self/books_borrowed'
          }, callback);
        },

        getLentBooks: function(callback) {
          APICall({
            method: 'GET', url: '/api/self/books_lent'
          }, callback);
        },

        getOwnBooks: function(callback) {
          APICall({
            method: 'GET', url: '/api/self/books'
          }, callback);
        },

        createCopy: function(data, callback) {
          APICall({
            method: 'POST', url: '/api/books', data: data
          }, callback);
        },

        deleteCopy: function(copyid, callback) {
          APICall({
            method: 'DELETE', url: '/api/books/' + copyid
          }, callback);
        },

        getAvailableBooks: function(callback) {
          APICall({
            method: 'GET', url: '/api/books/available'
          }, callback);
        },

        createBookRequest: function(copyid, callback) {
          APICall({
            method: 'POST', url: '/api/trans/request',
            data: { copyid: copyid }
          }, callback);
        },

        cancelBookRequest: function(copyid, callback) {
          APICall({
            method: 'DELETE', url: '/api/trans/request/' + copyid
          }, callback);
        },

        checkoutBook: function(copyid, requesterid, callback) {
          APICall({
            method: 'POST',
            url: '/api/trans/checkout',
            data: { copyid: copyid, requesterid: requesterid }
          }, callback);
        },

        denyBookRequest: function(copyid, requesterid, callback) {
          APICall({
            method: 'POST',
            url: '/api/trans/deny',
            data: { copyid: copyid, requesterid: requesterid }
          }, callback);
        },

        checkinBook: function(copyid, callback) {
          APICall({
            method: 'POST', url: '/api/trans/checkin', data: { copyid: copyid }
          }, callback);
        },

        logout: function(callback) {
          APICall({
            method: 'POST', url: '/logout'
          }, callback);
        },

        queryGoogleBooks: function(isbn, callback) {
          APICall({
            method: 'GET',
            url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn + '&key=AIzaSyCDBfooq1pwrKzZzyUiBTa-cXHA25E63M0'
          }, callback);
        }
      };
    }]
  );
};
