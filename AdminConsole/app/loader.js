/**
 * Created by matt_hung on 2015/9/11.
 */


function GetChildTag(node, tagName){
    for(var childNode in node) {

        if(node[childNode]==null)
            continue;

        childNode=node[childNode];

        if (childNode[tagName]==undefined)
            continue;

        return childNode[tagName];
    }

    return "";
}

function IsDir(row) {
    for (var cell in row) {
        cell = row[cell];

        if(GetChildTag(cell, "alt")=="[DIR]")
            return true;
    }

    return false;
}

function CheckRow(root, dir, row, excludeKeyword){
    var result=[];
    $(row).find("tr").each(function(){
        var hrefResult=[];
        for(var cell in this.cells){
            cell=this.cells[cell];

            var href=GetChildTag(cell, "href");

            if(href=="")
                continue;

            var originURL=sprintf("%s%s", window.location.origin, window.location.pathname);
            href=href.replace(originURL, root);

            //if(href.indexOf(".js")<=-1) {
            if(href.substr(href.lastIndexOf('.')+1)!="js"){
                if (IsDir(this.cells)) {
                    LoadJSFilesInternal(root, href, excludeKeyword);
                    continue;
                }

                continue;
            }

            if(excludeKeyword!=undefined)
            if(cell.innerText.indexOf(excludeKeyword)>=0)
                continue;


            hrefResult.push(cell.innerText);
        }

        result=result.concat(hrefResult);
    });

    for(var i=0; i<result.length; i++)
        OnLoadJSFile(sprintf("%s%s", dir, result[i]));
}

function OnLoadJSFile(url)
{
    var angular_href=window.location.href;
    angular_href=angular_href.replace("#/", "");
    url=url.replace(angular_href, "");

    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    document.head.appendChild(script);
}

function LoadJSFilesInternal(root, dir, excludeKeyword){
    var result=[];
    $.ajax({
        //This will retrieve the contents of the folder if the folder is configured as 'browsable'
        url: dir,
        customData: root,
        success: function (result) {
            CheckRow(this.customData, dir, result, excludeKeyword);
        }
    });
}

function LoadJSFiles(dir, excludeKeyword){
    LoadJSFilesInternal(dir, dir, excludeKeyword);
}

LoadJSFiles(Directory);
