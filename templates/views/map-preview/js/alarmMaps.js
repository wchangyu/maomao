/**
 * Created by admin on 2017/6/20.
 */

$(function(){

    //切换显示表格或者地图
    $('.switch-btn').on('click',function(){

        var state = $(this).attr('data-state');

        //当前显示地图
        if(state == 0){

            $('.quota-data-bottom').show();

            $('.the-top-map').hide();

            $(this).attr('data-state','1');

            $(this).addClass('switch-btn1');

            $(this).html('地图模式');

        }else{

            $('.quota-data-bottom').hide();

            $('.the-top-map').show();

            $(this).attr('data-state','0');

            $(this).removeClass('switch-btn1');

            $(this).html('列表模式');

            ////根据用户选择组合不同的页面展示信息
            $('#selected').click();


        }

    });

    //重构区域列表
    drawDistrictArr();

    //改变地区搜索框
    $('.tiaojian').on('change',function(){

        //获取当前id
        var thisId = $(this).val();

        if(thisId == -1){

            drawSelect([],$('#conditionStroage'));

            return false
        }

        $(districtDataArr).each(function(i,o){


            if(o.id == thisId){

                drawSelect(o.childrenArr,$('#conditionStroage'));

                return false;
            }

        })

    });

    //查询按钮
    $('#selected').on('click',function(){

        //地区
        var districtID = $('.tiaojian').val();

        //地点
        var subDisID = $('#conditionStroage').val();

        //负责人
        var linkmanName = $('.filterInput').val();

        //工程名称
        var pointerName = $('.filterInput1').val();

        var postOBj = {

            districtID:districtID,

            subDisID:subDisID,

            linkmanName:linkmanName,

            pointerName:pointerName
        };

        map.clearOverlays();

        $('#map-container').html('');

        $('#ul1').html('');

        $('.search-value-list').html('');

        //可以进行缩放
        setTimeout(function(){
            //新建百度地图
            map = new BMap.Map("map-container");

            map.setMapStyle(mapStyle);

            map.centerAndZoom(new BMap.Point(centerCoordinate[0], centerCoordinate[1]), beginZoom);

            map.enableScrollWheelZoom();
            map.addControl(new BMap.NavigationControl());

            //获取后台数据
            getData(postOBj);

        },100);

    });


    //列表页查看系统图
    $('#dateTables').on('click','.showXTT',function(){

        //获取楼宇id
        var curPointerID = $(this).attr('data-pointer');

        sessionStorage.curPointerId = curPointerID;

        sessionStorage.menuusepointer = 1;

        window.location.href = '../yongnengjiance/energyMonitor.html?a=2'
    });

    //页面大小变化
    window.onresize = function(){

        //获取屏幕高度
        var screenHeight = $(window).height();

        //地图高度
        var mapHeight = screenHeight - 210;

        $('#map-container').height(mapHeight);

    };

});

// 定义中心点坐标;
var centerCoordinate = [115.804166, 28.663333];

//定义初始缩放比例
var beginZoom = 5;

//存放地图数据信息
var markerArr = [

];

//存放报警信息
var alarmArr= [];

//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");

//地图样式配置
var  mapStyle ={

    "styleJson":[
        {
            "style":"dark"
        },
        {
            "featureType": "highway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry.stroke",
            "stylers": {

                "visibility": "off"
            }
        }

    ]
};

var map;

//获取当前楼宇信息
var pointerArr = [];

//定义当前页面的arg参数

sessionStorage.menuArg = "3,2";

var removeNum = 0;

//用于判断是否在地图上显示人员信息
var alarmRemoveNum = 0;

//用于判断是否在地图上显示设备信息
var machineRemoveNum = 0;

var makeArr = [];

//定义楼宇设备标记点集合
var pointerMakerArr = [];

//初始化table表格
var col = [

    {
        title:'工程名称',
        data:'pointerName'
    },
    {
        title:'楼宇id',
        class:'theHidden',
        data:'pointerID'
    },
    {
        title:'地址',
        data:'pointerAddr'
    },
    {
        title:'负责人',
        data:'linkmanName'
    },
    {
        title:'负责人电话',
        data:'linkmanPhone'
    },
    {
        title:'当前状态',
        data:'isAlarmFlag',
        render:function(data, type, row, meta){

            if(data == 0){

                return '未报警'

            }else{

                return '报警'
            }

        }
    },
    {
        title:'最后报警日期',
        data:'lastAlarmDate'
    },
    {
        title:'系统图',
        render:function(data, type, row, meta){

           return '<button class="btn btn-success showXTT"  data-pointer="'+row.pointerID+'">查看系统图</button>'

        }
    }
];

