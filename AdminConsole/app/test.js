var myApp = angular.module('myApp', [
    'ngResource',
    'smart-table'
]);

myApp.config(['$controllerProvider', '$compileProvider', '$provide', '$httpProvider',
    function ($controllerProvider, $compileProvider, $provide, $httpProvider) {

    myApp.registerCtrl = $controllerProvider.register;
    myApp.compileProvider = $compileProvider;
    myApp.provide=$provide;
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

myApp.factory('gists', ['$resource', function ($resource) {
    return $resource('https://api.github.com/gists', {}, {
        get: { method: 'GET', params: {}, isArray: true }
    });
}]);

myApp.registerCtrl('mainCtrl',['$scope', 'gists',function($scope, gists){

    $scope.displayed=[];

    gists.get({}, function (data) {
        $scope.gistsCollection=data;
    });
}]);

