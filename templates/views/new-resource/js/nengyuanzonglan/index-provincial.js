/**
 * Created by admin on 2017/11/28.
 */
$(function(){

    //获取全部楼宇ID列表
    pointerIdArr = getPointersId();

//获取全部分户ID列表
    officeIdArr = getOfficesId();

    //获取页面左上角新闻轮播图
    getNewsCarousel();

    //获取实时数据中上方的能耗种类
    getEcTypeByDeploy();

    //获取左侧医院统计数据
    getTopPageData();

    //获取当年气象参数
    getWeatherParam();

    //获取实时能耗
    getRealTimeData();

    //获取本月能耗数据
    getTopPageEnergyData();

    //获取本日能耗分项数据
    getAllEnergyItemData();

    //获取本日电耗分项数据
    getFirstEnergyItemData();

    ////获取本日楼宇能耗排名
    //getPointerRankData();

    //获取本日KPI指标
    getTopPageKPIData();

    //获取所有报警数据
    alarmHistory();

    getRankingDataByConfig();

    //获取单位类型指标数据
    getUnitTypeData();

    //查看单位类型指标中超标值
    $('.table-unit-type').on('mouseover','.red',function(){

        $('.unit-type-message-container').show();

        //获取指标数据
        var normData = $(this).attr('data-norm');

        //获取实际数据
        var theValue = $(this).attr('data-value');

        $('.unit-type-message-container .norm-data').html(parseFloat(normData).toFixed(2));

        $('.unit-type-message-container .cur-value').html(parseFloat(theValue).toFixed(2));

        //获取当前元素左边距
        var theTop = $(this).offset().top - 50;

        var theLeft = $(this).offset().left;

        $('.unit-type-message-container').css({

            'position':'absolute',
            'left':theLeft + 'px',
            'top':theTop + 'px'

        });

    });

    $('.table-unit-type').on('mouseout','.red',function(){


        $('.unit-type-message-container').hide();

    });

//------------------------------------页面点击事件-----------------------------------//

    //点击实时能耗上方的按钮变换能耗种类
    $('.top-cut li a').on('click',function(){

        $(this).parents('ul').find('a').removeClass('onClicks');
        $(this).addClass('onClicks');

        //获取实时能耗
        getRealTimeData();
    });

    ////点击右下角切换楼宇或者科室的能耗排名数据
    //$('.header-right-btn').on('click','span',function(){
    //
    //       $('.header-right-btn span').removeClass('cur-on-choose');
    //
    //        //给当年点击的增加标识
    //        $(this).addClass('cur-on-choose');
    //
    //        //切换显示楼宇或者科室
    //        if($(this).attr('data-id') == 1){
    //            //楼宇能耗排名
    //
    //            getPointerRankData();
    //        }else if($(this).attr('data-id') == 2){
    //            //科室能耗排名
    //            getOfficeRankData();
    //
    //        }else if($(this).attr('data-id') == 0){
    //            //科室能耗排名
    //            getOfficeRankData();
    //        }
    //});

    //点击页面左下方切换显示日期
    $('.time-options').on('click',function(){

        //获取本月能耗数据
        getTopPageEnergyData();

        //获取本日能耗分项数据
        getAllEnergyItemData();

        //获取本日电耗分项数据
        getFirstEnergyItemData();

        //获取本日KPI指标
        getTopPageKPIData();

        //获取单位类型指标数据
        getUnitTypeData();


        var index = $('.cur-on-choose').attr('data-id');

        //切换显示楼宇或者科室
        if(index == 1){
            //楼宇
            getPointerRankData()

        }else if(index == 2){

            //科室能耗排名
            getOfficeRankData();

        }else if(index == 0){

            //项目
            getProjectRankData();
        }

    });

    //当窗口大小变化时，使图表大小跟着改变

    window.onresize = function () {

        if(myChart ){
            myChart.resize();
            _myChart3.resize();
            _myChart.resize();
            _myChart1.resize();
            _myChart2.resize();

        }
    };

});


////定义初始的楼宇ID
//if(!sessionStorage.PointerID || sessionStorage.PointerID == 'undefined'){
//
//
//    if(sessionStorage.pointers){
//
//        var pos = JSON.parse(sessionStorage.pointers);
//        var po = pos[0];
//        sessionStorage.PointerID = po.pointerID;
//        sessionStorage.PointerName = po.pointerName;
//
//        console.log(sessionStorage.PointerID)
//    }
//}

//------------------------------------定义变量-----------------------------------//

//实时能耗
var myChart = echarts.init(document.getElementById('energy-demand'));

//echart配置项
//为了使总能耗也有loading等待效果，覆盖一个echarts
_myChart3 = echarts.init(document.getElementById('loaddings'));

//分项能耗
_myChart = echarts.init(document.getElementById('main-right-two'));
//分项电耗
_myChart1 = echarts.init(document.getElementById('main-right-three'));

//楼宇 科室 能耗排名
_myChart2 = echarts.init(document.getElementById('bottom-right-two'));

//单位面积能耗
_myChart4 = echarts.init(document.getElementById('bottom-left-one'));
//单位床位能耗
_myChart5 = echarts.init(document.getElementById('bottom-left-two'));