_tableInitSearch($('#dateTables'),col,2,false,'','','','','','','','',false);

//获取后台数据

function getData(obj){

    //获取时间
    var st = moment().subtract(24,'hours').format('YYYY-MM-DD HH:mm:ss');

    var et = moment().format('YYYY-MM-DD HH:mm:ss');

    var prm = {};

    if(obj){

         prm= obj;
    }

    prm.userID = _userIdName;
    prm.st = st;
    prm.et = et;

    $.ajax({
        type: 'post',
        url: _urls + "Alarm/GetAlarmMapInfo",
        timeout: theTimes,
        data:prm,
        beforeSend: function () {
            $('#theLoading').modal('show');

        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (result) {

            $('#theLoading').modal('hide');

            markerArr.length = 0;

            //执行不成功
            if(result.code != 99){

                return false;
            }

            alarmArr.length = 0;

            pointerArr.length = 0;

            //保存获取到的报警信息
            $(result.data).each(function(i,o){

                if(o.isAlarmFlag == 1){

                    alarmArr.push(o);

                }else{

                    pointerArr.push(o);
                }

            });

            _datasTable($('#dateTables'),result.data);

            //根据用户选择组合不同的页面展示信息
            getShowData();


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                myAlter("超时");
            }else{

                myAlter("请求失败！");

                markerArr.length = 0;

                //根据用户选择组合不同的页面展示信息
                getShowData(data);
            }

        }
    });
};


//根据用户选择组合不同的页面展示信息
function getShowData(){

    //存放搜索框中内容
    var html = '';

    markerArr.length = 0;

    //显示报警信息
    if(alarmRemoveNum % 2 == 0){

        $(alarmArr).each(function(i,o){

            var obj =  {
                title: o.pointerName,
                point: ''+o.longitude+',' + o.latitude + '',
                address: "",
                onAlarm: 1 ,
                id: o.pointerID
            };
            html +=     '<li class="titles search-li" data-name='+ o.pointerName+' data-online="1"><span style="background:#e6a91c "></span>'+o.pointerName+'</li>';

            //添加数据
            markerArr.push(obj)
        });

    }

    //显示楼宇信息
    if(machineRemoveNum % 2 == 0){

        //添加楼宇标记点数据
        $(pointerArr).each(function(i,o){

            var obj =  {
                title: o.pointerName,
                point: ''+o.longitude+',' + o.latitude + '',
                address: "",
                onAlarm: 0 ,
                id: o.pointerID

            };

            html +=     '<li class="titles search-li" data-name='+ o.pointerName+' data-online="0"><span style="background:#e6a91c "></span>'+o.pointerName+'</li>';
            //添加数据
            markerArr.push(obj);
        });
    }

    //清除之前页面中的标记点
    map.clearOverlays();

    //具体地点的文字标注与事件绑定
    addWords();

    //重构右上角搜索框中内容
    $('#ul1').html(html);

    detail();

    //新的搜索对象
    new SEARCH_ENGINE("search-test-inner","search-value","search-value-list","search-li");

}

//报警信息的显示与隐藏
$('#onOff-people').on('click',function(){

    alarmRemoveNum ++;

    if( alarmRemoveNum % 2){

        // for(var i = 0 ; i < arr.length; i++){
        // 	arr[i].setStyle({
        // 		display:'none'
        // 	})
        $('#onOff-people').css({
            background:'url("img/off.png") no-repeat 0 1.5px'
        })

    }else{

        $('#onOff-people').css({
            background:'url("img/offs.png") no-repeat 0 1.5px',

        })
    }

    ////根据用户选择组合不同的页面展示信息
    getShowData();
});

//设备的显示与隐藏
$('#onOff-machine').on('click',function(){

    machineRemoveNum ++;

    if( machineRemoveNum % 2){

        // for(var i = 0 ; i < arr.length; i++){
        // 	arr[i].setStyle({
        // 		display:'none'
        // 	})
        $('#onOff-machine').css({
            background:'url("img/off.png") no-repeat 0 1.5px'
        })

    }else{

        $('#onOff-machine').css({
            background:'url("img/offs.png") no-repeat 0 1.5px'

        })
    }

    //根据用户选择组合不同的页面展示信息
    getShowData();
});


