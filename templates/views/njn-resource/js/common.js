/**
 * Created by admin on 2018/1/12.
 */
$(function(){

    //获取页面左侧站点数据
    getStationInfo();

    //获取下方能源管理数据
    getPointerData();

    //点击左侧下方选项卡
    $('.left-tab-container .left-tab').on('click',function(){

        //删除之前选中的类
        for(var i=0; i< $(this).parents('.left-tab-container').find('.left-tab').length; i++){

            //获取当前的类名
            var className = 'left-tab-choose'+i;

            //删除对应的类名
            $(this).parents('.left-tab-container').find('.left-tab').eq(i).removeClass(className);

            $(this).parents('.left-tab-container').find('.left-tab').eq(i).removeClass('left-tab-choose');
        }

        //获取当前点击的index
        var onIndex = $(this).index();

        //当前选中后对应的类名
        var onClassName = 'left-tab-choose'+onIndex;

        //给当前选中元素添加选中类名
        $(this).addClass(onClassName);

        $(this).addClass('left-tab-choose');

    });

    //点击左侧日月年切换
    $('.inner-left-container .left-tab-container .right-tab').on('click',function(){

        //删除之前选中的类
        $(this).parents('.left-tab-container').find('.right-tab').removeClass('right-tab-choose');

        //给当前选中元素添加选中类名
        $(this).addClass('right-tab-choose');

        //获取下方能源管理数据
        getPointerData();

    });

    //点击不同区域获取不同的设备列表
    $('#monitor-menu-container').on('click','span',function(){

        //获取当前url
        var url = window.location.href;

        //如果是电梯页面 不走此方法
        if(url.indexOf('elevator.html') > -1){

            return false;
        }

        //获取当前的区域ID
        var areaID = $(this).attr('data-district');

        $(".right-bottom-tab").removeClass("right-bottom-tab-choose");
        $(this).addClass("right-bottom-tab-choose");

        sessionStorage.menuArg = '4,'+ areaID + "," + procType;

        if(url.indexOf('exhaustAir.html') > -1 || url.indexOf('supDraWater.html') > -1){

            //获取对应流程图
            userMonitor.init("1200,698",jumpPageSize,1);

        }else{

            //获取对应流程图
            userMonitor.init("1200,698",false,1);
        }

    });

    //点击能源管理上方切换能耗类型按钮
    $('.right-bottom-energyment-control .left-tab').on('click',function(){

        //获取后台能耗数据
        getPointerData();

    });

    //点击能源管理上方时间按钮
    $('.right-bottom-energyment-control .right-tab').on('click',function(){

        //改变选择日月年类型
        $('.right-bottom-energyment-control .right-tab').removeClass('right-tab-choose');

        $(this).addClass('right-tab-choose');

        //获取后台能耗数据
        getPointerData();

    });

    //获取当前年月日放入页面中
    var curYear = moment().format('YYYY');

    var curMonth = moment().format('MM');

    var curDay = moment().format('DD');

    $('.left-tab-container .year').html(curYear);

    $('.left-tab-container .month').html(curMonth);

    $('.left-tab-container .day').html(curDay);

    //给大屏页面添加返回按钮
    var $button = $('<div class="right-info-header-logo"></div>');

    //插入页面中
    $('.inner-right-container').append($button);


    $('.right-info-header-logo').on('click',function(){

        window.location.href = "../passengerStation/passengerStation.html?sendUrl=new-nengyuanzonglan/new-index.html";
    });

    //当鼠标放到系统选项卡上时
    $('.right-tab-container').on('hover','span',function(){

        var jumpData = $(this).attr('jump-data');

        //暖通系统
        if(jumpData){

            jumpData = parseInt(jumpData);

            $(".jump-container").eq(jumpData).show();

        }

    });

    $('.right-tab-container').on('hover','.jump-container',function(){

        $(this).show();
    });



    //当鼠标离开系统选项卡上时
    $('.right-tab-container').on('mouseleave','span',function(){

        var jumpData = $(this).attr('jump-data');

        //暖通系统
        if(jumpData){

            jumpData = parseInt(jumpData);


            $(".jump-container").eq(jumpData).hide();

        }

    });

    $('.right-tab-container').on('mouseleave','.jump-container',function(){

        $(this).hide();
    });

});

var ifShowLoading1 = true;

//定义送排风 给排水弹出页面的宽高
var jumpPageSize = "1020,586";

