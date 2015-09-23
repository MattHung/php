/**
 * Created by matt_hung on 2015/8/17.
 */

module_login.controller("controller_login", function($scope, $window, $location, dynamicDirectiveManager){
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

            show_sign_in_dialog($scope, $location, dynamicDirectiveManager);
        };

        this.onchange_Sign_up=function(){
            show_sign_up_dialog($scope, $window, $location, dynamicDirectiveManager);
        };


        this.onchange_Sign_in();
    }
);

var validateEmail=function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};

var show_sign_up_dialog = function ($scope, $window, $location, dynamicDirectiveManager) {
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
            '           <input ng-model="email" type="text" class="form-control input-lg" placeholder="Email" value="{{email}}" required>' +
            '       </div>' +
            '       <div class="form-group">' +
            '           <input ng-model="password" type="password" class="form-control input-lg" placeholder="Password" value="{{password}}" required>' +
            '       </div>' +

            '       <div class="panel panel-default" style="background-color: #888888">' +
            '           <div class="panel-body">' +

            '               <label>&nbsp;</label>' +
            '               <p><input ng-model="code" type="text" id="defaultReal" name="defaultReal" value="{{code}}"></p>' +
            '               <p>' +
            '               <label>&nbsp;</label>' +
            '               <label>Please enter the letters displayed:</label>' +
            '               <button ng-click="onclick_Sign_up()" class="btn btn-primary btn-lg btn-block">Sign up</button>' +

            '           </div>' +
            '       </div>' +

            '       <div class="msg-block" ng-show="show_error()">' +
            '           <span class="msg-error" ng-show="true">' +
            '               <p style="color:red">{{err_message}}</p>' +
            '           </span>' +
            '       </div>' +

            '   </form>' +
            '</div>' +


            '<div class="modal-footer">' +
            '</div>',
            controller:function($scope, $element, $http){
                $scope.email="";
                $scope.password="";
                $scope.code="";

                $scope.show_error=function(){
                    return $scope.err_message!="";
                };

                $scope.onclick_Sign_up=function(){
                    $scope.err_message="";

                    if($scope.email=="")
                        return;
                    if($scope.password=="")
                        return;
                    if(!validateEmail($scope.email)) {
                        $scope.err_message="email format error !";
                        return;
                    }

                    var encode_email=base64_encode($scope.email);
                    var encode_password=CryptoJS.MD5($scope.password);

                    $http.get(sprintf("%s/%s/%s/%s/%s", API_SignUp, encode_email, encode_password, $scope.code, hash(Code_CAPTCHA))).
                        then(function(response) {
                            console.log(response.data);

                            if(response.data.status=='Create Account Success !'){
                                $window.alert('Create Account Success ! Please Sign In');
                                return;
                            }

                            $scope.err_message=response.data.status;
                        }, function(response) {
                            $scope.err_message=response;
                        });
                }
            }
        };
    }

    $scope.current_dialog="sign-up-panel";
    dynamicDirectiveManager.registerDirective('signUpPanel', Directive, 'suffix');

    dynamicDirectiveManager.OnRecompileCompleted=function(scope, element, suffix){
        $.realperson.setDefaults({length: 3});
        $('#defaultReal').realperson();
    };

    $("#tab_sign_in").removeClass("active");
    $("#tab_sign_up").addClass("active");
};

var show_sign_in_dialog = function ($scope, $location, dynamicDirectiveManager) {
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
            '           <input ng-model="password" type="password" class="form-control input-lg" placeholder="Password" value="{{password}}" required>' +
            '       </div>' +
            '       <div class="form-group">' +
            '           <button id="btn_Sign_in" ng-click="onclick_Sign_in()" class="btn btn-primary btn-lg btn-block">Sign In</button>' +
            '       </div>' +
            '       <div class="msg-block" ng-show="show_error()">' +
            '           <span class="msg-error" ng-show="true">' +
            '               <p style="color:red">{{err_message}}</p>' +
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

                $scope.onclick_Sign_in=function(){
                    $scope.err_message="";

                    if($scope.email=="")
                        return;
                    if($scope.password=="")
                        return;
                    if(!validateEmail($scope.email)) {
                        $scope.err_message="email format error !";
                        return;
                    }

                    var encode_email=base64_encode($scope.email);
                    var encode_password=CryptoJS.MD5($scope.password);

                    $http.get(sprintf("%s/%s/%s", API_SignIn, encode_email, encode_password)).
                        then(function(response) {
                            if(response.data.status=='Login Success !') {
                                $location.path("/sites/tutorial");
                                return;
                            }

                            $scope.err_message=response.data.status;
                        }, function(response) {
                            $scope.err_message=response;
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