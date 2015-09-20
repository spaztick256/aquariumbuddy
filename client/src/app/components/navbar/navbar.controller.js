'use strict';

//angular.module('aqbClient')
angular.module('aqbClient')
  .controller('NavbarCtrl', ['$scope', function ($scope) {
    $scope.date = new Date();
  }]);
