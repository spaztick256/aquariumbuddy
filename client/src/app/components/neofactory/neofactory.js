/**
 * Created by mike on 9/1/15.
 */
'use strict';


// angular.module('aqbClient')
myApp
  .factory( 'neoFactory', ['$http', function($http){
    var neoFactory = {};
    var urlBase = 'http://localhost:7474/db/data/';
    var urlCommit = 'transaction/commit';
    $http.defaults.headers.common.Authorization = 'Basic ' + btoa('neo4j:shannon');

    neoFactory.getServiceRoot = function(){
      return $http.get( urlBase );
    };

    neoFactory.getTestTypes = function(){
      var statement = 'match (n:TestType) return n.type as type, n.units as units';
      /*
      var queryStatments = {
        statements : [
          {
            statement : 'match (n:TestType) return n.type as type, n.units as units'
          }
        ]
      };
      return $http.post( urlBase + urlCommit, queryStatments );
      */
      return neoFactory.commit( statement );
    };

    neoFactory.getAquariumsInfo = function(){
      var statement = 'match (loc:Location)<-[:locatedAt]-(tank:Tank)-[:ofType]->(tanktype:TankType) ' +
                      'return tank.size as size, tanktype.type as type,' +
                      ' loc.location as location, id(tank) as tankid';
      /*
        var queryStatments = {
          statements : [
            {
              statement : 'match (loc:Location)<-[:locatedAt]-(tank:Tank)-[:ofType]->(tanktype:TankType) ' +
                          'return tank.size as size, tanktype.type as type,' +
                          ' loc.location as location, id(tank) as tankid'
            }
          ]
        };
        return $http.post( urlBase + urlCommit, queryStatments );
        */
        return neoFactory.commit( statement );
    };

    neoFactory.parseData = function(data){
      //make sure we have results
      if( data.results && data.results.length ){
        var results = data.results[0];
        var rows = results.data;
        var ret = [];
        angular.forEach( rows, function( row ){
          var columns = results.columns;
          var rowData = {};
          angular.forEach( columns, function(column, index){
            rowData[column] = row.row[index];
          });
          ret.push(rowData);
        });
        return ret;
      }
    };

    neoFactory.commit = function( statement ){
      var queryStatments = {
        statements : [
          {
            statement : statement
          }
        ]
      };
      return $http.post( urlBase + urlCommit, queryStatments );
    };

    neoFactory.getTestResults = function( testType ){
      var testSpec = '';
      if( testType ){
        testSpec = '{type : \'' + testType + '\'}';
      }

      var statement = 'match (testType:TestType ' + testSpec + ')<-[:ofType]-(test:Test)-[:performedOn]->(date:Date), ' +
                      '(tank:Tank)<-[:source]-(test) ' +
                      'return str(date.year) + "-" + str(date.month) + "-" + str(date.day) as date, ' +
                      'test.result as resultValue, testType.type as type, testType.units as units, id(tank) as tankid ' +
                      'order by date';

      return neoFactory.commit(statement);
    };

    return neoFactory;
  }]);
