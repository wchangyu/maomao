/**
 * Created by admin on 2017/11/28.
 */
$(function(){

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

    //获取本日楼宇能耗排名
    getPointerRankData();

    //获取本日KPI指标
    getTopPageKPIData();

//------------------------------------页面点击事件-----------------------------------//

    //点击实时能耗上方的按钮变换能耗种类
    $('.top-cut li a').on('click',function(){

        $(this).parents('ul').find('a').removeClass('onClicks');
        $(this).addClass('onClicks');

        //获取实时能耗
        getRealTimeData();
    });

    //点击右下角切换楼宇或者科室的能耗排名数据
    $('.header-right-btn span').on('click',function(){

           $('.header-right-btn span').removeClass('cur-on-choose');
            //给当年点击的增加标识
            $(this).addClass('cur-on-choose');

            //切换显示楼宇或者科室
            if($(this).index() == 0){
                //楼宇能耗排名

                getPointerRankData();
            }else{
                //科室能耗排名
                getOfficeRankData();
            }
    });

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

        var index = $('.cur-on-choose').index();

        //切换显示楼宇或者科室
        if(index == 0){
            //楼宇能耗排名

            getPointerRankData();
        }else{
            //科室能耗排名
            getOfficeRankData();
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
            type : 'category',
            boundaryGap : false,
            axisLabel :{
                interval:0
            },
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
    grid:{
       top:'5%'
    },
    series : [
        {
            name:'当前能耗',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            //itemStyle : {
            //    normal : {
            //        color:'#53f4db',
            //        lineStyle:{
            //            color:'#53f4db',
            //            width:3
            //        }
            //    }
            //},
            smooth:true
            //markLine : {
            //    data : [
            //        {type : 'average', name: '平均值'}
            //
            //    ]
            //}
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
        data: ['灼伤大楼','转化医学研究院','儿童住院部','门诊和急诊','外科楼','内科楼']
    },
    series: [
        {
            name: '总能耗',
            type: 'bar',
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
        subtext:'Kgce/m2',
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
            splitNumber: 5,
            data: [{value:5}]
        }
    ]
};

// 指定图表的配置项和数据 用于KPI指标
var option4 = {
    title: {
        text: '单位床位能耗',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle',
        subtext:'Kgce/床',
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
            splitNumber: 5,
            data: [{value:5}]
        }
    ]
};


//获取全部楼宇ID列表
var pointerIdArr = getPointersId();

//获取全部分户ID列表
var officeIdArr = getOfficesId();


//------------------------------------页面主体方法-----------------------------------//

//获取左侧医院统计数据
function getTopPageData(){
    //传递给后台的数据
    var ecParams = {

    };
    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetTopPageDataStatist',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){


        },
        success:function(result){

            //console.log(result);
            //给页面中赋值
            var html = '';
            $(result).each(function(i,o){

                html += '<p>'+ o.statistName+':<span>'+ o.statistValue+'</span></p>'
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

//获取当年气象参数
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

            //console.log(result);
            //给页面中赋值
            //温度
            $('.left-middle-main0 p span').eq(0).html(result.temperatureData + "℃");
            //湿度
            $('.left-middle-main0 p span').eq(1).html(result.humidityData + '%');
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


                sArr.push(o.data);
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
            $('.real-time-energy .right-total-data .single-data').eq(0).find('.left-data p').html(data.dayEnergyData.energyData.toFixed(1));

            //右侧同比
            $('.real-time-energy .right-total-data .single-data').eq(0).find('.right-ratio p').eq(0).html((Math.abs(data.dayEnergyData.lastYearEnergyPercent) * 100).toFixed(1) + '%');

            if(data.dayEnergyData.lastYearEnergyPercent < 0){

                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).removeClass('fall-down')
            }

            //右侧环比
            $('.real-time-energy .right-total-data .single-data').eq(0).find('.right-ratio p').eq(2).html((Math.abs(data.dayEnergyData.chainEnergyPercent) * 100).toFixed(1) + '%');

            if(data.dayEnergyData.chainEnergyPercent < 0) {

                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(1).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).removeClass('fall-down')
            }

            //月数据
            //左侧总能耗
            $('.real-time-energy .right-total-data .single-data').eq(1).find('.left-data p').html(data.monthEnergyData.energyData.toFixed(1));

            //右侧同比
            $('.real-time-energy .right-total-data .single-data').eq(1).find('.right-ratio p').eq(0).html((Math.abs(data.monthEnergyData.lastYearEnergyPercent) * 100).toFixed(1) + '%');

            if(data.monthEnergyData.lastYearEnergyPercent < 0){

                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).removeClass('fall-down')
            }

            //右侧环比
            $('.real-time-energy .right-total-data .single-data').eq(1).find('.right-ratio p').eq(2).html((Math.abs(data.monthEnergyData.chainEnergyPercent) * 100).toFixed(1) + '%');

            if(data.monthEnergyData.chainEnergyPercent < 0) {

                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(1).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).removeClass('fall-down')
            }

            //年数据
            //左侧总能耗
            $('.real-time-energy .right-total-data .single-data').eq(2).find('.left-data p').html(data.yearEnergyData.energyData.toFixed(1));

            //右侧环比
            $('.real-time-energy .right-total-data .single-data').eq(2).find('.right-ratio p').eq(0).html((Math.abs(data.yearEnergyData.chainEnergyPercent) * 100).toFixed(1) + '%');

            if(data.yearEnergyData.chainEnergyPercent < 0){

                $('.real-time-energy .right-total-data .single-data').eq(2).find('.top-percent').eq(0).addClass('fall-down1')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(2).find('.top-percent').eq(0).removeClass('fall-down1')
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
    var startDate = getPostTime()[0];

    var endDate = getPostTime()[1];

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
                obj.dataDoD = (o.chainEnergyPercent).toFixed(1) + '%';
                //同比
                obj.dataYoY = (o.lastYearEnergyPercent).toFixed(1) + '%';
                //能耗类型
                obj.energyItemID = o.f_EnergyItemID;

                dataArr.push(obj);

            });

            //生成对应的本日能耗数据
            setEnergyType(sessionStorage.allEnergyType, dataArr);

            //改变上方的title显示信息
            $('.content-main-middle-left h3').html('本' + $('.time-options-1').html() +"信息");

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
    var startDate = getPostTime()[0];

    var endDate = getPostTime()[1];

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
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

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            _myChart.hideLoading();

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
    var startDate = getPostTime()[0];

    var endDate = getPostTime()[1];

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

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            _myChart1.hideLoading();

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
    })

};

//------------------------------------左下角KPI指标-----------------------------------------//

//获取本日KPI指标
function getTopPageKPIData(){

    //获取开始结束时间
    var startDate = getPostTime()[0];

    var endDate = getPostTime()[1];

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
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

            //无数据
            if(result == null || result.length == 0){

                return false;
            }
            //单位面积能耗
            option3.series[0].data[0].value = result.areaKPIData.energyNormData.toFixed(2);

            //单位床位能耗
            option4.series[0].data[0].value = result.bedKPIData.energyNormData.toFixed(2);

            //页面重绘数据
            _myChart4.setOption(option3,true);

            _myChart5.setOption(option4,true);

            //改变上方的title显示信息
            $('.content-main-bototm-left h3').html('本' + $('.time-options-1').html() +"KPI指标");

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
    var startDate = getPostTime()[0];

    var endDate = getPostTime()[1];

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

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            _myChart2.hideLoading();


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
    var startDate = getPostTime()[0];

    var endDate = getPostTime()[1];

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

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            _myChart2.hideLoading();


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
        if(ec.dataYoY.startWith("-")){
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
        if(ec.dataDoD.startWith("-")) {
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