//定义初始的楼宇ID
if(!sessionStorage.PointerID){

    if(sessionStorage.pointers){
        var pos = JSON.parse(sessionStorage.pointers);
        var po = pos[0];
        sessionStorage.PointerID = po.pointerID;
        sessionStorage.PointerName = po.pointerName;
    }

}

//定义流程图的方案类型
var procType;

//页面右侧报警刷新时间 单位（秒）
var carouselTime = 5;

$('.left-tab-data-container span font').html(0);

//绘制页面上方的跳转选项卡
drawRightTab();

//页面右侧上方选项卡
function drawRightTab(){

    var tabHtml = '<span class="right-tab right-tab1"><a href="pandectEnergy.html">总览</a></span>' +
        //'<span class="right-tab right-tab2"><a href="coldHeatSource.html">冷热源</a></span>' +
        '<span class="right-tab right-tab2 " jump-data="0"><a href="javascript:;">暖通空调</a></span>' +
        '<span class="right-tab right-tab2"><a href="elevator.html">电梯系统</a></span>' +
        '<span class="right-tab right-tab2"><a href="sealHead.html">动环系统</a></span>' +
        '<span class="right-tab right-tab2" jump-data="1"><a href="javascript:;">照明系统</a></span>' +
        //'<span class="right-tab right-tab2"><a href="platform.html">站台照明</a></span>' +
        //'<span class="right-tab right-tab2 "><a href="exhaustAir.html">送排风</a></span>' +
        '<span class="right-tab right-tab2"><a href="supDraWater.html">给排水</a></span>' +
        '<span class="right-tab right-tab2" jump-data="2"><a href="automaticCheck.html">售检票</a></span>' +
        //'<span class="right-tab right-tab2"><a href="automaticSale.html">自动售票</a></span>' +
        '<span class="right-tab right-tab2 "><a href="automaticCheck.html">消防系统</a></span>' +
        '<span class="right-tab right-tab3 "><a href="energyManagement.html">能源管理</a></span>';

    //插入页面中
    $('.inner-right-container .right-tab-container').html(tabHtml);

    var html = "<div class='jump-container'>" +
                    "<span><a href='coldHeatSource.html'>冷热源</a></span>" +
                    "<span><a href='airConditioner.html'>空调机组</a></span>" +
                    "<span><a href='exhaustAir.html'>送排风</a></span>" +
                "</div>";

    //插入页面中
    $('.inner-right-container .right-tab-container').append(html);

    var html1 = "<div class='jump-container jump-container1'>" +
        "<span><a href='stationBuilding.html'>站房照明</a></span>" +
        "<span><a href='platform.html'>站台照明</a></span>" +
        "</div>";

    //插入页面中
    $('.inner-right-container .right-tab-container').append(html1);

    var html2 = "<div class='jump-container jump-container2'>" +
        "<span><a href='automaticSale.html'>自动售票</a></span>" +
        "<span><a href='automaticCheck.html'>自动检票</a></span>" +
        "</div>";

    //插入页面中
    $('.inner-right-container .right-tab-container').append(html2);

    //获取当前页面url
    var pageUrl = window.location.href;

    //给当前页面的span 添加对应的选中类名
    for(var i=0; i<$('.inner-right-container .right-tab-container span').length; i++){

        //获取当前a标签中跳转地址
        var jumpUrl = $('.inner-right-container .right-tab-container span').eq(i).find('a').attr('href');

        //判断是否是要添加类名的页面
        if(pageUrl.indexOf(jumpUrl) > -1 && jumpUrl != ''){

            if(i != $('.inner-right-container .right-tab-container .right-tab').length -1){

                $('.inner-right-container .right-tab-container .right-tab').eq(i).addClass('right-tab-choose1');

            }else{
                $('.inner-right-container .right-tab-container .right-tab').eq(i).addClass('right-tab-choose2');
            }

        }
    }

    //如果是暖通系统
    if(pageUrl.indexOf('exhaustAir.html') > -1 || pageUrl.indexOf('airConditioner.html') > -1 ||pageUrl.indexOf('coldHeatSource.html') > -1){

        $('.inner-right-container .right-tab-container .right-tab').eq(1).addClass('right-tab-choose1');
    }

    //如果是照明系统
    if(pageUrl.indexOf('stationBuilding.html') > -1 || pageUrl.indexOf('platform.html') > -1){

        $('.inner-right-container .right-tab-container .right-tab').eq(4).addClass('right-tab-choose1');
    }

};

