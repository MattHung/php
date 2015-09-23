/**
 * Created by matt_hung on 2015/9/8.
 */

const Directory="http://192.168.7.222/matt/AdminConsole/app/feature/";

const GameServerAddress="192.168.7.224:56699";

const GameServerAPI_ServerInfo=sprintf("http://%s/?ServerInfo?callback=JSON_CALLBACK", GameServerAddress);
const GameServerAPI_GetSessionList=sprintf("http://%s/?GetActorList", GameServerAddress);
const GameServerAPI_KickSession=sprintf("http://%s/?KickActor&session_id=", GameServerAddress);
const GameServerAPI_KickAll=sprintf("http://%s/?KickAllPlayer&game_id=", GameServerAddress);


const API_CreateAccount="http://192.168.7.222/matt/AdminConsole/server/index.php/login/CreateAccount";
const API_SignIn="http://192.168.7.222/matt/AdminConsole/server/index.php/login/RequestLogin";
const API_SignUp="http://192.168.7.222/matt/AdminConsole/server/index.php/login/CreateAccount";
