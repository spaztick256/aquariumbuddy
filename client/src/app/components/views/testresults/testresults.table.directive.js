'use strict';

angular.module('aqbClient')
  .directive( 'testresultsTable', function(){
    return {
      restrict: 'AE',
      templateUrl: 'app/components/views/testresults/testresults.table.template.html'
    };
  });
