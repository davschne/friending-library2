'use strict';

module.exports = function(app) {

  app.factory('httpService', ['$http', '$rootScope', function($http, $rootScope) {

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
      })
      .success(callback)
      .catch(function(res) {
        handle(res, callback);
      });
    }

    function handle(res, callback) {
      switch (res.status) {
        // API call unauthorized because of invalid token
        case 401:
          $rootScope.clientLogout();
          break;
        default:
          console.log(res.data);
      }
    }

    return {

      deleteUser: function(token, callback) {
        APICall({ method: 'DELETE', url: '/api/self' }, token, callback);
      },

      getIncomingBookRequests: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/book_requests/incoming'
        }, token, callback);
      },

      getOutgoingBookRequests: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/book_requests/outgoing'
        }, token, callback);
      },

      getBorrowedBooks: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/books_borrowed'
        }, token, callback);
      },

      getLentBooks: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/books_lent'
        }, token, callback);
      },

      getOwnBooks: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/self/books'
        }, token, callback);
      },

      connectGoogleBooks: function(data, callback) {
        APICall({
          method: 'GET',
          url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + data + '&key=AIzaSyCDBfooq1pwrKzZzyUiBTa-cXHA25E63M0'
        }, token, callback);
      },

      createCopy: function(token, data, callback) {
        APICall({
          method: 'POST', url: '/api/books', data: data
        }, token, callback);
      },

      deleteCopy: function(token, copyid, callback) {
        APICall({
          method: 'DELETE', url: '/api/books/' + copyid
        }, token, callback);
      },

      getAvailableBooks: function(token, callback) {
        APICall({
          method: 'GET', url: '/api/books/available'
        }, token, callback);
      },

      createBookRequest: function(token, copyid, callback) {
        APICall({
          method: 'POST', url: '/api/trans/request',
          data: copyid
        }, token, callback);
      },

      cancelBookRequest: function(token, copyid, callback) {
        APICall({
          method: 'DELETE', url: '/api/trans/request/' + copyid
        }, token, callback);
      },

      checkoutBook: function(token, data, callback) {
        APICall({
          method: 'POST', url: '/api/trans/checkout', data: data
        }, token, callback);
      },

      denyBookRequest: function(token, data, callback) {
        APICall({
          method: 'POST', url: '/api/trans/deny', data: data
        }, token, callback);
      },

      checkinBook: function(token, data, callback) {
        APICall({
          method: 'POST', url: '/api/trans/checkin', data: data
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
