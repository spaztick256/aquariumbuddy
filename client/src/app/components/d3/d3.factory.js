'use strict';

angular.module('aqbClient')
  .factory('d3Service', ['$document', '$window', '$q', '$rootScope',
    function($document, $window, $q, $rootScope){
      var d = $q.defer(),
          d3service = {
            d3 : function() {
              return d.promise;
            }
          };

      function onScriptLoad(){
        $rootScope.$apply(function(){
          d.resolve($window.d3);
        });
      }

      //Create a script tag with d3 as the source
      // and call our onScriptLoad callback when it
      // has been loaded
      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.src = 'http://d3js.org/d3.v3.min.js';
      scriptTag.onreadystatechange = function() {
        if(this.readyState === 'complete'){ onScriptLoad(); }
      };
      scriptTag.onload = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);

      return d3service;

}]);