//能源管理echart
//左侧下方柱状图
var leftBottomChart1 = echarts.init(document.getElementById('echarts-left-bottom1'));

var option00 = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '2%',
        right: '2%',
        bottom: '12%',
        top:'8%',
        containLabel: true,
        borderColor:'#A8A8A8',
        borderWidth:2
    },
    xAxis : [
        {
            type : 'category',
            data : ['1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12'],
            axisTick: {
                alignWithLabel: true
            },
            nameTextStyle:{
                color:'#DCF1FF'
            },
            axisLine:{
                lineStyle:{
                    color:'#DCF1FF'
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            nameTextStyle:{
                color:'#DCF1FF'
            },
            axisLine:{
                lineStyle:{
                    color:'#DCF1FF'
                }
            }
        }
    ],
    series : [
        {
            name:'总能耗',
            type:'bar',
            barWidth: '60%',
            data:[810, 952, 900, 934, 890, 730, 1020, 952, 900, 934, 890, 730]
        }
    ]
};

//重绘chart图
leftBottomChart1.setOption(option00);

var option0 = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top:'8%',
        containLabel: true,
        borderColor:'#A8A8A8',
        borderWidth:2
    },
    xAxis : [
        {
            type : 'category',
            data : [],
            axisTick: {
                alignWithLabel: true
            },
            boundaryGap: false,//从起点开始
            nameTextStyle:{
                color:'#DCF1FF'
            },
            nameGap:1,
            axisLine:{
                lineStyle:{
                    color:'#DCF1FF'
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            nameTextStyle:{
                color:'#DCF1FF'
            },
            //name:'单位：次',
            nameLocation:'end',
            axisLine:{
                lineStyle:{
                    color:'#DCF1FF'
                }
            }
        }
    ],
    series : [
        {
            name:'设备报警',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            smooth:true,
            itemStyle:{
                normal:{
                    color:'#fff',
                    borderColor: "#2170F4",
                    lineStyle:{
                        width:2,
                        color:'#fff'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2170F4'
                    }, {
                        offset: 1,
                        color: '#61854f'
                    }])
                }
            },
            data:[]
        },
        {
            name:'能耗报警',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            smooth:true,
            itemStyle:{
                normal:{
                    color:'#fff',
                    borderColor: "#14E398",
                    lineStyle:{
                        width:2,
                        color:'#fff'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#14E398'
                    }, {
                        offset: 1,
                        color: '#61854f'
                    }])
                }
            },
            data:[]
        },
        {
            name:'能耗报警',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            smooth:true,
            itemStyle:{
                normal:{
                    color:'#fff',
                    borderColor: "#EAD01E",
                    lineStyle:{
                        width:2,
                        color:'#fff'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#EAD01E'
                    }, {
                        offset: 1,
                        color: '#61854f'
                    }])
                }
            },
            data:[]
        }
    ]
};

var option1 = {
    title:{
        text:'30%',
        textStyle:{
            color:'#09D188',
            fontSize:8,
            fontWeight:'normal'
        },
        bottom:"22%",
        left:'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'占比',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#09D188','#B4B8BC'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : false
                    },
                    labelLine : {
                        show : false
                    }
                },
                emphasis : {
                    label : {
                        show : true,
                        position : 'center',
                        textStyle : {
                            fontSize : '30',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:135, name:'直接访问'},
                {value:210, name:'邮件营销'}
            ]
        }
    ]
};

//获取全部楼宇ID列表
var pointerIdArr = getPointersId();

//接入客站数等于获取到的楼宇数
$('.left-data-container .left-specific-data1').html( pointerIdArr.length);

//当前楼宇ID
var curPointerIDArr = ['3101800201'];

//获取全部分户ID列表
var officeIdArr = getOfficesId();

