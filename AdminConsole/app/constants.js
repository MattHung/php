/**
 * Created by matt_hung on 2015/9/8.
 */

const Directory="http://192.168.7.222/matt/AdminConsole/app/feature/";

const RemoteServerAddress="192.168.7.188:56699";

const API_ServerInfo=sprintf("http://%s/?ServerInfo?callback=JSON_CALLBACK", RemoteServerAddress);
const API_GetSessionList=sprintf("http://%s/?GetActorList", RemoteServerAddress);
const API_KickSession=sprintf("http://%s/?KickActor&session_id=", RemoteServerAddress);
const API_KickAll=sprintf("http://%s/?KickAllPlayer&game_id=", RemoteServerAddress);