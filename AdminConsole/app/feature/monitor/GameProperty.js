/**
 * Created by matt_hung on 2015/9/9.
 */


function GameProperty(object_id, selector_owner, game_id, name, maxDisplayCount){
    // setup plot
    var options = {
        series: {shadowSize: 0}, // drawing is faster without shadows
        yaxis: {min: 0, max: maxDisplayCount},
        xaxis: {show: false},
        grid:{hoverable:true, clickable:true}
    };

    this.object_id=object_id;
    this.selector_owner = selector_owner;
    this.game_id = game_id;
    this.name = name;
    this.maxDisplayCount = maxDisplayCount;
    this.server_status= null;
    this.selector_tooltip=sprintf("tooltip_%s", this.name);
    this.selector_anchor=sprintf("anchor_%s", this.name);
    this.selector_chart="";
    this.selector_status=sprintf("status_%s", this.name);


    this.GameID=game_id;
    this.CCU=[];
    this.CCU_Histroy=[];

    this.appendHtml=function(html){
        $(sprintf("#%s", this.selector_owner)).append(html);
    };

    this.appendHtmlToAnchor=function(html){
        $(sprintf("#%s", this.selector_anchor)).append(html);
    };

    //title
    this.appendHtml(sprintf("<h3 id='%s'>%s</h3>", this.object_id, this.name));

    //create anchor
    this.appendHtml(sprintf("<div id='%s'> </div>", this.selector_anchor));

    //create tooltip
    this.appendHtmlToAnchor(sprintf("<div id='%s'> </div>", this.selector_tooltip));

    //create status selector
    this.appendHtmlToAnchor(sprintf("<div id='%s'> </div>", this.selector_status));
    this.server_status=new simple_table(this.name, this.selector_status);

    this.server_status.Add(this.object_id);
    this.server_status.Items[this.object_id].Add(this.name);
    this.server_status.Items[this.object_id].Add(0);
    this.selector_chart = this.server_status.Items[this.object_id].Add("");
    this.server_status.Show();

    this.appendHtmlToAnchor("<br><br>");

    this.parCCU=function(){
        while(this.CCU.length<500)
            this.CCU.push({ccu:0, time:null});

        // zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < this.CCU.length; ++i)
            res.push([i, this.CCU[i].ccu])
        return res;
    };

    this.OnHover=function (event, pos, item) {
        if (item != null) {
            var id=String(event.target.id);
            var key=id.substr(0, id.length-2);

            var tip = "- - - - - - - - - - - -";
            if(Games_Property[key].CCU[item.dataIndex].time!=null) {
                var currentTime=Games_Property[key].CCU[item.dataIndex].time;
                tip = currentTime.getHours()+':'+currentTime.getMinutes()+':'+currentTime.getSeconds()+'  CCU:' + Games_Property[key].CCU[item.dataIndex].ccu+'<br/>';
            }

            var _left=item.pageX;
            var _left_limitation=$(window).width()-200;

            if(_left_limitation<_left)
                _left=_left_limitation;

            $(sprintf("#%s", Games_Property[key].selector_tooltip)).html(tip)
                .css({top: item.pageY, left: _left, height:20})
                .fadeIn(200);
        }
    };

    this.Plot = $.plot($('#' + this.selector_chart), [this.parCCU()], options);
    $('#'+this.selector_chart).bind("plothover", this.OnHover);

    this.RecordCCU=function(ccu){
        this.server_status.Items[this.object_id].Set(1, ccu);

        var data={ccu:ccu, time:new Date()};
        this.CCU.push(data);

        if(this.CCU.length>500)
            this.CCU.shift();

        this.Plot.setData([this.parCCU()]);
        this.Plot.draw();
    };
    //
    //this.AddCCUHistory=function(histroy){
    //    //var created_at=new Date(histroy.time);
    //    //var key=created_at.getHours()+':'+created_at.getMinutes();
    //    //
    //    //if(this.CCU_Histroy[key]==null)
    //    //    this.CCU_Histroy[key]=[];
    //    //
    //    //this.CCU_Histroy[key].push(histroy);
    //};
}



//function GameProperty(game_id, chart_selector, maxDisplayCount){
//    // setup plot
//    var options = {
//        series: {shadowSize: 0}, // drawing is faster without shadows
//        yaxis: {min: 0, max: maxDisplayCount},
//        xaxis: {show: false},
//        grid:{hoverable:true, clickable:true}
//    };
//
//
//    this.Chart_Selector=chart_selector;
//
//    this.GameID=game_id;
//    this.CCU=[];
//    this.CCU_Histroy=[];
//
//    this.parCCU=function(){
//        while(this.CCU.length<500)
//            this.CCU.push({ccu:0, time:null});
//
//        // zip the generated y values with the x values
//        var res = [];
//        for (var i = 0; i < this.CCU.length; ++i)
//            res.push([i, this.CCU[i].ccu])
//        return res;
//    };
//
//    this.OnHover=function (event, pos, item) {
//        $("#tooltip").hide();
//
//        if (item != null) {
//            var key=String(event.target.id).replace('td#', '');
//            key=key.slice(0, key.length-2);
//
//            var tip = "- - - - - - - - - - - -";
//            if(this.CCU[item.dataIndex].time!=null) {
//                var currentTime=this.CCU[item.dataIndex].time;
//                tip = currentTime.getHours()+':'+currentTime.getMinutes()+':'+currentTime.getSeconds()+'  ccu:' + this.CCU[item.dataIndex].ccu+'<br/>';
//
//                var timeStamp=currentTime.getHours()+':'+currentTime.getMinutes();
//
//                //if($.inArray(timeStamp, this.CCU_Histroy)) {
//                //    for (var i = 0; i < this.CCU_Histroy[timeStamp].length; i++) {
//                //        var date=new Date(this.CCU_Histroy[timeStamp][i].time);
//                //
//                //        if (date.toDateString() == new Date().toDateString())
//                //            continue;
//                //        tip = tip + this.CCU_Histroy[timeStamp][i].time + '  ccu:' + this.CCU_Histroy[timeStamp][i].ccu + '<br/>';
//                //    }
//                //}
//            }
//
//            var _left=item.pageX;
//            var _left_limitation=$(window).width()-200;
//
//            if(_left_limitation<_left)
//                _left=_left_limitation;
//
//            $("#tooltip").html(tip)
//                .css({top: item.pageY, left: _left, height:20})
//                .fadeIn(200);
//        }
//    };
//
//    this.Plot = $.plot($('#' + this.Chart_Selector), [this.parCCU()], options);
//    $('#'+this.Chart_Selector).bind("plothover", this.OnHover);
//
//    this.RecordCCU=function(ccu){
//        var data={ccu:ccu, time:new Date()};
//        this.CCU.push(data);
//
//        if(this.CCU.length>500)
//            this.CCU.shift();
//
//        this.Plot.setData([this.parCCU()]);
//        this.Plot.draw();
//    };
//
//    this.AddCCUHistory=function(histroy){
//        //var created_at=new Date(histroy.time);
//        //var key=created_at.getHours()+':'+created_at.getMinutes();
//        //
//        //if(this.CCU_Histroy[key]==null)
//        //    this.CCU_Histroy[key]=[];
//        //
//        //this.CCU_Histroy[key].push(histroy);
//    };
//}
