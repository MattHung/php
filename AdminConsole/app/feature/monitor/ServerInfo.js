/**
 * Created by matt_hung on 2015/9/8.
 */

const SystemRequest_KickAllPlayers = 'KickUserFromGame';
const SystemRequest_SwitchService = 'GameService';
const WebSocketPort = 56688;

String.format = function () {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

var allowConnectStatus = [];

function OnAllowConectChange(){
    var serverIP=event.target.name;
    var command=allowConnectStatus[serverIP] ? 'Close':'Open';
    websocket = new MaintenanceRequest(serverIP+':' + WebSocketPort, SystemRequest_SwitchService, command);
}

function OnKickPlayer() {
    var serverIP=event.target.name;
    websocket = new MaintenanceRequest(serverIP+':' + WebSocketPort, SystemRequest_KickAllPlayers);
}

function OnStartMaintenanceInternal(server_ip, id_txt_remainsec, remainSecs){
    $('#'+id_txt_remainsec).val(remainSecs);

    if(remainSecs!=0)
        return;

    websocket = new MaintenanceRequest(server_ip + ':' + WebSocketPort, SystemRequest_KickAllPlayers);
    websocket = new MaintenanceRequest(server_ip + ':' + WebSocketPort, SystemRequest_SwitchService, 'Close');
}

function MaintenanceRequest(remoteAddress, command, option){
    this.Websocket = new WebSocket("ws://" +  remoteAddress +"/");
    this.Websocket.Command=command;
    this.Websocket.Option=option;
    this.Websocket.onopen =  function(evt) {
        var maintenanceReqeuest={
            action:this.Command,
            messages:this.Option
        };

        var data = {
            game_id: 0,
            jsonstring: JSON.stringify(maintenanceReqeuest),
            table:''
        };

        var json = JSON.stringify(data);
        try {
            this.send(json);
        }catch (err){

        }
        finally{
            this.close();
        }
    };
}

function OnStartMaintenance() {
    var key=event.target.id.replace('btn_Maintenance_', '');
    var remainSecs=$('#txt_remainsec_'+key).val();
    var serverIP=event.target.name;

    if(isNaN(remainSecs)||(remainSecs=='')){
        alert('Enter a number plz!');
        return;
    }

    var timer = $.timer(function () {
        OnStartMaintenanceInternal(serverIP, 'txt_remainsec_'+key, remainSecs);
        remainSecs=remainSecs-1;

        if(remainSecs<0)
            timer.stop();
    });

    timer.set({time: 1000, autostart: true});
    $('#'+event.target.id).fadeOut(400);
    $('#txt_remainsec_'+key).prop('disabled', true);
}

function ServerInfo(selector_title, selector_panel){
    this.initialed = false;
    this.selector_title=selector_title;
    this.selector_panel=selector_panel;
    this.game_list=null;

    this.tables = [];
    this.ccu_history = [];

    this.check_error=function(jsondata)
    {
        if(jsondata["error"]){
            $('#'+this.selector_title).html("");
            $('#'+this.selector_panel).html("");
            this.initialed=false;
            return true;
        }

        return false;
    };

    this.InitialTitle=function(jsondata){
        var table = null;

        if(this.check_error(jsondata))
            return;

        if(jsondata.hasOwnProperty('ConcurrentUser'))
        if(jsondata['ConcurrentUser'].length<=0)
            return false;

        if(this.initialed)
            return false;

        this.initialed=true;

        var ServerIP=jsondata['ServerIP'];
        var name = jsondata['ServerID'];
        var headerName = 'header_' + name;
        var allow_switch='';
        var txt_remainsec='';
        var btn_kickPlayer='';
        var btn_maintenance='';
        var div_maintenance_id='';

        table = new simple_table(name, this.selector_title);

        table.Add(headerName);

        //how Status
        var status='Status: <div class="glyphicon glyphicon-remove"></div>';
        var startup='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Start Up At: ';
        var memory='MemoryUsage: ';
        var allowConnect='';

        //show Start up time
        if (jsondata.hasOwnProperty('ClientPort')) {

            status='Status: <div class="glyphicon glyphicon-ok"></div>';
            startup+=jsondata['StartServerTime'];
            memory+=jsondata['MemoryUsage'];
        }

        //show allow connect controller
        if (jsondata.hasOwnProperty('AllowConnect'))
        {
            var checked=jsondata['AllowConnect'];
            var radio_name=String.format('AllowConnect_{0}', name);
            allowConnect = '&nbsp&nbsp&nbsp';
            allowConnect +='<div id="'+radio_name+'" class="glyphicon ">';
            allowConnect += String.format('<input type="radio" name="{0}"  {1}>', radio_name, checked?'checked':'');
            allowConnect += '<label for="allow">Allow</label>';
            allowConnect += '&nbsp';
            allowConnect += String.format('<input type="radio" name="{0}" {1}>', radio_name, checked?'':'checked');
            allowConnect += '<label for="deny">Deny</label>';
            allowConnect +='</div>';

            var text=checked?'Deny':'Allow';

            allow_switch =String.format('&nbsp&nbsp&nbsp<button type="button" class="btn btn-primary btn-xs" name="{0}" id="btn_{1}"' +
                'onclick="OnAllowConectChange()">{2}</button>', jsondata['ServerIP'], name, text);

            btn_kickPlayer='&nbsp&nbsp&nbsp<button type="button" class="btn btn-primary" name="'+ jsondata['ServerIP'] + '"'+
            ' id="btn_kick_' + name + '"' +
            'onclick="OnKickPlayer()">KickPlayer</button>';

            txt_remainsec='&nbsp&nbsp&nbsp<input type="text" name="'+ jsondata['ServerIP'] + '"'+
            ' id="txt_remainsec_' + name + '" placeholder="Enter the seconds">';

            div_maintenance_id='div_Maintenance_' + name;
            btn_maintenance='&nbsp&nbsp&nbsp<span name="'+ jsondata['ServerIP'] + '"'+
            ' id="'+ div_maintenance_id +'"></span>';

            allowConnectStatus[jsondata['ServerIP']]=checked;
        }


        table.Items[headerName].Add(String.format('{0}{1}', status, startup));
        table.Items[headerName].Add(allowConnect+allow_switch+txt_remainsec+btn_maintenance);
        table.Items[headerName].Add(memory);

        var key = '';
        var existGames = [];
        if(jsondata.hasOwnProperty('ConcurrentUser'))
        for(var index=0; index<jsondata['ConcurrentUser'].length; index++){
            var game_id=jsondata['ConcurrentUser'][index].GameID;
            var ccu=jsondata['ConcurrentUser'][index].CCU;
            var game_name=jsondata['ConcurrentUser'][index].Name;

            key=name+'_'+game_id;
            existGames[key]={chart_cell_id:'', ccu:0, game_id:0};
            existGames[key].ccu=ccu;
            existGames[key].game_id=game_id;
            existGames[key].game_name=game_name;
        }

        this.tables[name]=table;
        this.tables[name].Show();

        var btn_maintenance_id='btn_Maintenance_' + name;

        $('#'+div_maintenance_id).html(String.format('&nbsp&nbsp&nbsp<button type="button" class="btn btn-primary btn-xs" name="{0}" id="{1}"' +
            'onclick="OnStartMaintenance()">Maintenance</button>', jsondata['ServerIP'], btn_maintenance_id));

        this.game_list = new GameList(this.selector_panel, existGames);

        return true;
    };

    this.Update=function(jsondata){
        if(this.check_error(jsondata))
            return;

        if(!this.initialed)
            return;

        var name = jsondata['ServerID'];
        var headerName = 'header_' + name;
        var allowConnect='';

        var memory = 'MemoryUsage: ';
        if (jsondata.hasOwnProperty('ClientPort'))
            memory += jsondata['MemoryUsage'];

        if (jsondata.hasOwnProperty('AllowConnect'))
        {
            var checked=jsondata['AllowConnect'];
            var radio_name=String.format('AllowConnect_{0}', name);
            allowConnect = '&nbsp&nbsp&nbsp';

            allowConnect += String.format('<input type="radio" name="{0}" {1}>', radio_name, checked?'checked':'disabled');
            allowConnect += '<label for="allow">Allow</label>';
            allowConnect += '&nbsp';
            allowConnect += String.format('<input type="radio" name="{0}" {1}>', radio_name, checked?'disabled':'checked');
            allowConnect += '<label for="deny">Deny</label>';
            $('#'+radio_name).html(allowConnect);

            if(allowConnectStatus[jsondata['ServerIP']]!=checked)
                this.OnStatusChange(jsondata['ServerID'], jsondata['ServerIP'], checked);
        }

        this.tables[name].Items[headerName].Set(2, memory);

        this.game_list.Update(jsondata);
    };

    this.OnStatusChange = function(serverID, serverIP, value){

        allowConnectStatus[serverIP]=value;
        var text='';

        switch(value){
            case true:
                text='Deny';
                break;
            case false:
                text='Allow';
                break;
        }
        $('#btn_'+serverID).text(text);
    };
}