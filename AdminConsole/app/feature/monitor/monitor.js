/**
 * Created by matt_hung on 2015/8/17.
 */

var ServerInfo;

//Server Status Control
module_monitor.registerCtrl("controller_monitor", ['$scope', '$location', '$interval', '$http', '$templateCache', 'dynamicDirectiveManager',
    function($scope, $location, $interval, $http, $templateCache, dynamicDirectiveManager){
        $scope.serverStatus=new ServerInfo("title", "panel");
        $scope.timer;

        $scope.Initial = function(){
            //$scope.StartTimer();

            $scope.OnUpdateInfo();
        };

        $scope.$on('$destroy', function() {
            //$scope.StopTimer();
        });

        $scope.TryInitialControls=function(jsondata){
            var games=[];

            jsondata["ServerIP"]=GameServerAddress.split(":")[0];
            jsondata["ServerID"]=jsondata["ServerIP"].replace(/\./g, "");

            $scope.serverStatus.InitialTitle(jsondata);
        };

        //$scope.StartTimer=function(){
        //    if(angular.isDefined($scope.timer))
        //        return;
        //
        //    $scope.timer=$interval(function(){
        //        $scope.OnTimer();
        //    }, 100);
        //};
        //
        //$scope.OnTimer= function () {
        //    $scope.UpdateServerInfo();
        //
        //    if($scope.serverStatus.game_list!=null)
        //        $scope.$broadcast("OnUpdate");
        //};

        $scope.OnUpdateInfo=function()
        {
            $scope.UpdateServerInfo();

            if($scope.serverStatus.game_list!=null)
                $scope.$broadcast("OnUpdate");
        };

        $scope.StopTimer=function(){
            if(!angular.isDefined(($scope.timer)))
                return;

            $interval.cancel(($scope.timer));
            $scope.timer=undefined;
        };

        $scope.OnJsonResult=function(server_ip, jsondata){
            jsondata["ServerIP"]=server_ip.split(":")[0];
            jsondata["ServerID"]=jsondata["ServerIP"].replace(/\./g, "");

            $scope.serverStatus.Update(jsondata);
        };

        $scope.UpdateServerInfo=function(){
            $http.jsonp(GameServerAPI_ServerInfo)
                .then(function(json) {
                    $scope.TryInitialControls(json.data);
                    $scope.OnJsonResult(GameServerAddress, json.data);

                    $scope.OnUpdateInfo();
                }, function(err) {
                    var jsondata=[];
                    jsondata["error"]=true;
                    $scope.OnJsonResult(GameServerAddress, jsondata);

                    $scope.OnUpdateInfo();
                });
        };
    }
]);

//Player List Panel
module_monitor.registerCtrl("controller_monitor_player_list", ['$scope', '$http', function($scope, $http) {

    $scope.rowCollection=[];
    $scope.displayedCollection = [].concat($scope.rowCollection);
    $scope.itemsByPage=10;

    $scope.$on("OnUpdate", function(event){$scope.OnUpdate(event)});

    $scope.kickSession=function(sessionID){
        $http.get(GameServerAPI_KickSession + sessionID).
            then(function(response) {
            }, function(response) {
            });
    };

    $scope.kickAllSession=function(){
        $http.get(GameServerAPI_KickAll +  $scope.serverStatus.game_list.current_game().id).
            then(function(response) {
            }, function(response) {
            });
    };

    $scope.OnUpdate=function(event, game){
        $http.get(GameServerAPI_GetSessionList).
            then(function(response) {
                $scope.OnUpdateActorList(response.data);
            }, function(response) {
                $scope.rowCollection=[];
            });
    };

    $scope.OnUpdateActorList=function(jsondata){
        var sessions=[];

        for(var key in jsondata){
            if(key.indexOf("$")>=0)
                continue;

            var game=jsondata[key];

            if(key != $scope.serverStatus.game_list.current_game().name)
                continue;

            for(var session_id in game){
                var session_info={};
                session_info["id"]=session_id;
                session_info["user_id"]=game[session_id].User_id;
                session_info["alias"]=game[session_id].Alias;
                session_info["loginAt"]=game[session_id].LoginAt;
                session_info["remoteIP"]=game[session_id].RemoteIP;
                sessions.push(session_info);
            }

            if(sessions.length!=$scope.rowCollection.length)
                $scope.rowCollection=[];

            for(var i=0; i<sessions.length; i++)
            switch (sessions.length==$scope.rowCollection.length){
                case true:
                    $scope.rowCollection[i]=sessions[i];
                    break;
                case false:
                    $scope.rowCollection.push(sessions[i]);
                    break;
            }
        }
    };
}]);

module_monitor.compileProvider.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);