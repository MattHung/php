/**
 * Created by matt_hung on 2015/9/8.
 */

//const Directory="http://127.0.0.1/AdminConsole/app/feature/";

const Directory=sprintf("http://%s%sfeature/", window.location.host, window.location.pathname)

const GameServerAddress="127.0.0.1:56699";

const GameServerAPI_ServerInfo=sprintf("http://%s/?ServerInfo?callback=JSON_CALLBACK", GameServerAddress);
const GameServerAPI_GetSessionList=sprintf("http://%s/?GetActorList", GameServerAddress);
const GameServerAPI_KickSession=sprintf("http://%s/?KickActor&session_id=", GameServerAddress);
const GameServerAPI_KickAll=sprintf("http://%s/?KickAllPlayer&game_id=", GameServerAddress);

const API_Location=sprintf("http://%s%s", window.location.host, window.location.pathname).replace("app/", "") + "server";
const API_SignIn=sprintf("%s/index.php/login/RequestLogin", API_Location);
const API_SignUp=sprintf("%s/index.php/login/CreateAccount", API_Location);