//点击右侧上方选项卡
$('.right-tab-container .right-tab').on('click',function(){

    //获取选项卡的长度
    var tabLength = $('.right-tab-container .right-tab').length;

    //删除之前选中的类
    for(var i=0; i< tabLength; i++){

        //获取当前的类名
        var className;

        //中间的选项卡
        if( i>0 && i<tabLength -1 ){

            className = 'right-tab-choose1';
        //第一个选项卡
        }else if(i == 0){

            className = 'right-tab-choose0';
        //最后一个选项卡
        }else{

            className = 'right-tab-choose2';
        }

        //删除对应的类名
        $('.right-tab-container .right-tab').eq(i).removeClass(className);
    }

    //获取当前点击的index
    var onIndex = $(this).index();

    //当前选中后对应的类名
    var onClassName;
    //中间的选项卡
    if(onIndex > 0 && onIndex < tabLength - 1){

        onClassName = 'right-tab-choose1';
    //第一个选项卡
    }else if(onIndex == 0){

         onClassName = 'right-tab-choose0';
        //最后一个选项卡
    }else{

         onClassName = 'right-tab-choose2';
    }

    //给当前选中元素添加选中类名
    $(this).addClass(onClassName);



});

//点击右侧主体内容中的选项卡
$('.right-bottom-tab-container .right-bottom-tab').on('click',function(){

    //删除之前选中的类
    $('.right-bottom-tab-container .right-bottom-tab').removeClass('right-bottom-tab-choose');

    //给当前选中元素添加选中类名
    $(this).addClass('right-bottom-tab-choose');

});

//点击右上角切换选项卡
$('.right-bottom-top-tab span').on('click',function(){

    $('.right-bottom-top-tab span').removeClass('onChoose');

    $(this).addClass('onChoose');

    //获取当前index
    var index = $(this).index();

    //显示选项卡对应的内容
    $('.right-bottom-show-type').hide();

    $('.right-bottom-show-type').eq(index).show();

});

//页面右上角时间刷新
getNowTime();

//获取温度湿度
getWeatherParam();

//关闭弹窗中的流程图
$('#right-container').on('click','.close1',function(){

    //获取到要删除的元素
    var dom = $(this).parents('.content-child-show');

    dom.remove();
});

//------------------------------------页面右上角时间温度-----------------------------------//

//获取实时时间
function getNowTime(){


    var time1 = moment().format('HH:mm:ss');

    var time2 = moment().format('YYYY-MM-DD');

    $('.right-top-message .top-message').eq(0).html(time1);

    $('.right-top-message .bottom-message').eq(0).html(time2);

    setTimeout(function(){

        getNowTime();

    },1000)
};

//获取当年气象参数
function getWeatherParam(){

    //传递给后台的数据
    var ecParams = {
        pointerID : pointerIdArr[0]
    };
    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetWeatherByPointer',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result){

            //console.log(result);
            //无数据
            if(result == null || result.length == 0){
                //隐藏温度 和湿度
                $('.right-top-message .top-message').eq(1).html("");

                //湿度
                $('.right-top-message .top-message').eq(2).html("");

                return false;
            }
            //给页面中赋值
            //温度
            $('.right-top-message .top-message').eq(1).html(result.temperatureData + '℃');

            //湿度
            $('.right-top-message .top-message').eq(2).html(result.humidityData + "%");

        },
        error:function(jqXHR, textStatus, errorThrown){
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};

//从本地存储中获取楼宇ID列表
function getPointersId(){

    //存放楼宇ID列表
    var pointerIdArr = [];

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));


    $(pointerArr).each(function(i,o){

        pointerIdArr.push(o.pointerID);
    });

    return pointerIdArr;
};

//从本地存储中获取分户ID列表
function getOfficesId(){

    //存放分户ID列表
    var officeIdArr = [];

    var officeArr = $.parseJSON(sessionStorage.getItem('offices'));


    $(officeArr).each(function(i,o){

        officeIdArr.push(o.f_OfficeID);
    });

    return officeIdArr;
};

//------------------------------------页面左侧站点数据-----------------------------------//
function getStationInfo(){


    //传递给后台的数据
    var ecParams = {
        "":  curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'NJNDeviceShow/GetStationInfo',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result){

            //console.log(result);

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //接入系统数
            $('.right-picture-data .right-picture-statistics').eq(0).find('span').html(result.accessSysNum);

            //接入设备数
            $('.right-picture-data .right-picture-statistics').eq(1).find('span').html(result.accessDevNum);

            //检测点位数
            $('.right-picture-data .right-picture-statistics').eq(2).find('span').html(result.monitPintNum);

        },
        error:function(jqXHR, textStatus, errorThrown){



            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                console.log('超时');

            }else{
                console.log('请求失败');

            }

        }
    })
};

//------------------------------------页面左侧下方echarts图-----------------------------------//

