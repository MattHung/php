/**
 * Created by matt_hung on 2015/8/17.
 */

module_login.controller("controller_login", function($scope, $location){
        $scope.showPanel=true;
        $scope.email="";
        $scope.password="";
        $scope.err_message="";

        $scope.onclick_Cancel=function(){
            $scope.showPanel=false;
        };

        $scope.show_err_message=function(err){
            $scope.err_message=err;
        };

        $scope.onclick_Sign_in=function(){
            //if($scope.email!="admin") {
            //    $scope.show_err_message("E-mail doesn't exist!!");
            //    return;
            //}
            //
            //if($scope.password!="password") {
            //    $scope.show_err_message("Password doesn't match!!");
            //    return;
            //}

            $scope.showPanel=false;
            $location.path("/sites/tutorial");
        };
    }
);

