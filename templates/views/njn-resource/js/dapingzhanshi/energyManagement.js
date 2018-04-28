/**
 * Created by admin on 2018/1/15.
 */
$(function(){

    //获取实时数据中上方的能耗种类
    getEcTypeByDeploy();

    //获取实时能耗
    getRealTimeData();

    //获取车站总能耗排名
    getPointerRankData();

    //获取所有车站能耗标煤排名（按分项）
    getStationRankData();

    //获取本月能耗分类数据
    getTopPageEnergyData();

    //获取能耗费用数据
    getAllEnergyItemMoney();

    //获取车站单位面积能耗排名
    getStationAreaRankData();

    //单位面积KPI指标
    getTopPageKPIData();

    //获取能耗分项
    getAllEnergyItemData();

    //获取电耗分项
    getFirstEnergyItemData();

    //获取车站单位客流量排名
    getStataionFootfallRank();

    //------------------------------------页面点击事件-----------------------------------//

    //点击实时能耗上方的按钮变换能耗种类
    $('.top-cut li a').on('click',function(){

        $(this).parents('ul').find('a').removeClass('onClicks');
        $(this).addClass('onClicks');

        //获取实时能耗
        getRealTimeData();

    });

    //点击能耗分类中的年月日时
    $('.left-tab-container .right-tab').on('click',function(){

         startDate = getPostTimeByDom('.left-tab-container .right-tab-choose')[0];

         endDate =  getPostTimeByDom('.left-tab-container .right-tab-choose')[1];

         selectDateType = getShowDateTypeByDom('.left-tab-container .right-tab-choose')[1];

        //获取实时数据中上方的能耗种类
        getEcTypeByDeploy();

        //获取车站总能耗排名
        getPointerRankData();

        //获取所有车站能耗标煤排名（按分项）
        getStationRankData();

        //获取本月能耗分类数据
        getTopPageEnergyData();

        //获取能耗费用数据
        getAllEnergyItemMoney();

        //获取车站单位面积能耗排名
        getStationAreaRankData();

        //单位面积KPI指标
        getTopPageKPIData();

        //获取能耗分项
        getAllEnergyItemData();

        //获取电耗分项
        getFirstEnergyItemData();

        //获取车站单位客流量排名
        getStataionFootfallRank();

    });

});

//获取用户选择的日期类型
var selectDateType = getShowDateTypeByDom('.left-tab-container .right-tab-choose')[1];

//获取开始结束时间
var startDate = getPostTimeByDom('.left-tab-container .right-tab-choose')[0];

var endDate =  getPostTimeByDom('.left-tab-container .right-tab-choose')[1];


//------------------------------------定义变量-----------------------------------//

//实时能耗
var myChart = echarts.init(document.getElementById('energy-demand'));

// 实时能耗 指定图表的配置项和数据
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
        left: '1%',
        right: '1%',
        bottom:'5%',
        top:'5%',
        containLabel: true,
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
                    color:'#62A8DB',
                    borderColor: "white",
                    lineStyle:{
                        width:3,
                        color:'#62A8DB'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#74a4f5'
                    }, {
                        offset: 1,
                        color: '#ffe'
                    }])
                }
            }
        }
    ]
};

//楼宇 科室 能耗排名
_myChart2 = echarts.init(document.getElementById('bottom-right-two'));

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
        top: 6,
        bottom: 5,
        right:2,
        left:2,
        containLabel: true
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
                    color:'#0088ec'
                }
            },
            data: [18203, 23489, 29034, 104970, 131744, 630230],

        }
    ]
};

//右侧车站总能耗排名能耗排名
_myChart3 = echarts.init(document.getElementById('top-right-one'));

// 指定图表的配置项和数据 用于车站总能耗排名
var option3 = {
    //title:{
    //  text:''
    //},
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        show:false
    },
    grid: {
        top: 10,
        bottom: 5,
        right:2,
        left:10,
        containLabel: true
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    xAxis: {
        type: 'category',
        data: ['灼伤大楼','转化医学研究院','儿童住院部','门诊和急诊','外科楼','内科楼']
    },
    series: [
        {
            name: '总能耗',
            type: 'bar',
            itemStyle:{
                normal:{
                    color:function(params){
                        var colorList = [
                            '#0088ec','#999'
                        ];

                        if(params.value == 2000){
                            return '#999'
                        }else{
                            return '#0088ec'
                        }
                        //return colorList[params.dataIndex]

                    },
                    label : {
                        show : true,
                        formatter:function(params){

                            if(params.value == 2000){
                                return '暂无数据'
                            }
                        }
                    },
                    labelLine : {
                        show : false
                    }
                },
                emphasis : {
                    label : {
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '20',
                            fontWeight : 'bold'
                        }
                    }
                }

            },
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            barWidth:25
        }
    ]
};