// 指定图表的配置项和数据
option = {
    title : {
        text: ''
    },
    tooltip : {
        trigger: 'axis'
    },
    calculable : true,
    xAxis : [
        {
            show:'true',
            type : 'category',
            data : ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} '
            }
        }
    ],
    grid: {
        left: '8%',
        right: '8%',
        bottom:'10%',
        top:'5%'
    },
    series : [
        {
            name:'当前能耗',
            type:'bar',
            data:[11, 11, 15, 13, 12, 13, 10],
            //itemStyle:{
            //    normal:{
            //        color:'#4ad2ff'
            //    }
            //},
            //markPoint : {
            //    data : [
            //        {type : 'max', name: '最大值'},
            //        {type : 'min', name: '最小值'}
            //    ],
            //    itemStyle : {
            //        normal:{
            //            color:'#019cdf'
            //        }
            //    },
            //    label:{
            //        normal:{
            //            textStyle:{
            //                color:'#d02268'
            //            }
            //        }
            //    }
            //},
            markLine : {
                data : [

                    {type : 'average', name: '平均值'}

                ]
            },
            barMaxWidth: '60'
        }
    ]
};

// 指定图表的配置项和数据 用于本日用能分项
option1 = {
    title : {
        text: ''
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'30px',
        data:[]
    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['50%', '70%'],
            center:['68%', '60%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[]
        }
    ]
};

// 指定图表的配置项和数据 用于能耗排名
var option2 = {
    //title:{
    //  text:''
    //},
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: 18,
        bottom: 20,
        right:10,
        left:90
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },

    yAxis: {
        type: 'category',
        axisLabel: {
            interval:0,
            margin:80,
            textStyle: {
                align: 'left'
            }
        },
        data: ['灼伤大楼','转化医学研究院','儿童住院部','门诊和急诊','外科楼','内科楼']
    },
    series: [
        {
            name: '总能耗',
            type: 'bar',
            barMaxWidth:50,//最大宽度
            data: [18203, 23489, 29034, 104970, 131744, 630230]
        }
    ]
};

// 指定图表的配置项和数据 用于KPI指标
var option3 = {
    title: {
        text: '单位面积能耗',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle',
        subtext:'kgce/m2',
        subtextStyle:{
            color:'#333'
        },
        x:'center',
        bottom:'10'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前能耗',
            type: 'gauge',
            radius: '83%',
            min: 0,
            max:1,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#62A8DB'], [0.8, '#33E3B6'], [1, '#ffa90b']],
                    width: 10
                }
            },
            splitLine:{
                length:14
            },
            axisLabel: {
                show:true,
                padding: [0, 0, 0, -5],
                formatter: function (value) {
                    return value.toFixed(2);
                    //return value;
                }
            },
            splitNumber: 5,
            data: [{value:5}]
        }
    ]
};

// 指定图表的配置项和数据 用于KPI指标
var option4 = {
    title: {
        text: '人均能耗',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle',
        subtext:'kgce/人',
        subtextStyle:{
            color:'#333'
        },
        x:'center',
        bottom:'10'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前能耗',
            type: 'gauge',
            radius: '83%',
            min: 0,
            max:1,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#62A8DB'], [0.8, '#33E3B6'], [1, '#ffa90b']],
                    width: 10
                }
            },
            splitLine:{
                length:14
            },
            axisLabel: {
                show:true,
                padding: [0, 0, 0, -5],
                formatter: function (value) {
                    return value.toFixed(2);
                    //return value;
                }
            },
            splitNumber: 5,
            data: [{value:5}]
        }
    ]
};

//获取全部楼宇ID列表
var pointerIdArr = [];

//获取全部分户ID列表
var officeIdArr = [];

//------------------------------------页面主体方法-----------------------------------//

//从配置项中获取右下角能耗排名所展示信息
function getRankingDataByConfig(){

    //获取当前的url
    var curUrl = window.location.href;

    //获取当前页面的配置信息
    $(__systemConfigArr).each(function(i,o){

        //获取当前配置项中的url
        var thisUrl = o.pageUrl;

        //找到了当前页面对应的配置项
        if(curUrl.indexOf(thisUrl) > -1){

            //获取到具体的能耗排名配置信息
            var btnArr = o.indexPageRandingObj.btnMessage;

            var html = "";

            $(btnArr).each(function(i,o){

                if(o.isShow == 1){

                    //获取当前id
                    var id = o.btnId;

                    html += "<span data-id='"+id+"'>"+ o.btnName+"</span>";
                }
            });

            $('.header-right-btn').html(html);

            //点击右下角切换楼宇或者科室的能耗排名数据
            $('.header-right-btn').on('click','span',function(){

                $('.header-right-btn span').removeClass('cur-on-choose');

                //给当年点击的增加标识
                $(this).addClass('cur-on-choose');

                //切换显示楼宇或者科室
                if($(this).attr('data-id') == 1){
                    //项目
                    getPointerRankData();

                }else if($(this).attr('data-id') == 2){
                    //科室能耗排名
                    getOfficeRankData();

                }else if($(this).attr('data-id') == 0){
                    //科室能耗排名
                    getProjectRankData();
                }
            });

            //默认获取数据
            $('.header-right-btn').find('span').eq(0).click();

        }
    });

};