(function(){
    window.BMap_loadScriptTime = (new Date).getTime();
    document.write('<script type="text/javascript" src="http://api.map.baidu.com/getscript?v=2.0&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&services=&t=20170803155555"></script>');

    //获取屏幕高度
    var screenHeight = $(window).height();

    //地图高度
    var mapHeight = screenHeight - 210;

    $('#map-container').height(mapHeight);

    //可以进行缩放
    setTimeout(function(){
        //新建百度地图
        map = new BMap.Map("map-container");

        map.setMapStyle(mapStyle);

        map.centerAndZoom(new BMap.Point(centerCoordinate[0], centerCoordinate[1]), beginZoom);

        map.enableScrollWheelZoom();
        map.addControl(new BMap.NavigationControl());

        //获取后台人员数据
        getData();

    },1000);

})();


//数组去重
function unique(a,attr) {

    var res = [];

    for (var i = 0, len = a.length; i < len; i++) {
        var item = a[i];
        for (var j = 0, jLen = res.length; j < jLen; j++) {
            //console.log(i + '' + res);
            if (res[j][attr] === item[attr]){
                //console.log(333);
                break;
            }

        }
        if (j === jLen){

            res.push(item);

        }

    }

    return res;
};


//定义地区结构列表
var districtDataArr = [];


//重构地区结构列表
function drawDistrictArr(){

    var districtArr = JSON.parse(sessionStorage.pointers);

    var _parentArr = unique(districtArr,'districtID');

    var _childrenArr = unique(districtArr,'subDisID');

    $(_parentArr).each(function(i,o){

        var parentId = o.districtID;

        var childArr = [];

        $(_childrenArr).each(function(k,j){

            var obj = {
                id :j.subDisID,
                name:j.subDisName
            };

            if(j.districtID == parentId){

                childArr.push(obj);
            }

        });

        var obj = {

            id :o.districtID,
            name:o.districtName,
            childrenArr:childArr
        };

        districtDataArr.push(obj);

    });

    drawSelect(districtDataArr,$('.tiaojian'));

};

//select框绘制
function drawSelect(data,dom){

    var html = '<option value="">全部</option>';

    $(data).each(function(i,o){

        html += '<option value="'+ o.id+'">'+ o.name+'</option>';


    });

    dom.html(html);

}

//右上角城市切换功能
function detail(){

    for(var i = 0; i < markerArr.length; i++){
        (function (i){

            $('.titles').eq(i).off('click');
            $('.titles').eq(i).on('click',function(){

                var p0 = markerArr[i].point.split(",")[0];
                var p1 = markerArr[i].point.split(",")[1];
                map.centerAndZoom(new BMap.Point(p0, p1), 18);


            });
        })(i)
    }
}

function detail1(){

    //console.log($('.search-value-list li').length);

    for(var i = 0; i < markerArr.length; i++){
        (function (i){

            $('.search-value-list li').eq(i + 1).off('click');

            $('.search-value-list li').eq(i + 1).on('click',function(){
                //console.log('.search-value-list');
                var txt = $(this).find('.name').html();

                for(var j=0; j<$('.titles').length; j++){

                    if(txt == $('.titles').eq(j).attr('data-name')){

                        $('.titles').eq(j).click();
                    }
                }

            });

        })(i)
    }
};


//地点的文字标注与事件绑定

