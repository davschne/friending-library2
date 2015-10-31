'use strict';

module.exports = function(app) {

  var handleError = function(err) {
      return function(err) {
      console.log('Mongo says: "ERROR" '  + err);

    };
  };

  app.factory('userResource', ['$http', function($http) {
    return function() {
      return {
        getUser: function(token, callback) {
          // var token = JSON.stringify(user);
          $http({
            method: 'GET',
            url: '/api/self',
            headers: {'Authorization': 'Bearer ' + token}
            //white space in 'Bearer ' + token is crucial needs to be Bearer 1223142134 when sent
          })
          .success(callback)
          .error(handleError());
        },

        getBooks: function(token, callback) {
          $http({
            method: 'GET',
            url: '/api/self/books',
            headers: {'Authorization': 'Bearer ' + token}
          })
          .success(callback)
          .error(handleError());
        },

        connectGoogleBooks: function(userData, callback) {
          $http({
            method: 'GET',
            url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + userData + '&key=AIzaSyCDBfooq1pwrKzZzyUiBTa-cXHA25E63M0'
          })
          .success(callback)
          .error(handleError());
        },

        createBook: function(token, userData, callback) {
          $http({
            method: 'POST',
            url: '/api/books',
            headers:  {'Authorization': 'Bearer ' + token},
            data: userData
          })
          .success(callback)
          .error(handleError());
        },

        removeBook: function(token, bookId, callback) {
          $http({
            method: 'DELETE',
            url: '/api/books/' + bookId,
            headers: {'Authorization': 'Bearer ' + token},
          })
          .success(callback)
          .error(handleError());
        },

        undoRequest: function(token, bookId, callback) {
          $http({
            method: 'DELETE',
            url: '/api/trans/request/' + bookId,
            headers: {'Authorization': 'Bearer ' + token},
          })
          .success(callback)
          .error(handleError());
        },

        approveRequest: function(token, userData, callback) {
          $http({
            method: 'POST',
            url: '/api/trans/approve',
            headers: {'Authorization': 'Bearer ' + token},
            data: userData
          })
          .success(callback)
          .error(handleError());
        },

        denyRequest: function(token, userData, callback) {
          $http({
            method: 'POST',
            url: '/api/trans/deny',
            headers: {'Authorization': 'Bearer ' + token},
            data: userData
          })
          .success(callback)
          .error(handleError());
        },

        bookReturn: function(token, userData, callback) {
          $http({
            method: 'POST',
            url: '/api/trans/returned',
            headers: {'Authorization': 'Bearer ' + token},
            data: userData
          })
          .success(callback)
          .error(handleError());
        },

        logOut: function(token, callback) {
          $http({
            method: 'POST',
            url: '/logout',
            headers: {'Authorization': 'Bearer ' + token}
          })
          .success(callback)
          .error(handleError);
        }
      };
    };
  }]);

};
