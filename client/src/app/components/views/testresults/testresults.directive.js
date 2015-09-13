'use strict';

angular.module('aqbClient')
  .directive( 'testresultsPanel', function(){
    return {
      restrict: 'AE',
      templateUrl: 'app/components/views/testresults/testresults.panel.html'
    };
  });