//上方统计数据
function getStationAlarmNum(){

    //获取开始结束时间
    var startDate = getPostTime()[0];

    var endDate = getPostTime()[1];

    //获取展示时间类型
    var showDateType = getShowDateType()[0];

    //获取选择日期类型
    var selectDateType = getShowDateType()[1];

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "showDateType":showDateType,
        "selectDateType": selectDateType,
        "pointerIDs":  curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'Alarm/GetStationAlarmNum',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){


        },
        success:function(result){

            //console.log(result);
            //无数据
            if(result == null || result.length == 0){

                //设备报警
                $('.left-tab-data-container .left-tab-data1 font').html(0);

                ////能耗报警
                //$('.left-tab-data-container .left-tab-data2 font').html(0);
                //
                ////运维工单
                //$('.left-tab-data-container .left-tab-data3 font').html(0);

                return false;
            }

            //设备报警
            $('.left-tab-data-container .left-tab-data1 font').html(result.facilityAlarmNum);

            ////能耗报警
            //$('.left-tab-data-container .left-tab-data2 font').html(result.energyAlarmNum);

        },
        error:function(jqXHR, textStatus, errorThrown){
             leftBottomChart.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//下方echarts图  index参数 1.设别报警 2.能耗报警 3.运维工单
function getStationAlarmData(index){

    //获取开始结束时间
    var startDate = getPostTime()[0];

    var endDate = getPostTime()[1];

    //获取展示时间类型
    var showDateType = getShowDateType()[0];

    //获取选择日期类型
    var selectDateType = getShowDateType()[1];

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "showDateType":showDateType,
        "selectDateType": selectDateType,
        "pointerIDs":  curPointerIDArr,
        "stationAlarmType":index
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'Alarm/GetStationAlarmNumData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            leftBottomChart.showLoading({
                maskColor: 'rgba(33,43,55,0.8)'
            });

        },
        success:function(result){

            //console.log(result);

            leftBottomChart.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                leftBottomOption.series[index-1].data = [];

                leftBottomOption.series[2].data = [];

                return false;
            }

            //if(result.length > 1){
            //
            //    //删除数组的最后一项
            //    result.pop();
            //}

            //存放能耗数据
            var dataArr = [];

            //存放X轴
            var xArr = [];


            $(result).each(function(i,o){

                //获取能耗数据
                dataArr.push(o.data);

                //按天展示
                if(selectDateType == "Day"){

                    var date = o.dataDate.split('T')[1];

                    xArr.push( date.split(':')[0]+":"+date.split(':')[1]);

                }else{

                    xArr.push(o.dataDate.split('T')[0]);
                }

            });

            //console.log(leftBottomOption);

            //数据赋值
            leftBottomOption.series[index-1].data = dataArr;
            leftBottomOption.xAxis[0].data = xArr;

            //页面重绘数据
            leftBottomChart.setOption(leftBottomOption,true);

        },
        error:function(jqXHR, textStatus, errorThrown){
            leftBottomChart.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//展示日期类型 用户选择日期类型
function getShowDateType(){
    //获取页面日期类型
    var dateType = $('.right-bottom-container .left-tab-container .right-tab-choose').html();

    //定义展示日期类型
    var showDateType = '';

    //定义用于选择日期类型
    var selectDateType = '';

    if(dateType == '日'){

        showDateType = "Hour";
        selectDateType = "Day"

    }else if(dateType == '周'){

        showDateType = "Day";
        selectDateType = "Week"

    }else if(dateType == '月'){

        showDateType = "Day";
        selectDateType = "Month"

    }else if(dateType == '年'){

        showDateType = "Month";
        selectDateType = "Year"
    }else if(dateType == '自定义'){

        showDateType = "Custom";
        selectDateType = "Custom"
    }

    return [showDateType,selectDateType]
};

//获取给后台传递的时间
function getPostTime(){
    //获取页面日期类型
    var dateType = $('.right-bottom-container .left-tab-container .right-tab-choose').html();

    //定义开始时间
    var startTime = '';

    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = moment().format('YYYY-MM-DD');
        endTime = moment(startTime).add('1','days').format('YYYY-MM-DD');

    }else if(dateType == '月'){

        startTime = moment().startOf('month').format('YYYY-MM-DD');
        endTime = moment().endOf('month').format('YYYY-MM-DD');
    }else if(dateType == '年'){

        startTime = moment().startOf('year').format('YYYY-MM-DD');
        endTime = moment().endOf('year').format('YYYY-MM-DD');

    }

    return [startTime,endTime]
};

