'use strict';

//angular.module('aqbClient')
angular.module('aqbClient')
  .controller('MainCtrl', ['$scope', 'neoFactory', 'd3Service', function ($scope, neoFactory, d3Service) {
    $scope.testResults = [
      {}
    ];
    $scope.formdata = {
      selectedAquarium : {}
    };
    $scope.testDate = new Date();

    $scope.testResultsHistory = [];

    $scope.phData = [];

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
            $scope.phData.length = 0;
            angular.forEach($scope.testResultsHistory, function( test, index){
              if( test.type.toLowerCase() === 'ph'){
                var d = {
                  label : test.date,
                  value : test.resultValue
                };
                $scope.phData.push(d);
              }
              var dummy = 4;
            });
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
      var nodeDate = 'merge (date:Date {year:' + year + ', month:' + month + ', day: ' + day + '})';
      var nodeTank = null;
      //Find Tank node
      if( typeof($scope.formdata.selectedAquarium.tankid) === 'undefined' ){
        alert( 'You need to select a tank before saving tests');
        $scope.query = '';
        return;
      }
      nodeTank = '(tank:Tank)';
      if( whereStatement.length ){
        whereStatement += ' AND ';
      }
      whereStatement += 'id(tank) = ' + $scope.formdata.selectedAquarium.tankid;
      //Lets process the test results list
      var tests = '';
      var results = '';
      angular.forEach($scope.testResults, function(test, index){
        var dummy = 6;
        var teststring = '(t' + index + ':TestType {type:"' + test.type.type + '"})';
        var resultstring  = 'merge (date)<-[:performedOn]-(r' + index + ':Test {result:' + test.value + '})-[:ofType]->(t' + index + ') ';
            resultstring += 'merge (r' + index + ')-[:source]->(tank) ';
        if( index > 0 ){
          tests += ', ';
        }
        results += resultstring;
        tests += teststring;
      });

      //Create the query
      var query  = 'match ' + nodeTank;
          query += ', ' + tests;
          query += ' where ' + whereStatement;
          query += ' ' + nodeDate;
          query += ' ' + results;
//      $scope.query += ' return date';

      //Save the results to the db
      neoFactory.commit(query)
        .success( function(data){
          alert( 'Saved Successfully');
          //Get the latest data
          getHistoricTestResults();
          $scope.resetTestResults();
        })
        .error(function(error){
          alert( 'Error saving.');
          console.log(error);
        });
    };

    $scope.resetTestResults = function(){
      $scope.testResults = [{}];
    };

    $scope.aquariumLocation = function(tankid){
      var ret = [];
      if( $scope.aquariumInfo ){
        ret = $scope.aquariumInfo.find(function(d){ return d.tankid === tankid;}).location;    
      }
      return ret;
    };

    getTestTypes();
    getAquariumsInfo();
    getHistoricTestResults();

  }]);
