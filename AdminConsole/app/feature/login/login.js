/**
 * Created by matt_hung on 2015/8/17.
 */

module_login.controller("controller_login", function($scope, $location, dynamicDirectiveManager){
        this.showPanel=true;
        this.email="";
        this.password="";
        this.err_message="";

        this.show_err_message=function(err){
            $scope.err_message=err;
        };

        this.onchange_Sign_in=function(){
            //if($scope.email!="admin") {
            //    $scope.show_err_message("E-mail doesn't exist!!");
            //    return;
            //}
            //
            //if($scope.password!="password") {
            //    $scope.show_err_message("Password doesn't match!!");
            //    return;
            //}

            //$scope.showPanel=false;
            //$location.path("/sites/tutorial");

            show_sign_in_dialog($scope, dynamicDirectiveManager);
        };

        this.onchange_Sign_up=function(){
            show_sign_up_dialog($scope, dynamicDirectiveManager);
        };


        this.onchange_Sign_in();
    }
);

var show_sign_up_dialog = function ($scope, dynamicDirectiveManager) {
    'use strict';

    function Directive() {
        return {
            restrict: 'EA',
            scope: true,
            template:

            '<link rel="stylesheet" href="library/jquery.realperson.package-2.0.1/jquery.realperson.css">' +

            '<div class="modal-header">' +
            '   <h1 class="text-center">Sign up</h1>' +
            '</div>' +
            '<div class="modal-body">' +
            '   <form class="form col-md-12 center-block">' +
            '       <div class="form-group">' +
            '           <input ng-model="email" type="text" class="form-control input-lg" placeholder="Email" required>' +
            '       </div>' +
            '       <div class="form-group">' +
            '           <input ng-model="password" type="password" class="form-control input-lg" placeholder="Password" required>' +
            '       </div>' +

            '       <div class="panel panel-default" style="background-color: #888888">' +
            '           <div class="panel-body">' +

            '               <label>&nbsp;</label>' +
            '               <p><input type="text" id="defaultReal" name="defaultReal"></p>' +
            '               <p>' +
            '               <label>&nbsp;</label>' +
            '               <label>Please enter the letters displayed:</label>' +
            '               <button ng-click="onclick_Sign_up()" class="btn btn-primary btn-lg btn-block">Sign up</button>' +
            '           </div>' +
            '       </div>' +


            '   </form>' +
            '</div>' +


            '<div class="modal-footer">' +
            '</div>'
        };
    }

    $scope.current_dialog="sign-up-panel";
    dynamicDirectiveManager.registerDirective('signUpPanel', Directive, 'suffix');

    dynamicDirectiveManager.OnRecompileCompleted=function(scope, element, suffix){
        $('#defaultReal').realperson();
    };

    $("#tab_sign_in").removeClass("active");
    $("#tab_sign_up").addClass("active");
};

var show_sign_in_dialog = function ($scope, dynamicDirectiveManager) {
    'use strict';

    function Directive() {
        return {
            restrict: 'AE',
            scope: true,
            template:

            '<div class="modal-header">' +
            '   <h1 class="text-center">Sign in</h1>' +
            '</div>' +
            '<div class="modal-body">' +
            '   <form class="form col-md-12 center-block">' +
            '       <div class="form-group">' +
            '           <input ng-model="email" type="text" class="form-control input-lg" placeholder="Email" value="{{email}}" required>' +
            '       </div>' +
            '       <div class="form-group">' +
            '           <input ng-model="password" type="password" class="form-control input-lg" placeholder="Password" required>' +
            '       </div>' +
            '       <div class="form-group">' +
            '           <button ng-click="onclick_Sign_in()" class="btn btn-primary btn-lg btn-block">Sign In</button>' +
            '       </div>' +

            '       <div class="msg-block" ng-show="show_error()">' +
            '           <span class="msg-error" ng-show="true">' +
            '               {{err_message}}' +
            '           </span>' +
            '       </div>' +

            '   </form>' +
            '</div>' +

            '<div class="modal-footer">' +
            '</div>',
            controller:function($scope, $element, $http){

                $scope.email="";
                $scope.password="";

                $scope.show_error=function(){
                    return $scope.err_message!="";
                };

                $scope.validateEmail=function(email) {
                    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    return re.test(email);
                };


                $scope.onclick_Sign_in=function(){
                    $scope.err_message="";

                    if($scope.email=="")
                        return;
                    if($scope.password=="")
                        return;
                    if(!$scope.validateEmail($scope.email)) {
                        $scope.err_message="email format error !";
                        return;
                    }

                    $http.get(sprintf("%s/%s/%s", API_RequestLogin, $scope.email, $scope.password)).
                        then(function(response) {
                            console.log(response.data);

                        }, function(response) {
                        });
                }
            }
        };
    }

    $scope.current_dialog="sign-in-panel";
    dynamicDirectiveManager.registerDirective('signInPanel', Directive, 'suffix');

    $("#tab_sign_in").addClass("active");
    $("#tab_sign_up").removeClass("active");
};