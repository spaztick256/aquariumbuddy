'use strict';

angular.module('aqbClient', ['ngAnimate', 'ngCookies',
                             'ngTouch', 'ngSanitize',
                             'ngResource', 'ui.router',
                             'ui.bootstrap']);

angular.module('aqbClient')
   .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
   });
