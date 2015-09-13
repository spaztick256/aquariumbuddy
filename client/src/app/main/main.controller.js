'use strict';

//angular.module('aqbClient')
myApp
  .controller('MainCtrl', ['$scope', 'neoFactory', function ($scope, neoFactory) {
    $scope.testResults = [
      {}
    ];
    $scope.formdata = {
      selectedAquarium : {}
    };
    $scope.testDate = new Date();


    function getTestTypes(){
      neoFactory.getTestTypes()
        .success(function(data) {
          $scope.testTypes = neoFactory.parseData(data);
        })
        .error(function(error){
        });
    }

    function getAquariumsInfo(){
      neoFactory.getAquariumsInfo()
        .success(function(data){
          $scope.aquariumInfo = neoFactory.parseData(data);
        })
        .error(function(error){
        });
    }

    function getHistoricTestResults( testType ) {
      neoFactory.getTestResults()
        .success( function(data){
            $scope.testResultsHistory = neoFactory.parseData(data);
        })
        .error( function(error){
        });
    }

    $scope.newTestResult = function() {
      $scope.testResults.push({});
    };

    $scope.removeTest = function(index) {
      $scope.testResults.splice(index, 1);
    };

    $scope.saveTestResults = function() {
      var year = $scope.testDate.getFullYear();
      var day = $scope.testDate.getDate();
      var month = $scope.testDate.getMonth() + 1;
      var whereStatement = '';
      var nodeDate = '(date:Date {year:' + year + ', month:' + month + ', day: ' + day + '})';
      var nodeTank = null;
      //Find Tank node
      if( typeof($scope.formdata.selectedAquarium.tankid) === "undefined" ){
        alert( 'You need to select a tank before saving tests');
        $scope.query = '';
        return;
      }
      nodeTank = '(tank:Tank)';
      if( whereStatement.length ){
        whereStatement += ' AND ';
      }
      whereStatement += 'id(tank) = ' + $scope.formdata.selectedAquarium.tankid;
      $scope.query  = 'match ' + nodeDate;
      $scope.query += ', ' + nodeTank;
      $scope.query += ' where ' + whereStatement;
      $scope.query += ' return date';

    };

    $scope.resetTestResults = function(){
      $scope.testResults = [{}];
    };

    $scope.aquariumLocation = function(tankid){
      return $scope.aquariumInfo.find(function(d){ return d.tankid == tankid;}).location;
    }

    getTestTypes();
    getAquariumsInfo();
    getHistoricTestResults();

  }]);