//根据区域ID以及设备类型从后台获取设备列表
function getSecondColdHotSour(url,devTypeID,areaID){

    //传递给后台的数据
    var ecParams = {
        "devTypeID": devTypeID,
        "areaID": areaID
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+url,
        data:ecParams,
        //timeout:_theTimes * 2,
        beforeSend:function(){

            var o1 = $(".right-bottom-show-type-table").css("display");

            if(o1 != 'none'){

                $('.right-bottom-show-type-table').showLoading();

            }

        },
        success:function(result){

            var o1 = $(".right-bottom-show-type-table").css("display");

            if(o1 != 'none'){

                $('.right-bottom-show-type-table').hideLoading();

            }

            //console.log(result);
            _datasTable($('#equipment-datatables'),result);

        },
        error:function(jqXHR, textStatus, errorThrown){


            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};

//获取距离现在的时间描述
function getTimeDescribe(dateString){

    //获取到报警时间距离现在的分钟数
    var minute = (new Date() - new Date(dateString)) / 1000 / 60;

    if(minute < 1){

        return '一分钟内';
    }else if(minute > 1 && minute < 5){

        return '五分钟内';
    }else if(minute > 5 && minute < 60){

        return '一小时内';
    }else if(minute > 60 && minute < 1440){

        return '一天内';
    }else if(minute > 60 && minute < 1440 * 3){

        return '三天内';
    }else if(minute > 60 && minute < 1440 * 30){

        return '一个月内';
    }
};

//获取页面右侧报警数据字符串 flag代表是第一条报警
function getRightAlarmString(alarmObj,flag){

    //定义返回的字符串
    var alarmString = '';

    //获取报警时间
    var dataDate = alarmObj.dataDate.split('T')[0] +' ' + alarmObj.dataDate.split('T')[1];

    //展示时间
    var showDate = getTimeDescribe(dataDate);

    if(flag){

        alarmString +=  '<div class="item active">' +
                //报警时间
            '<p class="right-bottom-alarm" title='+showDate+'>'+ '时间：'+showDate+'</p>'+

                //报警类型
            '<p class="right-bottom-alarm" title='+alarmObj.alarmSetName+'>'+ '类型：'+alarmObj.alarmSetName+'</p>'+
                //设备名称
            '<p class="right-bottom-alarm" title='+alarmObj.cDtnName+'>'+'设备：'+ alarmObj.cDtnName+'</p></div>';


    }else{

        alarmString +=  '<div class="item">' +
                //报警时间
            '<p class="right-bottom-alarm" title='+showDate+'>'+ '时间：'+showDate+'</p>'+

                //报警类型
            '<p class="right-bottom-alarm" title='+alarmObj.alarmSetName+'>'+ '类型：'+alarmObj.alarmSetName+'</p>'+

                //设备名称
            '<p class="right-bottom-alarm" title='+alarmObj.cDtnName+'>'+'设备：'+ alarmObj.cDtnName+'</p></div>';

    }

    return alarmString;
};

//获取页面中的上面要展示的区域及对应的ID
function getDevTypeAreas(devTypeID,fn){

    //获取当前楼宇ID
    var PointerID = sessionStorage.PointerID;

    var ecParams = {
        "devTypeID": devTypeID,
        "pointerID": PointerID
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'NJNDeviceShow/GetDevTypeAreas',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            //leftBottomChart.showLoading();

        },
        success:function(result){

            //console.log(result);

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            var $ul = $("#monitor-menu-container");

            //清空区域位置信息
            monitorAreaArr.length = 0;

            //给上方区域位置选项卡绑定元素
            $(result).each(function(i,o){

                //获取当前区域ID
                var areaID = o.areaID;

                //获取当前区域名称
                var areaName = o.areaName;

                $ul.append($("<span>",{text:areaName,class:'right-bottom-tab','data-district':areaID}));

                var areaObj =  {
                    "areaName":areaName,
                    "areaId":areaID
                };

                monitorAreaArr.push(areaObj);

            });

            //获取流程图右侧展示数据
            if(fn){
                fn();
            }

            //初始化样式
            $('.right-bottom-tab').eq(0).addClass('right-bottom-tab-choose');

            //获取方案类型
            procType = result[0].procType;
            //console.log(procType);

            //默认获取首张流程图
            sessionStorage.menuArg = '4,'+ monitorAreaArr[0].areaId + "," + procType;

            //获取当前url
            var url = window.location.href;

            if(url.indexOf('exhaustAir.html') > -1 || url.indexOf('supDraWater.html') > -1){

                //获取对应流程图
                userMonitor.init("1200,698",jumpPageSize,1);

            }else{

                //获取对应流程图
                userMonitor.init("1200,698",false,1);
            }

            $('#monitor-menu-container span').eq(0).click();

        },
        error:function(jqXHR, textStatus, errorThrown){
            //leftBottomChart.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};

//获取下方能源管理数据
function getPointerData(){

    //定义存放返回数据的数组（本期 X Y）
    var allData = [];
    var allDataX = [];
    var allDataY = [];
    var totalAllData = 0;

    //存放要传的楼宇集合
    var postPointerID = [];

    //存放要传的分户ID
    var officeID = '';

    //存放要传的支路ID
    var serviceID = '';

    //是否标煤
    var isBiaoMeiEnergy = 0;

    //单位类型 0为kwh t
    var unitType = '0';

    //确定楼宇id

    postPointerID.push(curPointerIDArr);

    //能耗类型
    _ajaxEcType = $('.right-bottom-energyment-control .left-tab-choose').attr('unit-type');

    //获取展示日期类型
    var showDateType = getShowDateType1()[0];

    //获取用户选择日期类型
    var selectDateType = getShowDateType1()[1];

    //获取开始时间
    var startTime = getPostTime11()[0];

    //获取开始时间
    var endTime = getPostTime11()[1];

    //定义获得数据的参数
    var ecParams = {
        "energyItemID": _ajaxEcType,
        "isBiaoMeiEnergy": isBiaoMeiEnergy,
        "pointerIDs": postPointerID,
        "officeID": officeID,
        "serviceID": serviceID,
        "unityType": unitType,
        "showDateType": showDateType,
        "selectDateType": selectDateType,
        "startTime": startTime,
        "endTime": endTime
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyQueryV2/GetPointerEnergyQuery',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            if(ifShowLoading1){

                leftBottomChart1.showLoading({
                    maskColor: 'rgba(33,43,55,0.8)'
                });

                ifShowLoading1 = false;
            }

        },
        success:function(result){

            leftBottomChart1.hideLoading();
            //console.log(result);

            //判断是否返回数据
            if(result == null){

                option00.xAxis[0].data = [];
                option00.series[0].data = [];

                leftBottomChart1.setOption(option00);

                return false;
            }


            //首先处理本期的数据
            allData.length = 0;

            $(result.ecMetaDatas).each(function(i,o){
                allData.push(o);
            });

            //首先处理实时数据
            allDataX.length = 0;
            allDataY.length = 0;

            //绘制echarts
            if(showDateType == 'Hour' ){
                //确定x轴
                for(var i=0;i<allData.length;i++){
                    var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                    var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataJoin);
                    }
                }
            }else{
                //确定x轴
                for(var i=0;i<allData.length;i++){
                    var dataSplit = allData[i].dataDate.split('T')[0];

                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataSplit);
                    }
                }
            };

            //确定本期y轴
            for(var i=0;i<allData.length;i++){
                allDataY.push(allData[i].data.toFixed(1));
            }

            //echart柱状图
            option00.xAxis[0].data = allDataX;
            option00.series[0].data = allDataY;

            leftBottomChart1.setOption(option00);

        },
        error:function(jqXHR, textStatus, errorThrown){
            leftBottomChart1.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
        }
    })
};

