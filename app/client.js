'use strict';

// debugger;

require('angular/angular');
require('angular-route');
require('angular-cookies');

var friendingLibrary = angular.module('friendingLibrary', ['ngRoute', 'ngCookies']);

//services
require('./components/http_service/http_service.js')(friendingLibrary);

//controllers
require('./root_controller')(friendingLibrary);
require('./components/my_books/my_books_controller.js')(friendingLibrary);
require('./components/available_books/available_books_controller.js')(friendingLibrary);
require('./components/borrowing_and_lending/borrowing_and_lending_controller.js')(friendingLibrary);

//routes
friendingLibrary.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/components/sign_in/sign_in.html'
    })
    .when('/available_books', {
      templateUrl: '/components/available_books/available_books.html',
      controller: 'availableBooksController'
    })
    .when('/my_books', {
      templateUrl: '/components/my_books/my_books.html',
      controller: 'myBooksController'
    })
    .when('/borrowing_and_lending', {
      templateUrl: 'components/borrowing_and_lending/borrowing_and_lending.html',
      controller: 'borrowingAndLendingController'
    })
    .otherwise({
      redirectTo: '/'
    });

}]);
