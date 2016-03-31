"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.controller(
    "detailsController", ["$scope", "$state", "$stateParams", function($scope, $state, $stateParams) {

      console.log($stateParams);
      $scope.r    = $stateParams.record;

      // hide view by navigating back to parent state
      $scope.hide = function() {
        $state.go("^");
      };
    }]
  );
};