//展示日期类型 用户选择日期类型以及开始结束时间
function getShowDateType1(){
    //获取页面日期类型
    var dateType = $('.right-bottom-energyment-control .right-tab-choose').html();

    //定义展示日期类型
    var showDateType = '';

    //定义用于选择日期类型
    var selectDateType = '';

    if(dateType == '日'){

        showDateType = "Hour";
        selectDateType = "Day"

    }else if(dateType == '周'){

        showDateType = "Day";
        selectDateType = "Week"

    }else if(dateType == '月'){

        showDateType = "Day";
        selectDateType = "Month"

    }else if(dateType == '年'){

        showDateType = "Month";
        selectDateType = "Year"
    }else if(dateType == '自定义'){

        showDateType = "Custom";
        selectDateType = "Custom"
    }

    return [showDateType,selectDateType]
};

//获取开始结束时间
function getPostTime11(){
    //获取页面日期类型
    var dateType = $('.right-bottom-energyment-control .right-tab-choose').html();

    //定义开始时间
    var startTime = '';

    if($('.min').length > 0){

        startTime = $('.min').val();
    }

    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = moment().format('YYYY-MM-DD');
        endTime = moment(startTime).add('1','days').format('YYYY-MM-DD');

    }else if(dateType == '周'){

        startTime = startTime;

        endTime = moment(startTime).add('7','days').format('YYYY-MM-DD');

    }else if(dateType == '月'){

        startTime = moment().startOf('month').format('YYYY-MM-DD');

        endTime = moment(startTime).add('1','months').startOf('month').format('YYYY-MM-DD');
    }else if(dateType == '年'){

        endTime = moment().endOf('year').add(1,'days').format('YYYY-MM-DD');
        startTime = moment().startOf('year').format('YYYY-MM-DD');

    }else if(dateType == '自定义'){

        startTime = startTime;
        endTime = moment($('.max').val()).add('1','days').format('YYYY-MM-DD');
    }

    return [startTime,endTime]
};