//获取页面左上角新闻轮播图
function getNewsCarousel(){

    //存放当前选中的企业id集合
    var enterpriseIdArr = getEnterprise();

    var postType = 'get';

    var postUrl = 'News/GetRecommendNews';

    //传递给后台的参数
    var prm = {

    };

    //如果是可选择企业的模式
    if(sessionStorage.showChooseUnit == 1){

        postType = 'post';

        postUrl = 'News/GetRecommendNewsByEnterpriseID';

        //传递给后台的参数
        prm = {
            "":  enterpriseIdArr

        };
    }

    //获取推荐轮播图块
    $.ajax({
        type:postType,
        url:sessionStorage.apiUrlPrefix + postUrl,
        data:prm,
        success:function(result){

            //console.log(result);

            //创建轮播图
            var heightArr = [];
            var showArr = result.splice(0,4);

            var html = '';
            var html1 = '';
            //console.log(showArr.length);
            for(var i=0;i<showArr.length;i++){
                if(i == 0){
                    html += '<a class="item active" style="height: 100%">' +
                        ' <div class="img"></div>' +
                        ' <div class="carousel-caption"></div>' +
                        '</a>';
                    html1 += '<li data-target="#myCarousel" data-slide-to="'+i+'" class="active"></li>'
                }else{
                    html += '<a class="item" style="height: 100%">' +
                        ' <div class="img"></div>' +
                        ' <div class="carousel-caption"></div>' +
                        '</a>';

                    html1 += '<li data-target="#myCarousel" data-slide-to="'+i+'" class=""></li>'
                }



            }

            $('.carousel-inner').html(html);

            $('.carousel-indicators').html(html1);


            for(var i=0;i<showArr.length;i++){

                if( showArr[i].f_RecommImgName){

                    var imgurl = showArr[i].f_RecommImgName.split('\\');
                    $('.carousel-inner').find('.item').eq(i).children('.img').css({'background':'url(' + imgurl[0] + '/' + imgurl[1] + '/' + imgurl[2] + ') no-repeat','background-position':'center','background-size':'100% 100%'});
                    $('.carousel-inner').find('.item').children('.carousel-caption').eq(i).html(showArr[i].f_NewsTitle);
                    $('.carousel-inner').find('.item').eq(i).attr('href','../news/news-4.html?id=' + showArr[i].pK_NewsID + '&come=1');
                }else{

                    $('.carousel-inner').find('.item').children('.carousel-caption').eq(i).html(showArr[i].f_NewsTitle);

                    $('.carousel-inner').find('.item').eq(i).attr('href','../news/news-4.html?id=' + showArr[i].pK_NewsID + '&come=1');
                }
            }

            $('#myCarousel').carousel({
                interval: 2000
            })


        },
        error:function(jqXHR, textStatus, errorThrown){

        }
    })
};

//获取左侧医院统计数据
function getTopPageData(){

    var pointerArr = JSON.parse(sessionStorage.pointers);


    var _enterpriseArr = unique(pointerArr,'enterpriseID');

    //传递给后台的企业id集合
    var postEnterArr = [];

    $(_enterpriseArr).each(function(i,o){

        postEnterArr.push(o.enterpriseID);
    });

    //console.log(postEnterArr);

    //传递给后台的数据
    var ecParams = {
        "" : postEnterArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetTopPageDataStatistExt',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result){

            //console.log(result);

            //console.log(result);
            //给页面中赋值
            var html = '';
            $(result).each(function(i,o){

                html += '<p>'+ o.statistName+':<span>'+ o.statistValue+'</span> '+ o.statistUnit+'</p>'
            });

            //清除浮动
            html += '<div class="clearfix"></div>';

            $('.left-middle-main1').html(html);

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

//获取当天气象参数
function getWeatherParam(){
    //传递给后台的数据
    var ecParams = {

    };
    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetWeatherParam',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result){

            //无数据
            if(result == null || result.length == 0){

                //隐藏温度 和湿度
                $('.top-system-message .temperature').html('');

                //湿度
                $('.top-system-message .humidity').html('');

                return false;
            }

            //给页面中赋值
            //温度
            $('.top-system-message .temperature').html(result.temperatureData + "℃");

            //湿度
            $('.top-system-message .humidity').html(result.humidityData + "%");

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

//------------------------------------右侧上方实时能耗数据-----------------------------------//

//根据配置获取对应能耗种类
function getEcTypeByDeploy(){

    //本地能耗对象
    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    //实时能耗旁边的能耗种类
    var html = '';

    var txt = unitObj.alltypes;
    for(var i=0; i < txt.length; i++){

        if(i == 0){

            html += '<li><a href="javascript:;" type="'+txt[i].ettype+'" class="onClicks">'+txt[i].etname+'</a></li>';

        }else{

            html += '<li><a href="javascript:;" type="'+txt[i].ettype+'">'+txt[i].etname+'</a></li>';
        }


    }
    html +='<div class="clearfix"></div>';

    //页面赋值
    $('.top-cut').html(html);
};

//获取后台实时能耗数据
function getRealTimeData(){

    //获取要展示的能耗类型
    var energyType = $('.real-time-energy .top-cut .onClicks').attr('type');

    //根据能耗类型获取分项ID
    var energyItemCode = getUnitID(energyType);

    //获取单位名称
    var unit = getUnitByType(energyType);

    $.ajax({
        type: 'post',
        url: sessionStorage.apiUrlPrefix  + "EnergyTopPageV2/GetTopPageRealEnergyData",
        timeout: _theTimes,
        data:{
            "energyItemID": energyItemCode,
            "pointerIDs": pointerIdArr
        },
        beforeSend: function () {
            myChart.showLoading();
        },

        complete: function () {
            myChart.hideLoading();
        },
        success: function (data) {
            myChart.hideLoading();

            //return false;

            //改变单位
            $('.real-time-energy h3 span b').html(unit);

            $('.real-time-energy h4 span').html('('+unit+')');

            //清除之前数据
            option.series[0].data = [];

            //重新加入数据

            //数据
            var sArr = [];
            $(data.hourMetaDatas).each(function(i,o){


                sArr.push(o.data.toFixed(2));
            });

            for(var i=0; i< 24; i++){
                if(sArr.length < 24){
                    sArr.push('null')
                }
            }

            option.series[0].data = sArr;


            //重绘chart图
            myChart.setOption(option);

            //右侧统计数据进行刷新

            //日数据
            //左侧总能耗
            $('.real-time-energy .right-total-data .single-data').eq(0).find('.right-ratio  .total').html(data.dayEnergyData.energyData.toFixed(1));

            //右侧同比
            $('.real-time-energy .right-total-data .single-data').eq(0).find('.right-ratio .percent-number').eq(0).html((Math.abs(data.dayEnergyData.lastYearEnergyPercent) * 100).toFixed(1) + '%');
            //console.log(data);
            if(data.dayEnergyData.lastYearEnergyPercent < 0){

                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).removeClass('fall-down')

            }

            if(data.dayEnergyData.lastYearEnergyPercent == 0){
                console.log(33);

                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).addClass('equal')

            }else{

                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).removeClass('equal')

            }

            //右侧环比
            $('.real-time-energy .right-total-data .single-data').eq(0).find('.right-ratio .percent-number').eq(1).html((Math.abs(data.dayEnergyData.chainEnergyPercent) * 100).toFixed(1) + '%');

            if(data.dayEnergyData.chainEnergyPercent < 0) {

                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(1).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(1).removeClass('fall-down')
            }

            if(data.dayEnergyData.chainEnergyPercent == 0) {

                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(1).addClass('equal')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(1).removeClass('equal')
            }

            //月数据
            //左侧总能耗
            $('.real-time-energy .right-total-data .single-data').eq(1).find('.right-ratio  .total').html(data.monthEnergyData.energyData.toFixed(1));

            //右侧同比
            $('.real-time-energy .right-total-data .single-data').eq(1).find('.right-ratio .percent-number').eq(0).html((Math.abs(data.monthEnergyData.lastYearEnergyPercent) * 100).toFixed(1) + '%');

            if(data.monthEnergyData.lastYearEnergyPercent < 0){

                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).addClass('equal')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).removeClass('equal')
            }

            if(data.monthEnergyData.lastYearEnergyPercent == 0){

                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).removeClass('fall-down')
            }

            //右侧环比
            $('.real-time-energy .right-total-data .single-data').eq(1).find('.right-ratio .percent-number').eq(1).html((Math.abs(data.monthEnergyData.chainEnergyPercent) * 100).toFixed(1) + '%');

            if(data.monthEnergyData.chainEnergyPercent < 0) {

                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(1).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(1).removeClass('fall-down')
            }

            if(data.monthEnergyData.chainEnergyPercent == 0) {

                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(1).addClass('equal')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(1).removeClass('equal')
            }

            //年数据
            //左侧总能耗
            $('.real-time-energy .right-total-data .single-data').eq(2).find('.right-ratio  .total').html(data.yearEnergyData.energyData.toFixed(1));

            //右侧环比
            $('.real-time-energy .right-total-data .single-data').eq(2).find('.right-ratio .percent-number').eq(0).html((Math.abs(data.yearEnergyData.chainEnergyPercent) * 100).toFixed(1) + '%');

            if(data.yearEnergyData.chainEnergyPercent < 0){

                $('.real-time-energy .right-total-data .single-data').eq(2).find('.top-percent').eq(0).addClass('fall-down1')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(2).find('.top-percent').eq(0).removeClass('fall-down1')
            }

            if(data.yearEnergyData.chainEnergyPercent == 0){

                $('.real-time-energy .right-total-data .single-data').eq(2).find('.top-percent').eq(0).addClass('equal1')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(2).find('.top-percent').eq(0).removeClass('equal1')
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            myChart.hideLoading();
            //console.log(textStatus);

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    });
};

