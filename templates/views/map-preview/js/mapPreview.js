/**
 * Created by admin on 2017/6/20.
 */
//获取得地图数据
var markerArr = [
    { title: "广州火车站", point: "113.264531,23.157003", address: "广东省广州市广州火车站", tel:"12306", online: 0 },
    { title: "广州塔（赤岗塔）", point: "113.330934,23.113401", address: "广东省广州市广州塔（赤岗塔） ", tel: "18500000000", online: 0  },
    { title: "广州动物园", point: "113.312213,23.147267", address: "广东省广州市广州动物园", tel:"18500000000", online: 1  },
    { title: "天河公园", point: "113.372867,23.134274", address: "广东省广州市天河公园", tel: "18500000000", online: 0  }
];
//新建百度地图
var map = new BMap.Map("container");
map.centerAndZoom(new BMap.Point(113.312213, 23.147267), 13);
//可以进行缩放
map.enableScrollWheelZoom();
map.addControl(new BMap.NavigationControl());




detail();
addWords();
//右上角城市切换功能
function detail(){

    for(var i = 0; i < markerArr.length; i++){
        (function (i){

            $('.titles').eq(i).click(function(){

                var p0 = markerArr[i].point.split(",")[0];
                var p1 = markerArr[i].point.split(",")[1];
                map.centerAndZoom(new BMap.Point(p0, p1), 15);
            });

            $('.search-value-list li').eq(i + 1).click(function(){
                console.log('.search-value-list');
                var p0 = markerArr[i].point.split(",")[0];
                var p1 = markerArr[i].point.split(",")[1];
                map.centerAndZoom(new BMap.Point(p0, p1), 15);
            });


        })(i)
    }
}

var removeNum = 0;

//地点得文字标注与事件绑定
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
            console.log($('label'))
            $('label').css({
                'opacity':0
            })
            // var nodes = document.getElementsByClassName('BMapLabel');
            // console.log(nodes);
            // console.log(nodes[0])
            // //  nodes[0].style.width = 0;


        }else{
            var icons = "img/blue.png";
        }

        points[i]= new BMap.Point(p0,p1);
        var marker=new BMap.Marker(new BMap.Point(p0, p1));
        addInfoWindow(marker, markerArr[i], i);
        var icon = new BMap.Icon(icons, new BMap.Size(55, 55)); //显示图标大小
        marker.setIcon(icon);//设置标签的图标为自定义图标

        map.addOverlay(marker);//将标签添加到地图中去
        //添加文字标注

        var label = new BMap.Label(words,{offset:new BMap.Size(30,-10)});
        arr.push(label);
        marker.setLabel(label);
        //给每个被选中地点添加事件

        // map.setViewport(points);

    }

    map.addEventListener("zoomend", function () {
        var DiTu = this.getZoom();

        if (DiTu >= 13)
        {
            $(arr).each(function(i , o){
                o.setStyle({
                    display:'block'
                })
            })
        }
        else
        {
            $(arr).each(function(i , o){
                o.setStyle({
                    display:'none'
                })
            })
        }

        //map.removeEventListener("zoomend", showInfo);
    });
    //右上角label开关
    $('#onOff').on('click',function(){
        removeNum ++;
        if(removeNum % 2){

            $(arr).each(function(i , o){
                o.setStyle({
                    display:'none'
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
                    display:'block'
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
    var title = '<div style="font-weight:bold;color:#CE5521;font-size:14px;width:100%;height:30px;font-size:16px;margin-bottom:10px">' + poi.title +'</div>';
    //pop弹窗信息
    var html = [];
    html.push('<div style="font-size:14px;width:100%;height:280px;">'+
        '<p style="margin-bottom:5px" class="monitorTitle">A地点：<span>污水排放情况</span></p>'+

        '</div>');
    var infoWindow = new BMap.InfoWindow(html.join(""), {enableMessage: false, title: title, width: 250, height:60 });

    var openInfoWinFun = function () {

        marker.openInfoWindow(infoWindow);

        //各个监测点排列
        var num = $('.datailArea').length;
        var length = 0;
        for(var i = 0; i < num; i++){

            length += parseInt($('.datailArea').eq(i).width()) + 25;
            //判断监测点是否超出允许宽度
            if(length > 350){
                for( var j = i; j < num; j++ ){
                    var content = $('.datailArea').eq(i).html();
                    //超出后将其从上方删除
                    $('.datailArea').eq(i).remove();
                    //添加到‘其他地点’列表中
                    $('.otherAreas').append('<li>' + content + '</li>');
                }
                //给'其他地点'中的li绑定事件
                onShow();
                return false;
            }
        }


    };

    marker.addEventListener("mouseover", openInfoWinFun);
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

//右上角关闭按钮
function closeCompany(){
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


//引用
$(function(){
    // search-test-inner --->  最外层div
    // search-value --->  input 输入框
    // search-value-list --->  搜索结果显示div
    // search-li --->  搜索条目
    new SEARCH_ENGINE("search-test-inner","search-value","search-value-list","search-li");

});


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

}

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
            detail();

        });
    }
};

