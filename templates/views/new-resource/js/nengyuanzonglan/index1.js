
/**
 * Created by admin on 2017/11/28.
 */
$(function(){

    //获取页面左上角新闻轮播图
    getNewsCarousel();

    //获取实时数据中上方的能耗种类
    getEcTypeByDeploy();

    //获取左侧医院统计数据
    getTopPageData();

    //获取当年气象参数
    getWeatherParam();

    //获取左侧能耗数据
    getLeftEnergyData();

    //获取当前时间
    getNowTime();

    //获取实时能耗
    getRealTimeData();

    //获取工单统计信息
    getOrderData();

    //获取本月能耗分类数据
    getTopPageEnergyData();
    //
    //获取本日能耗分项数据
    getAllEnergyItemData();

    //获取本日电耗分项数据
    getFirstEnergyItemData();

    //获取本日楼宇能耗排名
    getPointerRankData();

    //获取本日KPI指标
    getTopPageKPIData();

    //单位床位KPI指标
    getTopPageKPIData1();

    //获取所有报警数据
    alarmHistory();

//------------------------------------页面点击事件-----------------------------------//

    //点击实时能耗上方的按钮变换能耗种类
    $('.top-cut li a').on('click',function(){

        $(this).parents('ul').find('a').removeClass('onClicks');
        $(this).addClass('onClicks');
        $('.top-cut li').css({background:'#C0CAD6'})
        $(this).parent('li').css({background:'#ffffff'});
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
    $('.top-cut1 a').on('click',function(){

        $('.top-cut1 a').removeClass('onClicks');

        $('.top-cut1 li').css({background:'#C0CAD6'});

        $(this).addClass('onClicks');

        $(this).parent('li').css({background:'#ffffff'});

        //获取本月能耗数据
        getTopPageEnergyData();

        //获取本日能耗分项数据
        getAllEnergyItemData();

        //获取本日电耗分项数据
        getFirstEnergyItemData();

        //获取本日KPI指标
        getTopPageKPIData();

        //获取工单统计信息
        getOrderData();

        //单位床位KPI指标
        getTopPageKPIData1();

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
            _myChart.resize();
            _myChart1.resize();
            _myChart2.resize();
            _myChart6.resize();
            _myChart4.resize();
            _myChart5.resize();

        }
    };

});
//------------------------------------定义变量-----------------------------------//

//实时能耗
var myChart = echarts.init(document.getElementById('energy-demand'));

//echart配置项
//为了使总能耗也有loading等待效果，覆盖一个echarts

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

//工单统计
_myChart6 = echarts.init(document.getElementById('order-demand'));


// 指定图表的配置项和数据
option = {
    title : {
        text: ''
    },
    tooltip : {
        trigger: 'axis'
    },
    //calculable : true,
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
            },
            //显示网格线
            splitLine:{show: true}
        }
    ],
    grid: {
        left: '5%',
        right: '5%',
        bottom:'15%',
        top:'5%',
        borderColor:'white'
        //show:true
    },
    series : [
        {
            name:'当前能耗',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            symbol: "circle",//拐点样式
            symbolSize: 10,//拐点大小
            itemStyle:{
                normal:{
                    color:'#ffffff',
                    borderColor: "#F2285C",
                    lineStyle:{
                        width:4,
                        color:'#F2285C'
                    }

                }
            },
            smooth:true
        },
        { // For shadow
            type: 'bar',
            itemStyle: {
                normal: {color: 'rgba(0,0,0,0.01)'}
            },
            barGap:'-100%',
            barCategoryGap:'40%',
            data: [],
            animation: false
        }
    ]
};


var colors1=['#62A8DB','#33E3B6','#F08348','#fad797','#59ccf7','#c3b4df'];

// 指定图表的配置项和数据 用于本日用能分项
option1 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:[]
    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['50%', '70%'],
            center:['60%', '60%'],
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
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#62A8DB','#33E3B6','#F08348','#fad797'
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
            itemStyle:{
                normal:{
                    color:'#62A8DB'
                }
            },
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            barWidth:25
        }
    ]
};

