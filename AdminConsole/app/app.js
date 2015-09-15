/**
 * Created by matt_hung on 2015/8/17.
 */

var module_login=angular.module("module_login", ['dymaicmodule']);

var module_tutorial=angular.module("module_tutorial", ['swipe', 'snapscroll']);
module_tutorial.config(['$routeProvider', '$controllerProvider', '$compileProvider', 'dynamicDirectiveManagerProvider',
    function ($routeProvider, $controllerProvider, $compileProvider, dynamicDirectiveManagerProvider) {
    module_tutorial.registerCtrl = $controllerProvider.register;
    module_tutorial.compileProvider    = $compileProvider;
    dynamicDirectiveManagerProvider.setCompileProvider($compileProvider);
}]);

var module_monitor=angular.module("module_monitor", ['dymaicmodule', 'smart-table', 'ngResource']);
module_monitor.config(['$routeProvider', '$controllerProvider', '$compileProvider', '$provide', '$httpProvider', 'dynamicDirectiveManagerProvider',
    function ($routeProvider, $controllerProvider, $compileProvider, $provide, $httpProvider, dynamicDirectiveManagerProvider) {

    module_monitor.registerCtrl = $controllerProvider.register;
    module_monitor.compileProvider = $compileProvider;
    module_monitor.provide=$provide;
    dynamicDirectiveManagerProvider.setCompileProvider($compileProvider);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.run(function (dynamicDirectiveManager) {
    module_monitor.dynamicDirectiveManager = dynamicDirectiveManager;
});

var app_module=angular.module("app_module", ["ngRoute", "module_login", "module_tutorial", "module_monitor"]);

app_module.controller("controller_app", function($scope){});
