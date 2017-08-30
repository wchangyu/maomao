/**
 * Created by admin on 2017/6/20.
 */

// 定义中心点坐标;
var centerCoordinate = [115.804166, 28.663333];

//定义初始缩放比例
var beginZoom = 8;

//存放地图数据信息
var markerArr = [

];
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


//获取后台数据
function getData(){

    $.ajax({
        type: 'post',
        url: _urls + "/YWGD/ywGDGetLocInfo",
        timeout: theTimes,
        data:{
            "userID": _userIdName
        },
        beforeSend: function () {
            $('#theLoading').modal('show');

        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');

            markerArr = [];

            //存放搜索框中内容
            var html = '';

            $(data).each(function(i,o){

                var obj =  {
                    title: o.userName,
                    point: ''+o.longitude+',' + o.latitude + '',
                    address: "",
                    tel: o.mobile,
                    online: 0 ,
                    class: o.depart,
                    id: o.userID
                };
                html +=     '<li class="titles search-li" data-name='+ o.userName+' data-online="不在线"><span></span>'+o.userName+'</li>';

                //添加数据
                markerArr.push(obj)
            });
            console.log(markerArr);

            //新建百度地图
            map = new BMap.Map("container");

            map.setMapStyle(mapStyle);

            map.centerAndZoom(new BMap.Point(centerCoordinate[0], centerCoordinate[1]), beginZoom);
//可以进行缩放
            map.enableScrollWheelZoom();
            map.addControl(new BMap.NavigationControl());

            //具体地点的文字标注与事件绑定
            addWords();

            //重构右上角搜索框中内容
            $('#ul1').html(html);

            detail();

            //新的搜索对象
            new SEARCH_ENGINE("search-test-inner","search-value","search-value-list","search-li");

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
}

getData();

var map;

(function(){
    window.BMap_loadScriptTime = (new Date).getTime();
    document.write('<script type="text/javascript" src="http://api.map.baidu.com/getscript?v=2.0&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&services=&t=20170803155555"></script>');
})();

//右上角城市切换功能
function detail(){

    for(var i = 0; i < markerArr.length; i++){
        (function (i){

            $('.titles').eq(i).off('click');
            $('.titles').eq(i).on('click',function(){

                var p0 = markerArr[i].point.split(",")[0];
                var p1 = markerArr[i].point.split(",")[1];
                map.centerAndZoom(new BMap.Point(p0, p1), 15);

                $('.BMap_noprint').eq(i).click();


            });
        })(i)
    }
}

function detail1(){

    console.log($('.search-value-list li').length);

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
}

var removeNum = 0;

var makeArr = [];

//地点的文字标注与事件绑定

function addWords(){
    var arr = [];
    var points = [];
    for (var i = 0; i < markerArr.length; i++) {
        var p0 = markerArr[i].point.split(",")[0];
        var p1 = markerArr[i].point.split(",")[1];
        var words = markerArr[i].title;
        var address = markerArr[i].address;
        var online = markerArr[i].online;
        //判断是否在线
        if(online){
            //这个是你要显示坐标的图片的相对路径
            var icons = "img/red.png";
            //右上角小圆圈颜色
            $('#ul1 li:eq('+i+') span').css({
                'background':'red'
            })
            //console.log($('label'))
            $('label').css({
                'opacity':0
            })
            // var nodes = document.getElementsByClassName('BMapLabel');
            // //console.log(nodes);
            // //console.log(nodes[0])
            // //  nodes[0].style.width = 0;


        }else{
            var icons = "img/blue.png";
        }

        points[i]= new BMap.Point(p0,p1);
        var marker=new BMap.Marker(new BMap.Point(p0, p1));
        addInfoWindow(marker, markerArr[i], i);

        makeArr.push(marker);

        var icon = new BMap.Icon(icons, new BMap.Size(55, 55)); //显示图标大小
        marker.setIcon(icon);//设置标签的图标为自定义图标

        map.addOverlay(marker);//将标签添加到地图中去
        //添加文字标注

        var label = new BMap.Label(words,{offset:new BMap.Size(30,-10)});
        arr.push(label);
        marker.setLabel(label);
        //给每个被选中地点添加事件
        $(arr).each(function(i , o){
            o.setStyle({
                display:'none'
            })
        })

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
            })
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
            })
            $('#onOff').css({
                background:'url("img/off.png") no-repeat 0 1.5px',

            })
        }
    })

}


//右上角下拉菜单显示与隐藏
function showList(){
    $('#ul1').toggle();

}

// 添加信息窗口
function addInfoWindow(marker, poi) {
    //pop弹窗标题
    var title = '<div style="font-weight:bold;color:#CE5521;font-size:14px;width:100%;height:30px;font-size:16px;">' + poi.title +'<button style="float:right;margin-right:20px;color:black;cursor:pointer;font-size: 12px;font-weight:500;padding:0px 5px 0px 5px;height:24px;line-height: 20px;" onclick="showTrack(\''+poi.id+'\',\''+poi.point+'\')" class="show-track" title="运动轨迹"></button></div>';
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
})

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
        'display':'block'
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