function addWords(){
    var arr = [];
    var points = [];

    makeArr.length = 0;

    //console.log(markerArr);

    for (var i = 0; i < markerArr.length; i++) {
        var p0 = markerArr[i].point.split(",")[0]; //经度
        var p1 = markerArr[i].point.split(",")[1]; //纬度
        var words = markerArr[i].title;
        var address = markerArr[i].address;
        var onAlarm = markerArr[i].onAlarm;

        //判断是否报警
        var icons;

        //onAlarm = 0为不报警 在线蓝色 不在线红色 6为楼宇设备
        if(onAlarm == 0){

            icons = "img/yellowLabel.png";

        }else{

            icons = "img/red.png";
        }

        points[i]= new BMap.Point(p0,p1);
        var marker=new BMap.Marker(new BMap.Point(p0, p1));

        //if(onAlarm != 6){
        //    //添加信息窗口
        //    addInfoWindow(marker, markerArr[i], i);
        //
        //}else{
        //
        //    //添加点击显示对应流程图弹窗事件
        //    addMonitorWindow(marker,markerArr[i])
        //
        //}

        //添加点击显示对应流程图弹窗事件
        addMonitorWindow(marker,markerArr[i]);

        makeArr.push(marker);

        var icon = new BMap.Icon(icons, new BMap.Size(55, 55)); //显示图标大小
        marker.setIcon(icon);//设置标签的图标为自定义图标

        map.addOverlay(marker);//将标签添加到地图中去
        //添加文字标注

        var label = new BMap.Label(words,{offset:new BMap.Size(30,-10)});
        arr.push(label);
        marker.setLabel(label);

        //给隐藏图标右侧标注
        //$(arr).each(function(i , o){
        //    o.setStyle({
        //        display:'none'
        //    })
        //});

        // map.setViewport(points);

    }

    map.addEventListener("zoomend", function () {
        //var DiTu = this.getZoom();
        //
        //if (DiTu >= 14)
        //{
        //    $(arr).each(function(i , o){
        //        o.setStyle({
        //            display:'block'
        //        })
        //    })
        //    $('#onOff').css({
        //        background:'url("img/offs.png") no-repeat 0 1.5px'
        //    })
        //    removeNum = 1;
        //
        //}
        //else
        //{
        //    $(arr).each(function(i , o){
        //        o.setStyle({
        //            display:'none'
        //        })
        //    })
        //    $('#onOff').css({
        //        background:'url("img/off.png") no-repeat 0 1.5px',
        //
        //    })
        //    removeNum = 0;
        //}

        //map.removeEventListener("zoomend", showInfo);
    });

    //右上角label开关
    $('#onOff').off('click');
    $('#onOff').on('click',function(){
        removeNum ++;
        if(removeNum % 2){

            $(arr).each(function(i , o){
                o.setStyle({
                    display:'block'
                })
            });
            // for(var i = 0 ; i < arr.length; i++){
            // 	arr[i].setStyle({
            // 		display:'none'
            // 	})
            $('#onOff').css({
                background:'url("img/offs.png") no-repeat 0 1.5px'
            })

        }else{


            $(arr).each(function(i , o){
                o.setStyle({
                    display:'none'
                })
            });
            $('#onOff').css({
                background:'url("img/off.png") no-repeat 0 1.5px',

            })
        }
    });

}


//右上角下拉菜单显示与隐藏
function showList(){
    $('#ul1').toggle();

}

// 添加信息窗口
function addInfoWindow(marker, poi) {

    //pop弹窗标题
    var title = '<div style="font-weight:bold;color:#CE5521;font-size:14px;width:100%;height:30px;font-size:16px;">' + poi.title +'</div>';
    //pop弹窗信息
    var html = [];
    html.push('<div style="font-size:14px;width:100%;height:280px;">'+
        '<p style="margin-bottom:5px" class="monitorTitle">联系电话：<span>'+poi.tel+'</span></p>'+
        '<p style="margin-bottom:5px" class="monitorTitle">所属班组：<span></span>'+poi.class+'</span></p>'+
        '</div>');
    var infoWindow = new BMap.InfoWindow(html.join(""), {enableMessage: false, title: title, width: 140, height:80 });

    var openInfoWinFun = function () {

        marker.openInfoWindow(infoWindow);
        if(showTrackNum % 2 == 0) {
            $('.show-track').removeClass('show-track1');
        }else{
            $('.show-track').addClass('show-track1');
        }
    };

    var closeInfoWinFun = function () {

        marker.closeInfoWindow(infoWindow);

    };

    marker.addEventListener("mouseover", openInfoWinFun);
    marker.addEventListener("click", openInfoWinFun);
    //marker.addEventListener("mouseout", closeInfoWinFun);
    return openInfoWinFun;


}

//添加流程图窗口
function addMonitorWindow(marker,message){

    var openMonitorWindow = function () {

        //获取楼宇id
        var curPointerID = message.id;

        sessionStorage.curPointerId = curPointerID;

        sessionStorage.menuusepointer = 1;

        window.location.href = '../yongnengjiance/energyMonitor.html?a=2'

    };

    marker.addEventListener("click", openMonitorWindow);

    //marker.addEventListener("mouseout", closeInfoWinFun);
    return openMonitorWindow;
}

//获取完整的地址
function getAreas(){

    $('.otherAreas').toggle();

}

//右上角按钮
function display(){
    $('.switch').css({
        'display':'none',

    });
    $('.showCompany').toggle();

}
$('.showTitle p .close').on('click',function(){
    closeCompany();
});

//右上角关闭按钮
function closeCompany(){
    //console.log('666');
    $('.switch').css({
        'display':'block',

    });
    $('.showCompany').css({
        'display':'none'
    });
    $('#ul1 li').css({
        'display':'block'
    });
    $('.search-value-list li').css({
        'display':'none'
    });
    $('.search-value').val('');

    $('#onOff').css({
        'display':'none'
    });

}

//右上角全部显示按钮
function showAll(){

    $('#ul1 li').css({
        'display':'block'
    });
    $('.search-value-list li').css({
        'display':'none'
    });

}