//展示日期类型 用户选择日期类型以及开始结束时间
function getShowDateTypeByDom(dom){
    //获取页面日期类型
    var dateType = $(dom).html();

    //定义展示日期类型
    var showDateType = '';

    //定义用于选择日期类型
    var selectDateType = '';

    if(dateType == '日'){

        showDateType = "Hour";
        selectDateType = "Day"

    }else if(dateType == '周'){

        showDateType = "Day";
        selectDateType = "Week"

    }else if(dateType == '月'){

        showDateType = "Day";
        selectDateType = "Month"

    }else if(dateType == '年'){

        showDateType = "Month";
        selectDateType = "Year"
    }else if(dateType == '自定义'){

        showDateType = "Custom";
        selectDateType = "Custom"
    }

    return [showDateType,selectDateType]
};

//获取开始结束时间
function getPostTimeByDom(dom){

    //获取页面日期类型
    var dateType = $(dom).html();

    //定义开始时间
    var startTime = '';

    if($('.min').length > 0){

        startTime = $('.min').val();
    }

    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = moment().format('YYYY-MM-DD');
        endTime = moment(startTime).add('1','days').format('YYYY-MM-DD');

    }else if(dateType == '周'){

        startTime = startTime;

        endTime = moment(startTime).add('7','days').format('YYYY-MM-DD');

    }else if(dateType == '月'){

        startTime = moment().startOf('month').format('YYYY-MM-DD');

        endTime = moment(startTime).add('1','months').startOf('month').format('YYYY-MM-DD');
    }else if(dateType == '年'){

        endTime = moment().endOf('year').add(1,'days').format('YYYY-MM-DD');
        startTime = moment().startOf('year').format('YYYY-MM-DD');

    }else if(dateType == '自定义'){

        startTime = startTime;
        endTime = moment($('.max').val()).add('1','days').format('YYYY-MM-DD');
    }

    return [startTime,endTime]
};

//对后台返回的表格数据进行包装，方便datatables插件进行调用
function packagingTableData(tableData){

    //定义新生产的table数组
    var newTableArr = [];

    //获取到名称数组
    var titleArr = tableData.columns;

    //获取数据数组
    var dataArr = tableData.data;

    //遍历数据数组
    $(dataArr).each(function(i,o){

        //定义新的对象
        var obj = {};

        //取出每行的数据
        var lineArr = o;

        $(lineArr).each(function(i,o){

            obj[titleArr[i]] = o;
        });

        //把对象放入到新的数组中
        newTableArr.push(obj);
    });

    return newTableArr;
};

//根据设备类型ID获取设备类型名称
function getEquipNameByID(equipId){

        //定义设别类型名称
        var equipName = '';

        if(equipId == 1){

            equipName = '冷热源';

        }else if(equipId == 2){

            equipName = '空调机组';

        }else if(equipId == 3){

            equipName = '送排风';

        }else if(equipId == 4){

            equipName = '给排水';

        }else if(equipId == 5){

            equipName = '电梯';

        }else if(equipId == 6){

            equipName = '照明';

        }else if(equipId == 7){

            equipName = '动环';

        }else if(equipId == 18){

            equipName = '直梯';

        }else if(equipId == 19){

            equipName = '扶梯';

        }else if(equipId == 20){

            equipName = '站台照明';

        }else if(equipId == 21){

            equipName = '站房照明';

        }

    return equipName;
};

