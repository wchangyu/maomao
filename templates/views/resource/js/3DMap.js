/**
 * Created by Went on 2016/9/23.
 * 使用mapper.js
 */
//var _localPath = "../../assets/local/";
//var _mapperjsSrc = "./work_parts/js/mapper.js";
$(function(){
    var urlPrefix = sessionStorage.apiUrlPrefix;
    setMapAreas("8397ff"); //设置每个楼宇的轮廓显示
    //2.载入各个楼宇的数据
    var now = new Date();
    var mnow = moment(now);
    var monthStart = mnow.startOf("month").format("YYYY-MM-DD");
    //var monthEnd = mnow.endOf("month").add(1,'d').format("YYYY-MM-DD");
    var monthEnd = mnow.add(1,'month').format("YYYY-MM-DD");
    var pts = sessionStorage.pointers ? JSON.parse(sessionStorage.pointers) : [];
    var len = pts.length;
    var ptIds = [];
    if(len){
        for(var i=0;i<len;i++){
            ptIds.push(pts[i].pointerID);
        }
    }

    //2.1载入全院的数据
    $.ajax({
        type:"post",
        url:urlPrefix + "/EnergyItemDatas/getClassEcData",
        data:{
            "pointerID":0,
            "pointerIds":ptIds,
            "startTime":monthStart,
            "endTime":monthEnd,
            "dateType":"月"
        },
        success:function(data){
            if(data.length==0){ return; }
            var $divEC = $(".ecAll>.ec");       //获取总能耗版块
            for(var i= 0,len=data.length;i<len;i++){
                setPtData($divEC,data[i]);
            }
        },
        error:function(xhr,res,err){console.log("获取总数据失败");}
    })
    var offices = sessionStorage.offices ? JSON.parse(sessionStorage.offices) : [];
    var lenOffices = offices.length;
    var officeIds = [];
    if(lenOffices){
        for(var i=0;i<lenOffices;i++){
            officeIds.push(offices[i].f_OfficeID);
        }
    }
    //载入各个分户的数据
    $.ajax({
        type:"post",
        url:urlPrefix + "/EnergyItemDatas/GetTopOfficeEcs",
        data:{
            "startTime":monthStart,
            "endTime":monthEnd,
            "OfficeIDs":officeIds,
            "itemCount":"5"
        },
        success:function(datas){
            if(datas.length>0){
                var dataIndex = 1;
                var $divTopEc = $(".ecOfficeTop5>.ecTop");
                $.each(datas[0],function(index,item){
                    $("<li>",{text:dataIndex+"." + item.itemName + ":" + item.ecData.toFixed(0) + " kWh"}).appendTo($divTopEc);
                    dataIndex+=1;
                })
            }
        }
    })


    for(var i= 0;i<len;i++){
        $.ajax({
            type:"post",
            url: urlPrefix + "/EnergyItemDatas/getClassEcData",
            data:{
                "pointerID":pts[i].pointerID,
                "pointerIds":[pts[i].pointerID],
                "startTime":monthStart,
                "endTime":monthEnd,
                "dateType":"月"
            },
            success:function(data){
                if(data.length==0) { return ;}

                _allPtEcDatas.push(data);
            }
        })
    }
})

var _allPtEcDatas = [];      //存储所有楼宇的能耗数据，点击到某栋楼时候显示

//function loadMap(){
//    //1.载入地图
//    $.ajax({
//        type:"get",
//        url: _localPath + '/configs/3dinfo.json',
//        success:function(mapinfo){
//            //设置图片显示
//            var data = mapinfo.all3dinfos[0];
//            setMapAreas(mapinfo.all3dinfos[0],"8397ff");
//            var $img2 = $("#img2");
//            $img2.attr("src",_localPath + 'img/3dmap/' + data.mapsrc);
//            $img2.css("width",data.width);
//            $img2.css("height",data.height);
//            $img2.attr("usemap","#mapInfos");
//            var $img2_image =  $("#img2_image");        //自动生成的元素
//            if($img2_image){
//                $img2_image.attr("src",_localPath + 'img/3dmap/' + data.mapsrc);
//                $img2_image.css("width",data.width);
//                $img2_image.css("height",data.height);
//            }
//            loadJs(_mapperjsSrc);
//        }
//    });
//}

