'use strict';

// debugger;

require('angular/angular');
require('angular-route');
require('angular-cookies');

var friendingLibrary = angular.module('friendingLibrary', ['ngRoute', 'ngCookies']);

//services
require('./services/http_service')(friendingLibrary);

//controller
require('./controllers/auth_controller')(friendingLibrary);
require('./controllers/user_controller')(friendingLibrary);
require('./controllers/books_controller')(friendingLibrary);

//routes
friendingLibrary.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/success', {
      templateUrl: '/templates/views/user-panel.html',
      controller: 'userController'
    })
    .when('/requests', {
      templateUrl: '/templates/views/user-requests.html',
      controller: 'userController'
    })
    .when('/', {
      templateUrl: '/templates/views/sign-in.html',
      controller: 'authController'
    })
    .when('/pile', {
      templateUrl: '/templates/views/book-pile.html',
      controller: 'booksController'
    })
    .otherwise({
      redirectTo: '/'
    });

}]);