//------------------------------------右侧左边总体能耗数据-----------------------------------//

//获取本日能耗数据
function getTopPageEnergyData(){

    //获取用户选择的日期类型
    var selectDateType = getShowDateType()[1];

    //获取开始结束时间
    var startDate = getPostTime1()[0];

    var endDate = getPostTime1()[1];

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "selectDateType": selectDateType,
        "pointerIDs":  pointerIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetTopPageEnergyData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _myChart3.showLoading();
        },
        success:function(result){

            //console.log(result);
            var dataArr = [];

            _myChart3.hideLoading();

            $(result).each(function(i,o){

                var obj = {};
                //名称
                obj.ecClassName = o.f_EnergyItemName;
                //单位
                obj.ecUnit = getUnitById(o.f_EnergyItemID);

                if(!getUnitById(o.f_EnergyItemID)){
                    obj.ecUnit = 'kgce'
                }
                //用量
                obj.ecData = o.currentEnergyData;
                //环比
                obj.dataDoD = (o.chainEnergyPercent * 100).toFixed(1) + '%';
                //同比
                obj.dataYoY = (o.lastYearEnergyPercent * 100).toFixed(1) + '%';

                //能耗类型
                obj.energyItemID = o.f_EnergyItemID;

                dataArr.push(obj);

            });

            //生成对应的本日能耗数据
            setEnergyType(sessionStorage.allEnergyType, dataArr);

            //改变上方的title显示信息
            $('.content-main-middle-left h3').html('本' + $('.time-options-1').html() +"能耗");

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart3.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//------------------------------------右侧中间用能分项-----------------------------------//

//获取本日能耗分项数据
function getAllEnergyItemData(){

    //获取开始结束时间
    var startDate = getPostTime1()[0];

    var endDate = getPostTime1()[1];

    //console.log(startDate);

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "energyFlag": 1,  //1为标煤  0为能耗
        "pointerIDs":  pointerIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetAllEnergyItemData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _myChart.showLoading();
        },
        success:function(result){

            //console.log(result);
            _myChart.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //存放能耗数据
            var dataArr = [];

            //存放图例中数据
            var legendArr = [];

            var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));

            var allEnergyArr = jsonText.alltypes;


            $(result).each(function(i,o){

                var obj = {};

                //获取当前的能耗类型
                var energyID = o.energyItemCode;

                //获取能耗数据
                obj.value = o.energyItemValue.toFixed(1);
                //获取能耗名称
                obj.name = o.energyItemName;

                $(allEnergyArr).each(function(i,o){

                    if(energyID == o.etid){

                        //判断是否是二次能源 不是二次能源的才能展示
                        if(!o.secondEnergy){

                            dataArr.push(obj);

                            //给图例中存储数据
                            legendArr.push(obj.name);

                        }
                    }

                });
            });

            //图例赋值
            option1.legend.data = legendArr;
            //数据赋值
            option1.series[0].data = dataArr;
            //重绘title
            option1.title.text = '能耗分项';

            //页面重绘数据
            _myChart.setOption(option1,true);

            //改变上方的title显示信息
            $('.content-main-middle-center h3').html('本' + $('.time-options-1').html() +"用能分项");

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart3.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//获取本日电耗分项数据
function getFirstEnergyItemData(){

    //获取开始结束时间
    var startDate = getPostTime1()[0];

    var endDate = getPostTime1()[1];

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "energyItemType": '01',
        "pointerIDs":  pointerIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetFirstEnergyItemData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _myChart1.showLoading();
        },
        success:function(result){

            //console.log(result);

            _myChart1.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //存放能耗数据
            var dataArr = [];

            //存放图例中数据
            var legendArr = [];

            $(result).each(function(i,o){

                var obj = {};
                //获取能耗数据
                obj.value = o.energyItemValue.toFixed(1);
                //获取能耗名称
                obj.name = o.energyItemName;

                dataArr.push(obj);

                //给图例中存储数据
                legendArr.push(o.energyItemName);
            });

            //图例赋值
            option1.legend.data = legendArr;

            //数据赋值
            option1.series[0].data = dataArr;

            //重绘title
            option1.title.text = '电耗分项';

            //页面重绘数据
            _myChart1.setOption(option1,true);

            //改变上方的title显示信息
            $('.content-main-middle-center h3').html('本' + $('.time-options-1').html() +"用能分项");

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart1.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    });
};