////设置地图热点
//function setMapAreas(tdinfo,color){
//    var $map = $("#mapInfos");
//    if(!tdinfo) {return;}
//    var pathdatas = tdinfo.pathdatas;
//    for(var i= 0,len = pathdatas.length;i<len;i++){
//        var $area = $("<area>");
//        $area.attr("shape","poly");
//        $area.addClass("noborder");         //mapperjs的用法
//        $area.addClass("iopcacity80");      //mapperjs的用法，热点区域80%透明度
//        $area.addClass("icolor" + color);    //mapperjs的用法，热点区域颜色
//        $area.attr("coords",pathdatas[i].data);
//        $area.attr("data-ptid",pathdatas[i].pointerid);
//        $area.attr("data-ptname",pathdatas[i].pointername);
//        $area.attr("id","map_" + i);
//        //$area.attr("nohref","nohref");
//        $area.attr("href","#");
//        $area.attr("onmouseover","showCurPtData('" + pathdatas[i].pointerid +"','" + pathdatas[i].pointername +"');");
//        $area.attr("onmouseout","hideDiv();");
//        $map.append($area);
//    }
//}

function setMapAreas(color){
    var $areas = $("area");
    if(!$areas){ return ;}
    for(var i= 0,len = $areas.length;i<len;i++){
        var $area = $($areas[i]);
        $area.attr("shape","poly");
        $area.addClass("noborder");         //mapperjs的用法
        $area.addClass("iopcacity80");      //mapperjs的用法，热点区域80%透明度
        $area.addClass("icolor" + color);    //mapperjs的用法，热点区域颜色
        $area.attr("nohref","nohref");
        var pointerid = $area.attr("data-ptid");
        var pointername = $area.attr("data-ptname");
        $area.attr("onmouseover","showCurPtData('" + pointerid +"','" + pointername +"');");
        $area.attr("onmouseout","hideDiv();");
    }
}


//设置数据块
function setPtData($divEC,data){
    var $div = $("<div>");
    $div.addClass("ec-sub");        //添加单行的css类
    var $spanLeft = $("<span>"),$spanRight = $("<span>");
    $spanRight.addClass("ec-com");
    var sLeft = "",sRight = "";
    sLeft = data.ecClassName + ":" + data.ecData.toFixed(0) + " " + data.ecUnit;
    sRight = "同比 " + setArrow(data.dataYoY) + "&nbsp;&nbsp;环比 " + setArrow(data.dataDoD);
    $spanLeft.html(sLeft);
    $spanRight.html(sRight);
    $div.append($spanLeft).append($spanRight);
    $divEC.append($div);
}

//展示当前楼宇数据模块
function setCurPtData(ptId,ptName){
    var $divCurEC = $(".curEC>.ec");
    var $curTitle = $(".curEC>.ecTitle");
    $divCurEC.empty();
    $curTitle.html(ptName);

    if(_allPtEcDatas.length>0){
        for(var i= 0,len=_allPtEcDatas.length;i<len;i++){
            if(_allPtEcDatas[i][0].pointerIdFor3D==ptId){
                var data = _allPtEcDatas[i];
                for(var i= 0,len=data.length;i<len;i++){
                    setPtData($divCurEC,data[i]);
                }
                break;
            }
        }
    }
}

function showCurPtData(ptId,ptName){
    showDiv();
    setCurPtData(ptId,ptName);
}

function setArrow(num){/*格式化同比环比*/
    if(num.split("-")[1]){
        return "<i class='fa fa-arrow-down' style='color:#75d977'></i> "+num.split("-")[1];
    }else if(num == "-"){
        return "-";
    }else{
        return "<i class='fa fa-arrow-up' style='color:#d14102'></i> "+num;
    }
}

function hideDiv(){
    var ecDiv = document.getElementById("curEC");
    ecDiv.style.display = "none";
}

function showDiv(){
    var ecDiv = document.getElementById("curEC");
    ecDiv.style.display = "block";
}

function loadJs(src){
    if(!src || src.length==0){
        throw new Error("需要指定js文件路径");
    }

    var script = document.createElement("script");
    script.src = src + "?randomid=" + (+(new Date()));
    //script.src = src;
    document.body.appendChild(script);
}