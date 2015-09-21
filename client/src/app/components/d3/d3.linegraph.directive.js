'use strict';

angular.module('aqbClient')
  .directive('d3Lines', ['$window', '$timeout', 'd3Service',
    function($window, $timeout, d3Service){
      return {
        restrict : 'EA',
        scope : {
          data : '=',  //bi-directional data-binding
          tankid : '='
        },
        //directive code
        link : function( scope, ele, attrs ){
          d3Service.d3().then(function(d3){
              var margin = {top: 20, right: 30, bottom: 30, left: 30};
              var windowWidth = 658;
              var windowHeight = 500;
              //d3 is the raw d3 object
              var svg = d3.select(ele[0])
                          .append('svg')
                          .style('width', windowWidth )
                          .style('height', windowHeight)
                          // .style('width', "100%" )
                          .attr('class', 'chart-style');

              //Browser onresize event
              $window.onresize = function() {
                scope.$apply();
              };

              //watch for resize event
              scope.$watch(function(){
                return angular.element($window)[0].innerWidth;
              }, function() {
                scope.render(scope.data, scope.tankid );
              });
/*
              //watch for data changes and re-render
              scope.$watch('data', function( newVals, oldVals){
                  return scope.render(newVals, scope.tankid);
              }, true);
/*
              scope.$watch('tankid', function(newVals, oldVals){
                return scope.render(scope.data, newVals );
              }, false );
*/
              scope.render = function(data, tankid){
                if( scope.tankid === 0 ){
                  var dummy = 5;
                }
                //remove all previous items before rendering
                svg.selectAll('*').remove();

                //If we don't pass any data, return
                if( !data && data.length ){ return; }
                //lets get rid of the data that isn't for the right tankid
                data = data.filter(function(k){ return k.tankid === tankid; });
                //date parse function
                var parseDate = d3.time.format('%Y-%m-%-d').parse;
                var testTypes = d3.set();
                //translate our dates/types
                data.forEach(function(d){
                //  d.date = parseDate(d.date);
                  testTypes.add(d.type);
                });
                testTypes = testTypes.values();
                //translate the data to a more usable structure
                var results = testTypes.map( function(t){
                  var loData = data.filter(function(k){
                    return k.type === t;
                  });
                  return {
                    name : t,
                    values : loData.map(function(d){
                      return {date: parseDate(d.date), value: d.resultValue };
                    }).sort( function(a,b){
                      return (a.date > b.date)?1:((b.date > a.date)?-1:0);
                    })
                  };
                });

                //setup variables
                // var width = d3.select(ele[0]).node().offsetWidth - margin.left - margin.right;
                var width = windowWidth - margin.left - margin.right;
                var height =  windowHeight - margin.top - margin.bottom;


                var x = d3.time.scale()
                          .range([margin.left,width])
                          .domain(d3.extent(data, function(d){
                            return parseDate(d.date);
                          }));

                var y = d3.scale.linear()
                          .range([height, margin.top])
                          .domain([
                            d3.min(results, function(r){
                              return d3.min(r.values, function(v){ return v.value;});
                            }),
                            d3.max( results, function(r){
                              return d3.max(r.values, function(v){ return v.value;});
                            })
                          ]);

                var color = d3.scale.category20()
                              .domain(testTypes);

                var xAxis = d3.svg.axis()
                              .scale(x)
                              .orient('bottom');
                var yAxis = d3.svg.axis()
                              .scale(y)
                              .orient('left');
                var line = d3.svg.line()
                             .interpolate('basis')
                             .x(function(d){
                               return x(d.date);
                             })
                             .y(function(d){
                               return y(d.value);
                             });
                //set things up for the line drawing
                svg.append('g')
                   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                //draw our x-axis
                svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(' + 0 + ',' + height + ')')
                    .call(xAxis);


                svg.append('g')
                    .attr('class', 'y axis')
                    .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
                    .call(yAxis)/*
                   .append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 7)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'middle')
                    .text('value')*/;

                var result = svg.selectAll('.result')
                                .data(results).enter()
                                .append('g')
                                  .attr('class', 'result');

                result.append('path')
                      .attr('class', 'line')
                      .attr('d', function(d){
                        return line(d.values);
                      })
                      .style('stroke', function(d){
                        return color(d.name);
                      });

                result.append('text')
                      .datum(function(d){
                        return {
                          name : d.name,
                          value : d.values[d.values.length - 1]
                        };
                      })
                      .attr('transform', function(d){
                        return 'translate(' + x(d.value.date) + ',' + y(d.value.value) + ')';
                      })
                      .attr('x', 3)
                      .attr('dy','.35em')
                      .text(function(d){
                        return d.name;
                      });


                var dummy = 5;
              };    //end of render

          });
        }};
  }]);