//------------------------------------左下角KPI指标-----------------------------------------//

//获取本日KPI指标
function getTopPageKPIData(){

    //获取开始结束时间
    var startDate = getPostTime1()[0];

    var endDate = getPostTime1()[1];

    var selectDateType = getShowDateType()[1];

    //console.log(selectDateType);

    if(selectDateType == 'Day'){

        startDate = moment().subtract('1','days').format('YYYY-MM-DD HH:mm:ss');

        endDate = moment().format('YYYY-MM-DD HH:mm:ss');


    }else if(selectDateType == 'Month'){

        startDate = moment().subtract('1','months').format('YYYY-MM-DD HH:mm:ss');

        endDate = moment().format('YYYY-MM-DD HH:mm:ss');

    }else if(selectDateType == 'Year'){

        startDate = moment().subtract('1','years').format('YYYY-MM-DD HH:mm:ss');

        endDate = moment().format('YYYY-MM-DD HH:mm:ss');

    }

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "selectDateType": selectDateType,
        "pointerIDs":  pointerIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetTopPageKPIData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _myChart4.showLoading();
            _myChart5.showLoading();
        },
        success:function(result){

            _myChart4.hideLoading();
            _myChart5.hideLoading();

            //console.log(result);

            //无数据
            if(result == null || result.length == 0){

                return false;
            }


            //单位面积能耗
            option3.series[0].data[0].value = result.areaKPIData.energyNormData.toFixed(2);

            if(result.areaKPIData.kpiConfigBad > 0){

                option3.series[0].max = result.areaKPIData.kpiConfigBad.toFixed(2);

                option3.series[0].axisLine.lineStyle.color = [
                    [result.areaKPIData.kpiConfigExcellent/result.areaKPIData.kpiConfigBad, '#62A8DB'], [result.areaKPIData.kpiConfigOrdinary/result.areaKPIData.kpiConfigBad, '#33E3B6'], [result.areaKPIData.kpiConfigWorse/result.areaKPIData.kpiConfigBad, '#ffa90b'],[1, '#f8276c']
                ];

            }


            option3.series[0].max = result.areaKPIData.energyNormData.toFixed(2)* 2;

            //页面重绘数据
            _myChart4.setOption(option3,true);

            if(result.peopleKPIData){
                //单位床位能耗
                option4.series[0].data[0].value = result.peopleKPIData.energyNormData.toFixed(2);

            }

            option4.series[0].max = result.peopleKPIData.energyNormData.toFixed(2)* 2;


            //是否显示单位床位
            if(result.modeFlag == 1){

                $('.content-main-bototm-left .energy1').removeClass('col-lg-12');

                $('.content-main-bototm-left .energy1').addClass('col-lg-6');

                $('.content-main-bototm-left .energy2').show();

                _myChart5.setOption(option4,true);

            }else{

                $('.content-main-bototm-left .energy1').removeClass('col-lg-6');

                $('.content-main-bototm-left .energy1').addClass('col-lg-12');

                $('.content-main-bototm-left .energy2').hide();
            }

            window.onresize();

            if(selectDateType == 'Day'){

                //改变上方的title显示信息
                $('.content-main-bototm-left h3').html('近24小时' +"KPI指标");


            }else if(selectDateType == 'Month'){

                //改变上方的title显示信息
                $('.content-main-bototm-left h3').html('近30天' +"KPI指标");

            }else if(selectDateType == 'Year'){

                //改变上方的title显示信息
                $('.content-main-bototm-left h3').html('近12月' +"KPI指标");

            }

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart4.hideLoading();
            _myChart5.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};