////搜索功能
//$(function(){
//    // search-test-inner --->  最外层div
//    // search-value --->  input 输入框
//    // search-value-list --->  搜索结果显示div
//    // search-li --->  搜索条目
//    new SEARCH_ENGINE("search-test-inner","search-value","search-value-list","search-li");
//
//});


function SEARCH_ENGINE(dom,searchInput,searchResultInner,searchList){

    //存储拼音+汉字+数字的数组
    this.searchMemberArray = [];

    //作用对象
    this.dom = $("." + dom);

    //搜索框
    this.searchInput = "." + searchInput;

    //搜索结果框
    this.searchResultInner = this.dom.find("." + searchResultInner);

    //搜索对象的名单列表
    this.searchList = this.dom.find("." + searchList);

    //转换成拼音并存入数组
    this.transformPinYin();

    //绑定搜索事件
    this.searchActiveEvent();

};


//创建搜索原型对象
SEARCH_ENGINE.prototype = {
    //-----------------------------【转换成拼音，并将拼音、汉字、数字存入数组】
    transformPinYin : function(){

        //临时存放数据对象
        $("body").append('<input type="text" class="hidden pingying-box">');
        var $pinyin = $("input.pingying-box");

        for(var i=0;i<this.searchList.length;i++){

            //存放名字，转换成拼音
            $pinyin.val(this.searchList.eq(i).attr("data-name"));

            //汉字转换成拼音
            var pinyin = $pinyin.toPinyin().toLowerCase().replace(/\s/g,"");

            //汉字
            var cnCharacter = this.searchList.eq(i).attr("data-name");

            //数字
            var online = this.searchList.eq(i).attr("data-online");

            //存入数组
            this.searchMemberArray.push(pinyin + "&" + cnCharacter + "&" + online);
        }

        //删除临时存放数据对象
        $pinyin.remove();
    },

    //-----------------------------【模糊搜索关键字】
    fuzzySearch : function(type,val){
        var s;
        var returnArray = [];

        //拼音
        if(type === "pinyin"){
            s = 0;
        }
        //汉字
        else if(type === "cnCharacter"){
            s = 1;
        }
        //数字
        else if(type === "digital"){
            s = 1;
        }

        for(var i=0;i<this.searchMemberArray.length;i++){
            //包含字符
            if(this.searchMemberArray[i].split("&")[s].indexOf(val) >= 0){
                returnArray.push(this.searchMemberArray[i]);
            }
        }

        return returnArray;

    },

    //-----------------------------【输出搜索结果】
    postMemberList : function(tempArray){
        var html = '';

        //有搜索结果
        if(tempArray.length > 0){

            html += '<li class="tips">搜索结果（' + tempArray.length + '）</li>';
            console.log(tempArray);
            for(var i=0;i<tempArray.length;i++){
                var sArray = tempArray[i].split("&");

                html += '<li>';

                //判断是否报警
                var color;
                if(sArray[2] == '0'){

                    color = '#e6a91c';

                }else{
                    color = 'red'
                }

                html += '<span class="ifOnline" style="background:' + color + '"></span>';
                html += '<span class="name">' + sArray[1] + '</span>';
                html += '</li>';

            }
        }
        //无搜索结果
        else{

            if($(this.searchInput).val() != ""){
                html += '<li class="tips">无搜索结果……</li>';
            }else{
                this.searchResultInner.html("");
            }
        }
        this.searchResultInner.html(html);
    },

    //-----------------------------【绑定搜索事件】
    searchActiveEvent : function(){

        var searchEngine = this;


        $(document).on('keyup',this.searchInput,function(){
            //使默认的展示项关闭
            $('#ul1 li').css({
                'display':'none'
            });
            //临时存放找到的数组
            var tempArray = [];

            var val = $(this).val();

            //判断拼音的正则
            var pinYinRule = /^[A-Za-z]+$/;

            //判断汉字的正则
            var cnCharacterRule = new RegExp("^[\\u4E00-\\u9FFF]+$","g");

            //判断整数的正则
            var digitalRule = /^[-\+]?\d+(\.\d+)?$/;

            //只搜索3种情况
            //拼音
            if(pinYinRule.test(val)){
                tempArray = searchEngine.fuzzySearch("pinyin",val);
            }
            //汉字
            else if(cnCharacterRule.test(val)){
                tempArray = searchEngine.fuzzySearch("cnCharacter",val);
            }
            //数字
            else if(digitalRule.test(val)){

                tempArray = searchEngine.fuzzySearch("digital",val);
            }
            else{
                searchEngine.searchResultInner.html('<li class="tips">无搜索结果……</li>');
            }

            searchEngine.postMemberList(tempArray);
            detail1();
        });
    }
};