// 指定图表的配置项和数据 用于KPI指标
var option3 = {
    title: {
        text: '单位建筑面积能耗',
        textStyle:{
            fontSize:'15',
            fontWeight:'normal'
        },
        textBaseline:'middle',
        subtext:'Kgce/m2',
        subtextStyle:{
            color:'#333'
        },
        x:'center',
        bottom:'8'
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
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#62A8DB'], [0.8, '#33E3B6'], [1, '#F08348']],
                    width: 24
                }
            },
            data: [{value:5}]
        }
    ]
};

// 指定图表的配置项和数据 用于KPI指标
var option4 = {
    title: {
        text: '单位床位能耗',
        textStyle:{
            fontSize:'15',
            fontWeight:'normal'
        },
        textBaseline:'middle',
        subtext:'Kgce/床',
        subtextStyle:{
            color:'#333'
        },
        x:'center',
        bottom:'8'
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
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#62A8DB'], [0.8, '#33E3B6'], [1, '#F08348']],
                    width: 24
                }
            },
            data: [{value:5}]
        }
    ]
};


//获取全部楼宇ID列表
var pointerIdArr = getPointersId();

//获取全部分户ID列表
var officeIdArr = getOfficesId();

//------------------------------------页面主体方法-----------------------------------//

//获取页面左上角新闻轮播图
function getNewsCarousel(){

    //获取推荐轮播图块
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix + 'News/GetRecommendNews',
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
                        ' <img class="img"></img>' +
                        ' <div class="carousel-caption"></div>' +
                        '</a>';
                    html1 += '<li data-target="#myCarousel" data-slide-to="'+i+'" class="active"></li>'
                }else{
                    html += '<a class="item" style="height: 100%">' +
                        ' <img class="img"></img>' +
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
                    $('.carousel-inner').find('.item').eq(i).children('.img');

                    $('.carousel-inner').find('.item').eq(i).children('.img').attr('src','' + imgurl[0] + '/' + imgurl[1] + '/' + imgurl[2] + '');


                    $('.carousel-inner').find('.item').children('.carousel-caption').eq(i).html(showArr[i].f_NewsTitle);
                    $('.carousel-inner').find('.item').eq(i).attr('href','../news/news-4.html?id=' + showArr[i].pK_NewsID + '&come=1');
                }else{

                    $('.carousel-inner').find('.item').children('.carousel-caption').eq(i).html(showArr[i].f_NewsTitle);

                    $('.carousel-inner').find('.item').eq(i).attr('href','../news/news-4.html?id=' + showArr[i].pK_NewsID + '&come=1');
                }
            }

            $('#myCarousel').carousel({
                interval: 3000
            })


        },
        error:function(jqXHR, textStatus, errorThrown){

        }
    })
};

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

            //总面积
            $('.inside-data').eq(0).find('.data').html(result[0].statistValue);

            //科室数
            $('.inside-data').eq(1).find('.data').html(result[1].statistValue);

            //床位数
            $('.inside-data').eq(2).find('.data').html(result[2].statistValue);

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