//------------------------------------右下角能耗排名-----------------------------------------//

//获取本日楼宇能耗排名
function getPointerRankData(){

    //获取用户选择的日期类型
    var selectDateType = getShowDateType()[1];

    //获取开始结束时间
    var startDate = getPostTime1()[0];

    var endDate = getPostTime1()[1];

    //获取配置好的能耗类型数据
    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));
    var txt = unitObj.alltypes;

    //获取能耗分项ID集合
    var energyItemIDArr = [];

    for(var i=0; i < txt.length; i++){

        energyItemIDArr.push(txt[i].etid);
    }

    //传递给后台的数据
    var ecParams = {
        "energyNorm": {
            "energyItemID": energyItemIDArr,
            "energyNormFlag": 0
        },
        "selectDateType": selectDateType,
        "startTime": startDate,
        "endTime": endDate,
        "pointerIDs": pointerIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyManageV2/GetPointerRankData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _myChart2.showLoading();
        },
        success:function(result){

            //console.log(result);
            _myChart2.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //存放图例中数据
            var legendArr = [];

            //重新给echarts图中添加数据
            //存放Y轴数据
            var yArr = [];

            //存放能耗数据
            var sArr = [];

            $(result).each(function(i,o){
                //取前五名展示
                if(i < 5){
                    //重绘Y轴
                    yArr.push(o.returnOBJName);
                    //添加数据
                    sArr.push(o.currentEnergyData.toFixed(1));
                }

            });

            //反序插入echart
            sArr.reverse();

            yArr.reverse();

            ////图例赋值
            //option2.legend.data = legendArr;
            //数据赋值
            option2.series[0].data = sArr;
            ////重绘title
            //option2.title.text = '楼';
            //重绘Y轴
            option2.yAxis.data = yArr;

            //页面重绘数据
            _myChart2.setOption(option2,true);

            //改变上方的title显示信息
            $('.content-main-bottom-center h3').html('本' + $('.time-options-1').html() +"能耗排名");

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart2.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//获取本日科室能耗排名
function getOfficeRankData(){

    //获取用户选择的日期类型
    var selectDateType = getShowDateType()[1];

    //获取开始结束时间
    var startDate = getPostTime1()[0];

    var endDate = getPostTime1()[1];

    //获取配置好的能耗类型数据
    var unitObj = $.parseJSON(sessionStorage.getItem('officeEnergyType'));
    var txt = unitObj.alltypes;
    //获取能耗分项ID集合
    var energyItemIDArr = [];

    for(var i=0; i < txt.length; i++){

        energyItemIDArr.push(txt[i].etid);
    }

    //传递给后台的数据
    var ecParams = {
        "energyNorm": {
            "energyItemID":energyItemIDArr,
            "energyNormFlag": 0
        },
        "selectDateType": selectDateType,
        "startTime": startDate,
        "endTime": endDate,
        "officeIDs": officeIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyManageV2/GetOfficeRankData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _myChart2.showLoading();
        },
        success:function(result){

            //console.log(result);

            _myChart2.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //存放图例中数据
            var legendArr = [];

            //重新给echarts图中添加数据
            //存放Y轴数据
            var yArr = [];

            //存放能耗数据
            var sArr = [];

            $(result).each(function(i,o){
                //取前五名展示
                if(i < 5){
                    //重绘Y轴
                    yArr.push(o.returnOBJName);
                    //添加数据
                    sArr.push(o.currentEnergyData.toFixed(1));
                }

            });

            //反序插入echart
            sArr.reverse();

            yArr.reverse();

            ////图例赋值
            //option2.legend.data = legendArr;
            //数据赋值
            option2.series[0].data = sArr;
            ////重绘title
            //option2.title.text = '楼';
            //重绘Y轴
            option2.yAxis.data = yArr;

            //页面重绘数据
            _myChart2.setOption(option2,true);

            //改变上方的title显示信息
            $('.content-main-bottom-center h3').html('本' + $('.time-options-1').html() +"能耗排名");

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart2.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//获取本日项目能耗排名
function getProjectRankData(){

    //获取用户选择的日期类型
    var selectDateType = getShowDateType()[1];

    //获取开始结束时间
    var startDate = getPostTime1()[0];

    var endDate = getPostTime1()[1];

    //获取配置好的能耗类型数据
    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));
    var txt = unitObj.alltypes;

    //获取能耗分项ID集合
    var energyItemIDArr = [];

    for(var i=0; i < txt.length; i++){

        energyItemIDArr.push(txt[i].etid);
    }

    //传递给后台的数据
    var ecParams = {
        "energyNorm": {
            "energyItemID": energyItemIDArr,
            "energyNormFlag": 0
        },
        "selectDateType": selectDateType,
        "startTime": startDate,
        "endTime": endDate,
        "pointerIDs": pointerIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyManageV2/GetEnterpriseRankData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _myChart2.showLoading();
        },
        success:function(result){

            //console.log(result);
            _myChart2.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //存放图例中数据
            var legendArr = [];

            //重新给echarts图中添加数据
            //存放Y轴数据
            var yArr = [];

            //存放能耗数据
            var sArr = [];

            $(result).each(function(i,o){

                //取前五名展示
                if(i < 5){

                    var nameArr = o.returnOBJName.split('');

                    //console.log(nameArr);

                    var rowN = nameArr.length;

                    var showName = "";


                    if( rowN > 6){

                        $(nameArr).each(function(k,j){

                            if(k != 0 && k % 6 == 0){

                                showName += '\n'+j;

                            }else{

                                showName += j;
                            }

                        });

                    }else{

                        showName = o.returnOBJName

                    }

                    //重绘Y轴
                    yArr.push(showName);

                    //添加数据
                    sArr.push(o.currentEnergyData.toFixed(1));
                }

            });

            //反序插入echart
            sArr.reverse();

            yArr.reverse();

            ////图例赋值
            //option2.legend.data = legendArr;
            //数据赋值
            option2.series[0].data = sArr;
            ////重绘title
            //option2.title.text = '楼';
            //重绘Y轴
            option2.yAxis.data = yArr;

            //页面重绘数据
            _myChart2.setOption(option2,true);

            //改变上方的title显示信息
            $('.content-main-bottom-center h3').html('本' + $('.time-options-1').html() +"能耗排名");

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart2.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//------------------------------------右上角报警数据-----------------------------------------//

//实时数据（开始）；
var startRealTime = moment().subtract('24','hours').format('YYYY-MM-DD HH:mm:ss');
var endRealTime = moment().format('YYYY-MM-DD HH:mm:ss');
//获取所有楼宇
var pointerID = [];
getPointerID();

function getPointerID(){
    var getPointers = JSON.parse(sessionStorage.getItem('pointers'));
    if(getPointers){
        for(var i=0;i<getPointers.length;i++){
            pointerID.push(getPointers[i].pointerID)
        }
    }
};

//获取所有报警数据
function alarmHistory(){
    var prm = {
        'st' : startRealTime,
        'et' : endRealTime,
        'pointerIds' : pointerID,
        "dealFlag": -1, //0为未处理 -1为全部
        'excTypeInnderId' : '',
        'energyType' : ''
    };
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAlarmStatisticsNum',
        data:prm,
        beforeSend: function () {
            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
        },
        success:function(result){

            //console.log(result);

            //新增报警条数
            var countAlarm = result.alarmNewNum;
            //页面赋值
            $('.new-alarm1').eq(0).find('span').html(countAlarm);

            //已处理条数
            var isDispose = result.alarmDealNum;
            //未处理条数
            var noDispose = result.alarmNoDealNum;

            //页面赋值
            //未处理
            $('.new-alarm1').eq(1).find('span').html(noDispose);
            //已处理
            $('.new-alarm1').eq(2).find('span').html(isDispose);
        }
    });
};

//------------------------------------其他方法-----------------------------------------//

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

//获取能耗分项ID
function getUnitID(num){
    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    var txt = unitObj.alltypes;

    for(var i=0; i < txt.length; i++){
        if(num == txt[i].ettype){
            return txt[i].etid;
        }
    }
};

//根据能耗类型获取能耗单位
function getUnitByType(num){


    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    var txt = unitObj.alltypes;
    for(var i=0; i < txt.length; i++){
        if(num == txt[i].ettype){
            return txt[i].etunit;
        }
    }
};

//根据能耗类型ID获取能耗单位
function getUnitById(id){


    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    var txt = unitObj.alltypes;
    for(var i=0; i < txt.length; i++){
        if(id == txt[i].etid){
            return txt[i].etunit;
        }
    }
};

//根据配置文件设置左上角的电水气暖
//ets:sessionStorage中存储的配置文件中的能耗分类
//ecs：从数据接口中获取的能耗数据
function setEnergyType(ets,ecs){
    var types;
    if(ets){
        types = JSON.parse(ets);       //获取缓存的配置的显示能耗分类
    }else{
        return;
    }
    var div = $(".energy-typess");
    div.empty();
    for(var i=0;i<ecs.length;i++){
        var ei = _.findWhere(types.alltypes,{"etid" : ecs[i].energyItemID});        //找到和结果对应的能耗分类
        var curDiv = setEnergyBlock(ei,ecs[i]);         //对每个分类已经对应的结果生成一个显示div
        div.append(curDiv);
    }
};

//设置每个能耗的块信息,div
//et:能耗分类,ec:能耗数据
function setEnergyBlock(et,ec){
    if(!et){  //没有能耗定义信息，表示是总能耗
        et = {};
        et.etname = ec.ecClassName;
        et.img = "totalEneragery.png";
        et.color = "#fee8af";
        et.etunit = "kgce";
    }else{
        et.etname = "总用" + et.etname + "量";
    }
    var $div = $("<div class='main-one-1'></div>");     //总div
    $div.css("background","url(../resource/img/"+ et.img + ")no-repeat " + et.color);      //背景图设置
    $div.css("background-size","50px");
    $div.css("background-position","center");
    var $spanTitle = $("<span class='main-one-title'></span>");       //标题
    $spanTitle.html(et.etname);
    $div.append($spanTitle);
    var $spanEC = $("<span class='main-one-total'></span>");        //能耗和单位
    $spanEC.html(parseInt(ec.ecData) + "&nbsp;&nbsp;" + ec.ecUnit);
    $div.append($spanEC);
    var $divComp = $("<div class='main-mark'></div>");          //同比和环比
    var $pT = $("<p class='tongbi1'><span>同比:</span><br></p>");
    var $spanT = $("<span class='huanbizhi'></span>");
    $spanT.html(ec.dataYoY);

    if(ec.dataYoY.length > 1){

        if(ec.dataYoY == '0.0%'){
            $pT.css("background","url(../new-resource/img/tongbi0%25.png)no-repeat 46px 11px");
            $pT.css("background-size","18px");
        }else if(ec.dataYoY.startWith("-")){
            $pT.css("background","url(../resource/img/declineArrow.png)no-repeat 40px 17px");
            $pT.css("background-size","16px");
        }else {
            $pT.css("background","url(../resource/img/riseArrow.png)no-repeat 40px 17px");
            $pT.css("background-size","16px");
        }
    }

    $pT.append($spanT);
    $divComp.append($pT);
    var $pH = $("<p class='huanbi'><span>环比:</span><br></p>");
    var $spanH = $("<span class='huanbizhi'></span>");
    $spanH.html(ec.dataDoD);
    if(ec.dataDoD.length > 1){
        //console.log(ec.dataDoD)
        if(ec.dataDoD == '0.0%'){
            $pH.css("background","url(../new-resource/img/tongbi0%25.png)no-repeat 46px 11px");
            $pH.css("background-size","18px");
        }else if(ec.dataDoD.startWith("-")) {
            $pH.css("background","url(../resource/img/declineArrow.png)no-repeat 40px 17px");
            $pH.css("background-size","16px");
        }else{
            $pH.css("background","url(../resource/img/riseArrow.png)no-repeat 40px 17px");
            $pH.css("background-size","16px");
        }
    }
    $pH.append($spanH);
    $divComp.append($pH);
    $div.append($divComp);
    return $div;
};

/**
 * 定位当前城市
 */
var cityName;

function locationInit(){
    $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(_result) {
        if (remote_ip_info.ret == '1') {
            cityName = remote_ip_info.city;
            cityWeatherInit();
            //      console.log(cityName)

        }
    });
};

