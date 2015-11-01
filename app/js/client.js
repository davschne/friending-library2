'use strict';

// debugger;

require('angular/angular');
require('angular-route');
require('angular-cookies');

var friendingLibrary = angular.module('friendingLibrary', ['ngRoute', 'ngCookies']);

//services
require('./services/http_service')(friendingLibrary);

//controllers
require('./controllers/auth_controller')(friendingLibrary);
require('./controllers/my_books_controller')(friendingLibrary);
require('./controllers/available_books_controller')(friendingLibrary);
require('./controllers/borrowing_and_lending_controller')(friendingLibrary);

//routes
friendingLibrary.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/sign_in.html',
      controller: 'authController'
    })
    .when('/available_books', {
      templateUrl: '/templates/available_books.html',
      controller: 'availableBooksController'
    })
    .when('/my_books', {
      templateUrl: '/templates/my_books.html',
      controller: 'myBooksController'
    })
    .when('/borrowing_and_lending', {
      templateUrl: '/templates/borrowing_and_lending.html',
      controller: 'borrowingAndLendingController'
    })
    .otherwise({
      redirectTo: '/'
    });

}]);