var option31 = {
    //title:{
    //  text:''
    //},
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        show:false
    },
    grid: {
        top: 10,
        bottom: 5,
        right:2,
        left:10,
        containLabel: true
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    xAxis: {
        type: 'category',
        data: ['灼伤大楼','转化医学研究院','儿童住院部','门诊和急诊','外科楼','内科楼']
    },
    series: [
        {
            name: '总能耗',
            type: 'bar',
            itemStyle:{
                normal:{
                    color:function(params){
                        var colorList = [
                            '#0088ec','#999'
                        ];

                        if(params.value == 20){
                            return '#999'
                        }else{
                            return '#0088ec'
                        }
                        //return colorList[params.dataIndex]

                    },
                    label : {
                        show : true,
                        formatter:function(params){

                            if(params.value == 20){
                                return '暂无数据'
                            }
                        }
                    },
                    labelLine : {
                        show : false
                    }
                },
                emphasis : {
                    label : {
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '20',
                            fontWeight : 'bold'
                        }
                    }
                }

            },
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            barWidth:25
        }
    ]
};

//右侧车站能耗费用
var _myChart4 = echarts.init(document.getElementById('middle-center-one'));

var option4 = {
    title: {

    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var tar = params[1];
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        }
    },
    grid: {
        left: '12%',
        right: '4%',
        bottom: '13%',
        top:'5%',
        containLabel: false
    },
    xAxis: {
        type : 'category',
        splitLine: {show:false},
        data : ['总费用','房租','水电费','交通费','伙食费','日用品数']
    },
    yAxis: {
        type : 'value'
    },
    series: [
        {
            name: '总费用',
            type: 'bar',
            stack:  '总量',
            itemStyle: {
                normal: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            barMaxWidth:50,
            data: [0, 1700, 1400, 1200, 300, 0]
        },
        {
            name: '分项费用',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            barMaxWidth:50,
            itemStyle: {
                normal: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color:function(params){
                        var colorList = [
                            '#2170f4','#2be4b4','#e1c922','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data:[2900, 1200, 300, 200, 900, 300]
        }
    ]
};

//右侧车站总能耗排名能耗排名
var _myChart5 = echarts.init(document.getElementById('middle-right-one'));

//单位面积能耗
var _myChart6 = echarts.init(document.getElementById('bottom-left-one'));

//单位面积电耗
var _myChart7 = echarts.init(document.getElementById('bottom-left-two'));

//单位面积水耗
var _myChart71 = echarts.init(document.getElementById('bottom-left-three'));

//单位面积气耗
var _myChart72 = echarts.init(document.getElementById('bottom-left-four'));

// 指定图表的配置项和数据 用于KPI指标
var option6 = {
    title: {
        text: '单位面积总标煤',
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
                    color: [[0.2, '#62A8DB'], [0.8, '#33E3B6'], [1, '#ffa90b']],
                    width: 14
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
            data: [{value:5}]
        }
    ]
};


// 指定图表的配置项和数据 用于KPI指标
var option7 = {
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

//能耗分项与电耗分项
var _myChart8 = echarts.init(document.getElementById('main-right-two'));

var _myChart9 = echarts.init(document.getElementById('main-right-three'));


// 指定图表的配置项和数据 用于本日用能分项
var option8 = {
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
                            '#2ec8ab','#2f4554','#61a0a8','#fad797', '#f8276c', '#0BA3C3','#ffa90b', '#0353F7', '#3C27D5','#6512D7', '#283DDA', '#901AD3','#f8276c'
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

//车站单位客流能耗排名
var _myChart0 = echarts.init(document.getElementById('bottom-right-one'));

// 指定图表的配置项和数据 用于车站总能耗排名
var option0 = {
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
        top: 10,
        bottom: 5,
        right:2,
        left:10,
        containLabel: true
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    xAxis: {
        type: 'category',
        data: ['灼伤大楼','转化医学研究院','儿童住院部','门诊和急诊','外科楼','内科楼']
    },
    series: [
        {
            name: '客流量',
            type: 'bar',
            itemStyle:{
                normal:{
                    color:'#0088ec'
                }
            },
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            barWidth:25
        }
    ]
};

//获取全部楼宇ID列表
var pointerIdArr = getPointersId();

//获取全部分户ID列表
var officeIdArr = getOfficesId();


//获取配置好的能耗类型数据
var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));
if(unitObj){
    var allEnergyArr = unitObj.alltypes;
}

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
            if(data == null  || data.length == 0){
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
            $(data.hourMetaDatas).each(function(i,o){


                sArr.push(o.data.toFixed(2));

                xArr.push(i);
            });

            for(var i=0; i< 24; i++){
                if(sArr.length < 24){
                    sArr.push('null')
                }
            }

            option.series[0].data = sArr;
            option.xAxis[0].data = xArr;

            //重绘chart图
            myChart.setOption(option,true);

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

//------------------------------------右侧上方中间能耗排名-----------------------------------//
//获取车站总能耗排名
function getPointerRankData(){

    //获取配置好的能耗类型数据
    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));
    var txt = unitObj.alltypes;

    //获取能耗分项ID集合
    var energyItemIDArr = '';

    for(var i=0; i < txt.length; i++){

        if(i == txt.length - 1){
            energyItemIDArr += txt[i].etid + '';
        }else{
            energyItemIDArr += txt[i].etid + ',';
        }
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

            _myChart3.showLoading();
        },
        success:function(result){

            //console.log(result);

            _myChart3.hideLoading();

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

            var sArr1 = [];

            $(result).each(function(i,o){
                //取前五名展示
                if(i < 5){
                    //重绘Y轴
                    yArr.push(o.returnOBJName);
                    //添加数据
                    var obj = {};

                    sArr.push(o.currentEnergyData.toFixed(1));

                    if(o.currentEnergyData == 0){

                        //定义值
                        sArr1.push(2000);

                    }else{

                        sArr1.push(o.currentEnergyData.toFixed(1));

                    }
                }

            });


            //重绘Y轴
            option3.series[0].data = sArr1;

            option3.xAxis.data = yArr;

            _myChart3.setOption(option3,true);
        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart2.hideLoading();
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

//获取所有车站能耗标煤排名
function getStationRankData(){

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "pointerIDs": pointerIdArr
        //"energyItemType": "01",
        //"energyRankFlag": -2
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyAnalyzeV2/GetCustomBiaoMeiRankData',
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

                    //重绘Y轴
                    yArr.push(o.energyItemName.substring(0,4));
                    //添加数据

                    sArr.push(o.currentBiaoMeiData.toFixed(1));

            });

            //反序插入echart
            sArr.reverse();

            yArr.reverse();

            //数据赋值
            option2.series[0].data = sArr;

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

//------------------------------------右侧左边能耗分类数据-----------------------------------//

//获取能耗分类数据
function getTopPageEnergyData(){


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

            //总蒸汽耗
            $('.fenleinenghao').eq(3).find('.data').html(result[3].currentEnergyData.toFixed(1));

            //同比
            $('.fenleinenghao').eq(3).find('.child1 span').html(Math.abs(result[3].lastYearEnergyPercent*100).toFixed(1) + '%');

            //环比
            $('.fenleinenghao').eq(3).find('.child2 span').html(Math.abs(result[3].chainEnergyPercent*100).toFixed(1) + '%');

            //判断箭头方向
            if(result[3].lastYearEnergyPercent < 0){

                $('.fenleinenghao').eq(3).find('.child1').addClass('down');

            }else if(result[3].lastYearEnergyPercent == 0){

                $('.fenleinenghao').eq(3).find('.child1').addClass('equal');

            }

            if(result[3].chainEnergyPercent < 0){

                $('.fenleinenghao').eq(3).find('.child2').addClass('down');

            }else if(result[3].chainEnergyPercent == 0){

                $('.fenleinenghao').eq(3).find('.child2').addClass('equal');

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

//------------------------------------右侧中间能耗费用-----------------------------------//

//获取本日能耗费用数据
function getAllEnergyItemMoney(){


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

            _myChart4.showLoading();
        },
        success:function(result){

            //console.log(result);
            _myChart4.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //存放能耗数据
            var dataArr = [];

            var dataArr1 = [];

            //存放X轴数据
            var xArr = ['总费用'];

            //存放总费用
            var totalMoney = 0;

            $(result).each(function(i,k){

                //获取当前的能耗类型
                var energyID = k.energyItemCode;

                $(allEnergyArr).each(function(i,o){

                    if(energyID == o.etid){

                        //判断是否是二次能源 不是二次能源的才能展示
                        if(!o.secondEnergy){

                            dataArr.push(k.energyItemValue.toFixed(1));


                            totalMoney += parseFloat(k.energyItemValue.toFixed(1));

                            //x轴
                            xArr.push(_getEcName(k.energyItemCode));

                        }
                    }

                });


            });


            //添加总量
            dataArr.unshift(totalMoney.toFixed(1));

            //已计算的金额
            var showMoney = 0;

            dataArr1.push(0);

            $(dataArr).each(function(i,o){

                if(i > 0){

                    dataArr1.push(totalMoney - o - showMoney);

                    showMoney += o;
                }

            });


            //数据赋值
            option4.series[0].data = dataArr1;

            option4.series[1].data = dataArr;

            option4.xAxis.data = xArr;

            //页面重绘数据
            _myChart4.setOption(option4,true);


        },
        error:function(jqXHR, textStatus, errorThrown){

            _myChart4.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//------------------------------------右侧上方中间能耗排名-----------------------------------//
//获取车站单位面积能耗排名
function getStationAreaRankData(){

    //获取配置好的能耗类型数据
    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));
    var txt = unitObj.alltypes;

    //获取能耗分项ID集合
    var energyItemIDArr = '';

    for(var i=0; i < txt.length; i++){

        if(i == txt.length - 1){
            energyItemIDArr += txt[i].etid + '';
        }else{
            energyItemIDArr += txt[i].etid + ',';
        }
    }

    //传递给后台的数据
    var ecParams = {
        "energyNorm": {
            "energyItemID": energyItemIDArr,
            "energyNormFlag": 2
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

             _myChart5.showLoading();
        },
        success:function(result){

            //console.log(result);
             _myChart5.hideLoading();


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
                    if(o.currentEnergyData == 0){
                        sArr.push(2000)
                    }else{
                        sArr.push(o.currentEnergyData.toFixed(1));
                    }

                }

            });

            option3.series[0].data = sArr;

            option3.xAxis.data = yArr;

            //页面重绘数据
             _myChart5.setOption( option3,true);

        },
        error:function(jqXHR, textStatus, errorThrown){
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

//------------------------------------左下角KPI指标-----------------------------------------//

//获取本日单位面积KPI指标
function getTopPageKPIData(){


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

            _myChart6.showLoading();
            _myChart7.showLoading();
            _myChart71.showLoading();
            _myChart72.showLoading();

        },
        success:function(result){

            _myChart6.hideLoading();
            _myChart7.hideLoading();
            _myChart71.hideLoading();
            _myChart72.hideLoading();

            //console.log(result);

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //单位面积能耗
            option6.series[0].data[0].value = result.areaKPIData.energyNormData.toFixed(2);

            option6.title.text = '单位面积总标煤';

            option6.title.subtext = 'Kgce/㎡';


            option6.series[0].max = result.areaKPIData.kpiConfigBad;

            option6.series[0].axisLine.lineStyle.color = [
                [result.areaKPIData.kpiConfigExcellent/result.areaKPIData.kpiConfigBad, '#62A8DB'], [result.areaKPIData.kpiConfigOrdinary/result.areaKPIData.kpiConfigBad, '#33E3B6'], [result.areaKPIData.kpiConfigWorse/result.areaKPIData.kpiConfigBad, '#ffa90b'],[1, '#f8276c']
            ];

            //页面重绘数据
            _myChart6.setOption(option6,true);

            //单位面积电耗 水耗 气耗
            $(result.energyTypeCoeffs).each(function(i,o){

                if(o.energyItemID == '01'){

                    //单位面积能耗
                    option6.series[0].data[0].value = o.energyNormData.toFixed(2);

                    option6.series[0].max = o.kpiConfigBad.toFixed(1);

                    option6.series[0].axisLine.lineStyle.color = [
                        [o.kpiConfigExcellent/o.kpiConfigBad, '#62A8DB'], [o.kpiConfigOrdinary/o.kpiConfigBad, '#33E3B6'], [o.kpiConfigWorse/o.kpiConfigBad, '#ffa90b'],[1, '#f8276c']

                    ];

                    option6.title.text = '单位面积电耗';

                    option6.title.subtext = 'kWh/㎡';

                    //页面重绘数据
                    _myChart7.setOption(option6,true);

                }else if(o.energyItemID == '211'){

                    //单位面积能耗
                    option6.series[0].data[0].value = (o.energyNormData*1000).toFixed(2);

                    option6.title.text = '单位面积水耗';

                    option6.title.subtext = 'kg/㎡';

                    option6.series[0].max = o.kpiConfigBad*1000;

                    option6.series[0].axisLine.lineStyle.color = [
                        [o.kpiConfigExcellent/o.kpiConfigBad, '#62A8DB'], [o.kpiConfigOrdinary/o.kpiConfigBad, '#33E3B6'], [o.kpiConfigWorse/o.kpiConfigBad, '#ffa90b'],[1, '#f8276c']

                    ];

                    //页面重绘数据
                    _myChart71.setOption(option6,true);

                }else if(o.energyItemID == '2011'){

                    //单位面积能耗
                    option6.series[0].data[0].value = (o.energyNormData*1000).toFixed(2);

                    option6.title.text = '单位面积汽耗';

                    option6.series[0].max = o.kpiConfigBad*1000;

                    option6.series[0].axisLine.lineStyle.color = [
                        [o.kpiConfigExcellent/o.kpiConfigBad.toFixed(4), '#62A8DB'], [o.kpiConfigOrdinary/o.kpiConfigBad.toFixed(4), '#33E3B6'], [o.kpiConfigWorse/o.kpiConfigBad.toFixed(4), '#ffa90b'],[1, '#f8276c']

                    ];

                    option6.title.subtext = 'kg/㎡';

                    //页面重绘数据
                    _myChart72.setOption(option6,true);

                }
            });

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart6.hideLoading();
            _myChart7.hideLoading();
            _myChart71.hideLoading();
            _myChart72.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};

//------------------------------------右侧下方中间用能分项-----------------------------------//

//获取能耗分项数据
function getAllEnergyItemData(){

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "selectDateType": "日",
        "pointerIDs":  pointerIdArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetAllEnergyItemData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _myChart8.showLoading();
        },
        success:function(result){

            //console.log(result);
            _myChart8.hideLoading();

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

                //获取当前的能耗类型
                var energyID = o.energyItemCode;

                var obj = {};
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
            option8.legend.data = legendArr;
            //数据赋值
            option8.series[0].data = dataArr;

            //页面重绘数据
            _myChart8.setOption(option8,true);

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart9.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

};

//获取电耗分项数据
function getFirstEnergyItemData(){

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

            _myChart9.showLoading();
        },
        success:function(result){

            //console.log(result);

            _myChart9.hideLoading();

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
            option8.legend.data = legendArr;

            //数据赋值
            option8.series[0].data = dataArr;

            //页面重绘数据
            _myChart9.setOption(option8,true);


        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart9.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    });
};

//------------------------------------右下角车站单位客流排名-----------------------------------//
function getStataionFootfallRank(){

    //获取配置好的能耗类型数据
    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));
    var txt = unitObj.alltypes;

    //获取能耗分项ID集合
    var energyItemIDArr = '';

    for(var i=0; i < txt.length; i++){

        if(i == txt.length - 1){
            energyItemIDArr += txt[i].etid + '';
        }else{
            energyItemIDArr += txt[i].etid + ',';
        }
    }

    //传递给后台的数据
    var ecParams = {
        "energyNorm": {
            "energyItemID": energyItemIDArr,
            "energyNormFlag": 10
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

            _myChart0.showLoading();
        },
        success:function(result){

            //console.log(result);
            _myChart0.hideLoading();

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

                    if(o.currentEnergyData == 0){
                        sArr.push(20)
                    }else{
                        sArr.push(o.currentEnergyData.toFixed(1));
                    }
                }

            });

            //反序插入echart
            //sArr.reverse();
            //
            //yArr.reverse();

            option31.series[0].data = sArr;

            option31.xAxis.data = yArr;

            //页面重绘数据
            _myChart0.setOption(option31,true);

        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart0.hideLoading();

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