/**
 * 根据城市获得天气
 */
function cityWeatherInit(){
    //跨域是浏览器的安全策略.
    //jQuery 解决的方式.
    var todayimg = '';
    var tomorrowimg = '';
    $.ajax({
        url:"http://api.map.baidu.com/telematics/v3/weather",
        type:"get",
        data:{
            location:cityName,
            output:'json',
            ak:'6tYzTvGZSOpYB5Oc2YGGOKt8'
        },
        /*预期服务器端返回的数据类型，假设现在跨域了，就改成jsonp 就可以了 */
        dataType:"jsonp",
        success:function(data){
            var weatherData=data.results[0].weather_data[0];

            //温度
            $('.left-middle-main0 p span').eq(0).html(weatherData.temperature);

            //湿度
            $('.left-middle-main0 p span').eq(1).html(weatherData.wind);

            $('.left-middle-main0 p').eq(1).find('i').attr('title','风力');

        }
    })
};

//获取当天气象参数
function getWeatherParam1(){

    var pointerIDArr = [sessionStorage.PointerID];
    console.log(pointerIDArr);

    //传递给后台的数据
    var ecParams = {
        "" : pointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetWeatherByPointer',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result){

            console.log(result);
            //无数据
            if(result == null || result.length == 0){

                ////温度
                //$('.left-middle-main0 p span').eq(0).html('32' + '℃');
                //
                ////湿度
                //$('.left-middle-main0 p span').eq(1).html('41' + "%");

                return false;
            }

            //给页面中赋值

            //温度
            $('.left-middle-main0 p span').eq(0).html(result.temperatureData + '℃');

            //湿度
            $('.left-middle-main0 p span').eq(1).html(result.humidityData + "%");


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

//获取单位类型指标数据
function getUnitTypeData(){

    //获取用户选择的日期类型
    var selectDateType = getShowDateType()[1];

    //获取开始结束时间
    var startDate = getPostTime1()[0];

    var endDate = getPostTime1()[1];

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "selectDateType": selectDateType,
        "userID": _userIdNum
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'Provincial/GetPointerClassKPINormData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            $('.table-unit-type').showLoading();
        },
        success:function(result){

            $('.table-unit-type').hideLoading();

            var tableHtml = '';

            if(result.code == 99){

                $(result.data).each(function(i,o){

                    //建筑面积能耗是否超标
                    var isCoefficientKPIOut = '未超标';

                    var addClass1 = '';

                    if(o.isCoefficientKPIOut == 1){

                        isCoefficientKPIOut = '超标';

                        addClass1 = 'red';
                    }

                    //人员能耗KPI是否超标
                    var isPeopleKPIOut = '未超标';

                    var addClass2 = '';

                    if(o.isPeopleKPIOut == 1){

                        isPeopleKPIOut = '超标';

                        addClass2 = 'red';
                    }


                    tableHtml += '<tr>' +
                                    '<td>'+ o.returnOBJName+'</td>'+
                                    '<td class="'+addClass1+'" data-norm="'+ o.coefficientKPINorm+'" data-value="'+ o.coefficientKPIData+'">'+ isCoefficientKPIOut+'</td>'+
                                    '<td class="'+addClass2+'" data-norm="'+ o.peopleKPINorm+'" data-value="'+ o.peopleKPIData+'">'+ isPeopleKPIOut+'</td>'+
                                 '</tr>'

                });

            };

            $('.table-unit-type tbody').html(tableHtml);


        },
        error:function(jqXHR, textStatus, errorThrown){
            $('.table-unit-type').hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//获取企业id列表
function getEnterprise(){

    //从session中获取全部企业信息
    var strPointers = sessionStorage.pointers;
    var tempAllPointers = [];

    if(strPointers){
        tempAllPointers = JSON.parse(strPointers);
    }

    var html = "";

    //获取企业列表
    var _enterpriseArr = unique(tempAllPointers,'enterpriseID');

    $(_enterpriseArr).each(function(i,o){

        html += '<option value="'+ o.enterpriseID+'">'+ o.eprName+'</option>'

    });

    //页面赋值
    $('#unit-select').html(html);

    //如果不是可选择企业的模式
    if(sessionStorage.showChooseUnit == 0){

        //隐藏选择框
        $('.choose-unit').hide();

    }

    //存放企业id集合
    var _enterpriseIdArr = [];

    $(_enterpriseArr).each(function(i,o){

        _enterpriseIdArr.push(o.enterpriseID);
    });

    return _enterpriseIdArr;

};

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

