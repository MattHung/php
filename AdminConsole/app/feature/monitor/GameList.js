/**
 * Created by matt_hung on 2015/9/9.
 */

var Games_Property = [];

function GameList(selector_owner, existGames){
    var accordion_selector = selector_owner;
    var accordion_currentIndex=0;
    var accordion_game_map={};

    this.existGames=existGames;

    var index=0;
    for(var key in existGames) {
        var maxDisplayCount=0;

        for(var counter=100; counter<=10000; counter+=100)
        if(this.existGames[key].ccu<counter){
            maxDisplayCount=counter;
            break;
        }

        var gameProperty=new GameProperty(key, accordion_selector, this.existGames[key].game_id, this.existGames[key].game_name, maxDisplayCount);
        accordion_game_map[index]={};
        accordion_game_map[index].id=this.existGames[key].game_id;
        accordion_game_map[index].name=this.existGames[key].game_name;
        gameProperty.RecordCCU(existGames[key].ccu);
        Games_Property[key]=gameProperty;
        index++;
    }

    $("#"+accordion_selector).on( "accordionactivate", function( event, ui ) {
        accordion_currentIndex=$("#"+accordion_selector).accordion("option", "active");
    } );

    this.current_game=function(){
        return accordion_game_map[accordion_currentIndex];
    };

    this.Update=function(jsondata){
        if(!jsondata.hasOwnProperty('ConcurrentUser'))
            return;

        var name = jsondata['ServerID'];

        for(var index=0; index<jsondata['ConcurrentUser'].length; index++){
            var game_id=jsondata['ConcurrentUser'][index].GameID;
            var ccu=jsondata['ConcurrentUser'][index].CCU;
            var rowName=name+'_'+game_id;

            Games_Property[rowName].RecordCCU(ccu);
        }
    };

    //Add accordion widget
    $(sprintf("#%s", accordion_selector)).accordion();
}
