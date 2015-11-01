'use strict';

module.exports = function(app) {

  app.controller('userController', ['$scope', '$location', 'httpService', '$cookies', function($scope, $location, httpService, $cookies) {

    var http = httpService;

    var getToken = function() {

      // check query string for token
      var token = $location.search().access_token;

      if (token) {
        // store it in a cookie
        $cookies.put('tok', token);
        // reset browser address bar
        $location.url('/success');
      } else {
        // check cookie for token
        token = $cookies.get('tok');
      }

      return token;
    };

    var token = getToken();

    if (token) {
      // add token to $scope
      $scope.user = { access_token: token };
      // proceed
      runResource();
    } else {
      // redirect to root for sign-in
      $location.path('/');
    }

    function runResource() {

      var getUserData = function(user) {
        http.getUser(user, function(data) {
          console.log('User Grab Success');
          console.log(data);

          $scope.selfRequests = data.requests;
          $scope.selfBorrowing = data.borrowing;

          if ($scope.selfRequests.length === 0) {
            $scope.noSelfRequests = true;
          } else {
            $scope.noSelfRequests = false;
          }

          if ($scope.selfBorrowing.length === 0) {
            $scope.noneApproved = true;
          } else {
            $scope.noneApproved = false;
          }
        });
      };

      getUserData($scope.user.access_token);

      var getUserBooks = function(user) {
        http.getBooks(user, function(data) {
          console.log('Book Grab Success');
          console.log(data);

          $scope.userBooks = data;

          $scope.bookRequests = [];
          $scope.borrowedBooks = [];
          $scope.availableBooks = [];

          for(var i = 0; i < $scope.userBooks.length; i++) {
            if ($scope.userBooks[i].request) {
              $scope.bookRequests.push($scope.userBooks[i]);
            } else if ($scope.userBooks[i].borrower) {
              $scope.borrowedBooks.push($scope.userBooks[i]);
            } else {
              $scope.availableBooks.push($scope.userBooks[i]);
            }
          }

          if ($scope.availableBooks.length === 0) {
            $scope.allRequested = true;
          } else {
            $scope.allRequested = false;
          }

          if ($scope.borrowedBooks.length === 0) {
            $scope.noneBorrowed = true;
          } else {
            $scope.noneBorrowed = false;
          }

          if ($scope.bookRequests.length === 0) {
            $scope.noRequests = true;
          } else {
            $scope.noRequests = false;
          }
        });
      };

      getUserBooks($scope.user.access_token);

      $scope.askGoogle = function(userData) {
        http.connectGoogleBooks(userData, function(data) {
          console.log('Google Data Back');
          console.log(data);

          var rawData = data.items;
          console.log(rawData);

          $scope.checkResult = false;

          if(!(rawData)) {
            $scope.checkResult = true;
          } else {
            var usefulInfo = {
              "author" : data.items[0].volumeInfo.authors,
              "title" : data.items[0].volumeInfo.title,
              "genre" : data.items[0].volumeInfo.categories,
              "images" : data.items[0].volumeInfo.imageLinks,
              "description" : data.items[0].volumeInfo.description
            };

            $scope.googleData = usefulInfo;
            delete $scope.googlebook;
          }
        });
      };

      $scope.submitBook = function(user, userData) {
        http.createBook(user, userData, function(data) {
          console.log('Submit Success');
          console.log(data);
        });

        getUserBooks(user);
        delete $scope.googleData;
      };

      $scope.destroyBook = function(user, bookId) {
        http.removeBook(user, bookId, function(data) {
          console.log('Removed Book!');
          console.log(data);

          getUserBooks(user);
        });
      };

      $scope.removeRequest = function(user, bookId, closure) {
        http.undoRequest(user, bookId, function(data) {
          console.log('Undo Request');
          console.log(data);

          getUserData(user);
        });
      };

      $scope.acceptRequest = function(user, userData) {
        http.approveRequest(user, userData, function(data) {
          console.log('Request Accepted');
          console.log(data);

          getUserBooks(user);
        });
      };

      $scope.rejectRequest = function(user, userData) {
        http.denyRequest(user, userData, function(data) {
          console.log('Request Rejected');
          console.log(data);

          getUserBooks(user);
        });
      };

      $scope.returnBook = function(user, userData) {
        http.bookReturn(user, userData, function(data) {
          console.log('Book Returned');
          console.log(data);

          getUserBooks(user);
        });
      };

      $scope.userLogOut = function(user) {
        http.logOut(user, function(data) {
          console.log('Logged Out');
          console.log(data);
        })

        $cookies.put('tok', '');
        $location.path('/');
      };
    };
  }]);
};
