'use strict';

angular.module('aqbClient')
  .directive( 'aquariumPanel', function(){
    return {
      restrict: 'AE',
      templateUrl: 'app/components/views/aquariumdetails/aqudetails.template.html'
    };
  });