//获取左侧能耗统计数据
function getLeftEnergyData(){

    //传递给后台的数据
    var ecParams = {
        "pointerIDs": pointerIdArr
    };
    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetTopPageEnergySTATData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){


        },
        success:function(result){

            //console.log(result);

            //如果为空直接返回
            if(result == null || result.length == 0){
                return false;
            }

            //给页面中赋值

            //日数据
            //电
            $('.left-energy-statistics .left-data').eq(0).find('.the-data').html(result.energySTATItemDay[0].currentEnergyData.toFixed(1) + '<span>kWh</span>');
            //水
            $('.left-energy-statistics .right-data').eq(0).find('.the-data').html(result.energySTATItemDay[1].currentEnergyData.toFixed(1) + '<span>t</span>');

            //月数据
            //电
            $('.left-energy-statistics .left-data').eq(1).find('.the-data').html(result.energySTATItemMonth[0].currentEnergyData.toFixed(1) + '<span>kWh</span>');
            //水
            $('.left-energy-statistics .right-data').eq(1).find('.the-data').html(result.energySTATItemMonth[1].currentEnergyData.toFixed(1) + '<span>t</span>');

            //年数据
            //电
            $('.left-energy-statistics .left-data').eq(2).find('.the-data').html(result.energySTATItemYear[0].currentEnergyData.toFixed(1) + '<span>kWh</span>');
            //水
            $('.left-energy-statistics .right-data').eq(2).find('.the-data').html(result.energySTATItemYear[1].currentEnergyData.toFixed(1) + '<span>t</span>');


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
            //无数据
            if(result == null || result.length == 0){
                //隐藏温度 和湿度
                $('.top-system-message .temperature').html(88 + "℃");

                //湿度
                $('.top-system-message .humidity').html(66 + "%");

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

//获取实时时间
function getNowTime(){


    var time1 = moment().format('HH:mm');

    var time2 = moment().format('YYYY') + '年' + moment().format('MM') + '月' + moment().format('DD') + '日';

    $('.top-system-message .times').html(time1);

    $('.top-system-message .date').html(time2);

     setTimeout(function(){

         getNowTime();

     },15000)
};

//获取工单统计信息
function getOrderData(){

    //传递给后台的数据
    var ecParams = {
        "userID": _userIdNum,
        "userName":  _userIdName
    };
    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'ywGD/ywGDRptgdtongjiAll',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            _myChart6.showLoading();
        },
        success:function(result){

            //console.log(result);

            _myChart6.hideLoading();

            //判断是日月年
            var date = $('.top-cut1 .onClicks').html();
            //订单量
            var orderNum = 0;
            //完成量
            var finishNum = 0;
            //进行中
            var disposeNum = 0;

            if(date == '日'){

                orderNum = result.todayorder;

                finishNum = result.todayorderfinish;

                disposeNum = parseInt(orderNum) - parseInt(finishNum)

            }else if(date == '月'){

                orderNum = result.monthorder;

                finishNum = result.monthorderfinish;

                disposeNum = parseInt(orderNum) - parseInt(finishNum)

            }else if(date == '年'){

                orderNum = result.yearorder;

                finishNum = result.yearorderfinish;

                disposeNum = parseInt(orderNum) - parseInt(finishNum)

            }

            //页面赋值
            $('.real-time-order .top-data-child').eq(0).find('.data').html(orderNum);

            $('.real-time-order .top-data-child').eq(1).find('.data').html(finishNum);

            $('.real-time-order .top-data-child').eq(2).find('.data').html(disposeNum);

            var arr = [orderNum, finishNum, disposeNum];

            var legendArr = [];

            var dataArr = [];

            $(arr).each(function(i,o){

                var obj = {};
                //获取能耗数据
                obj.value = o;
                //获取能耗名称
                if(i==0){
                    obj.name = '订单量';
                }else if(i == 1){
                    obj.name = '完成量';
                }else if(i == 2){
                    obj.name = '进行中';
                }


                dataArr.push(obj);

                //给图例中存储数据
                legendArr.push(obj.name);
            });
            //图例赋值
            option1.legend.data = legendArr;
            //数据赋值
            option1.series[0].data = dataArr;

            //页面重绘数据
            _myChart6.setOption(option1,true);


        },
        error:function(jqXHR, textStatus, errorThrown){

            _myChart6.hideLoading();
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

            //console.log(data);

            //如果为空直接返回
            if(data == null || data.length == 0){
                return false;
            }

            //改变单位
            $('.real-time-energy h3 span b').html(unit);

            $('.real-time-energy h4 span').html('('+unit+')');

            //清除之前数据
            option.series[0].data = [];

            //重新加入数据
            var xArr = [];
            //数据
            var sArr = [];
            //所有数据
            var dataArr = [];
            $(data.hourMetaDatas).each(function(i,o){

                sArr.push(o.data.toFixed(2));

                dataArr.push(o.data.toFixed(2));

                xArr.push(i);
            });

            for(var i=0; i< 24; i++){
                if(sArr.length < 24){
                    sArr.push('null')
                }
            }

            option.series[0].data = sArr;
            option.xAxis[0].data = xArr;


            var yMax = dataArr.sort(function(a,b){

                return b-a;

            })[0];

            var shadowArr = [];

            for(var i=0;i<dataArr.length;i++){

                shadowArr.push(maxNum(yMax))

            }

            option.series[1].data = shadowArr;

            //重绘chart图
            myChart.setOption(option);

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
    var selectDateType = getShowDateType1()[1];

    //获取开始结束时间
    var startDate = getPostTime11()[0];

    var endDate = getPostTime11()[1];

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

        },
        success:function(result){

            //console.log(result);

            $('.fenleinenghao').children().removeClass('equal');
            $('.fenleinenghao').children().removeClass('down');

            //总能耗
            $('.fenleinenghao').eq(0).find('.data').html(result[0].currentEnergyData.toFixed(1));

            //同比
            $('.fenleinenghao').eq(0).find('.child1 span').html(Math.abs(result[0].lastYearEnergyPercent*100).toFixed(1) + '%');

            //环比
            $('.fenleinenghao').eq(0).find('.child2 span').html(Math.abs(result[0].chainEnergyPercent*100).toFixed(1) + '%');

            //判断箭头方向
            if(result[0].lastYearEnergyPercent< 0){

                $('.fenleinenghao').eq(0).find('.child1').addClass('down');

            }else if(result[0].lastYearEnergyPercent  == 0){

                $('.fenleinenghao').eq(0).find('.child1').addClass('equal');

            }

            if(result[0].chainEnergyPercent < 0){

                $('.fenleinenghao').eq(0).find('.child2').addClass('down');

            }else if(result[0].chainEnergyPercent == 0){

                $('.fenleinenghao').eq(0).find('.child2').addClass('equal');

            }

            //电耗
            $('.fenleinenghao').eq(1).find('.data').html(result[1].currentEnergyData.toFixed(1));

            //同比
            $('.fenleinenghao').eq(1).find('.child1 span').html(Math.abs(result[1].lastYearEnergyPercent*100).toFixed(1) + '%');

            //环比
            $('.fenleinenghao').eq(1).find('.child2 span').html(Math.abs(result[1].chainEnergyPercent*100).toFixed(1) + '%');

            //判断箭头方向
            if(result[1].lastYearEnergyPercent < 0){

                $('.fenleinenghao').eq(1).find('.child1').addClass('down');

            }else if(result[1].lastYearEnergyPercent == 0){

                $('.fenleinenghao').eq(1).find('.child1').addClass('equal');

            }

            if(result[1].chainEnergyPercent < 0){

                $('.fenleinenghao').eq(1).find('.child2').addClass('down');

            }else if(result[1].chainEnergyPercent == 0){

                $('.fenleinenghao').eq(1).find('.child2').addClass('equal');

            }

            //总水耗
            $('.fenleinenghao').eq(2).find('.data').html(result[2].currentEnergyData.toFixed(1));

            //同比
            $('.fenleinenghao').eq(2).find('.child1 span').html(Math.abs(result[2].lastYearEnergyPercent*100).toFixed(1) + '%');

            //环比
            $('.fenleinenghao').eq(2).find('.child2 span').html(Math.abs(result[2].chainEnergyPercent*100).toFixed(1) + '%');

            //判断箭头方向
            if(result[2].lastYearEnergyPercent < 0){

                $('.fenleinenghao').eq(2).find('.child1').addClass('down');

            }else if(result[2].lastYearEnergyPercent == 0){

                $('.fenleinenghao').eq(2).find('.child1').addClass('equal');

            }

            if(result[2].chainEnergyPercent < 0){

                $('.fenleinenghao').eq(2).find('.child2').addClass('down');

            }else if(result[2].chainEnergyPercent == 0){

                $('.fenleinenghao').eq(2).find('.child2').addClass('equal');

            }


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

//------------------------------------右侧中间用能分项-----------------------------------//

//获取本日能耗分项数据
function getAllEnergyItemData(){

    //获取开始结束时间
    var startDate = getPostTime11()[0];

    var endDate = getPostTime11()[1];

    //console.log(startDate);

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "energyFlag":'',
        "pointerIDs":  pointerIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetAllEnergyMoneyData',
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
                obj.name = _getEcName(o.energyItemCode);

                dataArr.push(obj);

                //给图例中存储数据
                legendArr.push(obj.name);
            });
            //图例赋值
            option1.legend.data = legendArr;
            //数据赋值
            option1.series[0].data = dataArr;


            //页面重绘数据
            _myChart.setOption(option1,true);


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

//获取本日电耗分项数据
function getFirstEnergyItemData(){

    //获取开始结束时间
    var startDate = getPostTime11()[0];

    var endDate = getPostTime11()[1];

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


            //页面重绘数据
            _myChart1.setOption(option1,true);


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

//获取本日单位面积KPI指标
function getTopPageKPIData(){

    //获取开始结束时间
    var startDate = getPostTime11()[0];

    var endDate = getPostTime11()[1];

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


        },
        success:function(result){

            _myChart4.hideLoading();

            //console.log(result);

            //无数据
            if(result == null || result.length == 0){

                return false;
            }
            //单位面积能耗
            option3.series[0].data[0].value = result.areaKPIData.energyNormData.toFixed(2);


            //页面重绘数据
            _myChart4.setOption(option3,true);

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

//获取本日单位床位KPI指标
function getTopPageKPIData1(){

    //获取开始结束时间
    var startDate = getPostTime11()[0];

    var endDate = getPostTime11()[1];

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "officeIDs":  officeIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetTopPageKPIOfficeData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _myChart5.showLoading();
        },
        success:function(result){

            _myChart5.hideLoading();

            //console.log(result);

            //无数据
            if(result == null || result.length == 0){

                return false;
            }


            if(result.bedKPIData){
                //单位床位能耗
                option4.series[0].data[0].value = result.bedKPIData.energyNormData.toFixed(2);

            }


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
    var selectDateType = getShowDateType1()[1];

    //获取开始结束时间
    var startDate = getPostTime11()[0];

    var endDate = getPostTime11()[1];

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
    var selectDateType = getShowDateType1()[1];

    //获取开始结束时间
    var startDate = getPostTime11()[0];

    var endDate = getPostTime11()[1];

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
        'excTypeInnderId' : '',
        'energyType' : ''
    };
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcData',
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
            var countAlarm = result.length;

            //页面赋值
            $('.new-alarm').eq(0).find('.alarmNum').html(countAlarm);

            //已处理条数
            var isDispose = 0;
            //未处理条数
            var noDispose = 0;

            $(result).each(function(i,o){

                //已处理
                if(o.flag == 1){

                    isDispose ++;

                }else if(o.flag == 0){

                    noDispose ++;
                }
            });

            //页面赋值
            //未处理
            $('.new-alarm').eq(1).find('.alarmNum').html(noDispose);
            //已处理
            $('.new-alarm').eq(2).find('.alarmNum').html(isDispose);
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

//数字取整
function maxNum(num){

    //首先判断是几位数
    num = Math.ceil(num/5);

    //位数
    var length = num.toString().length;

    //获取最高位
    var heightNum = Number(num.toString().slice(0,1)) + 1;

    return Math.pow(10,length-1)*heightNum *5;
}