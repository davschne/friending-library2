'use strict';

// TODO : Is this file needed? Seems to duplicate functionality found in user_resource.

module.exports = function(app) {

  var handleError = function(err) {
    console.log('Trouble ' + err);
  }

  app.factory('authResource', ['$http', '$cookies', function($http, $cookies) {
    return function() {
      return {
      logOut: function(user, callback) {
          $http({
            method: 'POST',
            url: '/logout',
            headers: {'Authorization': 'Bearer ' + user}
          })
          .success(callback)
          .error(handleError);
        }
      };
    };
  }]);

};
