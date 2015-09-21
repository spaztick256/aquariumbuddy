'use strict';

angular.module('aqbClient')
  .directive('d3Bars', ['$window', '$timeout', 'd3Service',
    function($window, $timeout, d3Service){
      return {
        restrict : 'EA',
        scope : {
          data : '='  //bi-directional data-binding
        },
        //directive code
        link : function( scope, ele, attrs ){
          d3Service.d3().then(function(d3){
              var margin = parseInt(attrs.margin) || 20,
                  barHeight = parseInt(attrs.barHeight) || 20,
                  barPadding = parseInt(attrs.barPadding) || 5;

              //d3 is the raw d3 object
              var svg = d3.select(ele[0])
                          .append('svg')
                          .style('width', '100%')
                          .attr('class', 'chart-style');

              //Browser onresize event
              $window.onresize = function() {
                scope.$apply();
              };

              //watch for resize event
              scope.$watch(function(){
                return angular.element($window)[0].innerWidth;
              }, function() {
                scope.render(scope.data);
              });

              //watch for data changes and re-render
              scope.$watch('data', function( newVals, oldVals){
                  return scope.render(newVals);
              }, true);

              scope.render = function(data){
                //remove all previous items before rendering
                svg.selectAll('*').remove();

                //If we don't pass any data, return
                if( !data ){ return; }

                //setup variables
                var width = d3.select(ele[0]).node().offsetWidth - margin,
                    //calculate the height
                    height = scope.data.length * (barHeight + barPadding),
                    //Use the category20() scale function for multicolor support
                    color = d3.scale.category20(),
                    //our xScale
                    xScale = d3.scale.linear()
                      .domain([0, d3.max(data, function(d){
                        return d.value;
                      })])
                      .range([0,width]);

                //set the height based on the calculations above
                svg.attr('height', height);

                //create the rectangles for the bar chart
                svg.selectAll('rect')
                   .data(data).enter()
                      .append('rect')
                      .attr('height', barHeight)
                      .attr('width', 140)
                      .attr('x', Math.round(margin/2))
                      .attr('y', function(d,i){
                        return i * ( barHeight + barPadding );
                      })
                      .attr('fill', function(d){
                        return color(d.value);
                      })
                      .transition()
                        .duration(1000)
                        .attr('width', function(d){
                          return xScale(d.value);
                        });
                svg.selectAll('text')
                   .data(data).enter()
                      .append('text')
                      .attr('fill', '#fff')
                      .attr('y', function(d,i){
                        return i * (barHeight + barPadding) + 15;
                      })
                      .attr('x', 15)
                      .text(function(d){
                        return d.label + ' ( ' + d.value + ' ) ';
                      });
              };

          });
        }};
  }]);