//判断当前应该显示还是隐藏轨迹
var showTrackNum = 0;

//显示运动轨迹
function showTrack(string,point){

    if(showTrackNum % 2 != 0){
        $('.show-track').removeClass('show-track1');
        //隐藏运动轨迹 刷新页面
      $(polylineArr).each(function(i,o){
          map.removeOverlay(o);
      });
        var num = 0;
        //获取当年需显示轨迹的对象
        $(markerArr).each(function(i,o){
            if(string == o.id){
                num = i
            }
        });

        //把其他点重新显示
        $(makeArr).each(function(i,o){
            if(i != num){
                map.addOverlay(o);
            }
        });
        showTrackNum ++;
    }else{
        //获取当前时间
        var startTime = moment().format('YYYY-MM-DD');
        var endTime = moment().add(1,'day').format('YYYY-MM-DD');

        //获取人员运动轨迹
        $.ajax({
            type: 'get',
            url: _urls + "/YWTrajectory/GetSysUserLocation",
            timeout: theTimes,
            data:{
                "userNum": string,
                'st':startTime,
                'et':endTime
            },
            beforeSend: function () {
                $('#theLoading').modal('show');

            },

            complete: function () {
                //$('#theLoading').modal('hide');
            },
            success: function (data) {
                $('#theLoading').modal('hide');
                //无轨迹信息
                if(data.length ==0){
                    myAlter('无轨迹信息');
                    return false;
                }
                //清空添加线数组
                polylineArr = [];
                points = [];
                bPoints = [];

                $('.show-track').addClass('show-track1');
                var num = 0;
                //获取当年需显示轨迹的对象
                $(markerArr).each(function(i,o){
                    if(string == o.id){
                        num = i
                    }
                });
                //把其他点隐藏起来，防止干扰
                $(makeArr).each(function(i,o){
                    if(i != num){
                        map.removeOverlay(o);
                    }
                });


                var obj = {

                };
                obj.longitude = point.split(",")[0];
                obj.latitude = point.split(",")[1];
                data.unshift(obj);
                console.log(data);
                $(data).each(function(i,o){
                    var p0 = o.longitude;
                    var p1 = o.latitude;

                    //给每个被选中地点添加事件
                    dynamicLine(p0,p1);
                });
                showTrackNum ++;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }
        });
    }


}
//数据准备,
var points = [];//原始点信息数组
var bPoints = [];//百度化坐标数组。用于更新显示范围。

//存放添加线
var polylineArr = [];

//添加线
function addLine(points){

    var linePoints = [],pointsLen = points.length,i,polyline;
    if(pointsLen == 0){
        return;
    }
    // 创建标注对象并添加到地图
    for(i = 0;i <pointsLen;i++){
        linePoints.push(new BMap.Point(points[i].lng,points[i].lat));
    }

    polyline = new BMap.Polyline(linePoints, {strokeColor:"blue", strokeWeight:10, strokeOpacity:0.5});   //创建折线
    map.addOverlay(polyline);   //增加折线

    polylineArr.push(polyline);
}



//生成新的点，加入到轨迹中。
function dynamicLine(lng,lat){

    var lng = lng;
    var lat = lat;
    var id = getRandom(1000);
    var point = {"lng":lng,"lat":lat,"status":1,"id":id}
    var makerPoints = [];
    var newLinePoints = [];
    var len;

    //makerPoints.push(point);
    //addMarker(makerPoints);//增加对应该的轨迹点
    points.push(point);
    bPoints.push(new BMap.Point(lng,lat));
    len = points.length;
    newLinePoints = points.slice(len-2, len);//最后两个点用来画线。

    addLine(newLinePoints);//增加轨迹线
    setZoom(bPoints);
}

// 获取随机数
function getRandom(n){
    return Math.random()*n+1
}

//根据点信息实时更新地图显示范围，让轨迹完整显示。设置新的中心点和显示级别
function setZoom(bPoints){
    var view = map.getViewport(eval(bPoints));
    var mapZoom = parseInt(view.zoom) - 1;
    var centerPoint = view.center;
    map.centerAndZoom(centerPoint,mapZoom);
}

//在轨迹点上创建图标，并添加点击事件，显示轨迹点信息。points,数组。
function addMarker(points){
    var pointsLen = points.length;
    if(pointsLen == 0){
        return;
    }
    var myIcon = new BMap.Icon("img/blue.png", new BMap.Size(55, 55)
    );
    // 创建标注对象并添加到地图
    for(var i = 0;i <pointsLen;i++){
        var point = new BMap.Point(points[i].lng,points[i].lat);
        var marker = new BMap.Marker(point, {icon: myIcon});
        map.addOverlay(marker);
    }
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
            s = 2;
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

            for(var i=0;i<tempArray.length;i++){
                var sArray = tempArray[i].split("&");

                html += '<li>';

                //判断是否在线
                var color;
                if(sArray[2] == '不在线'){

                    color = '#2097f3';
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
            })
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

