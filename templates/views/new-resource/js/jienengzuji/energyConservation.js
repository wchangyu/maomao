/**
 * Created by admin on 2017/11/27.
 */
$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));


    //默认时间
    $('.min').val(moment().format('YYYY'));

    //默认加载数据
    getPointerData();

    /*---------------------------------buttonEvent------------------------------*/

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };

    var zoomSize = 6;
    myChartTopLeft.on('click', function (params) {
        console.log(allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        myChartTopLeft.dispatchAction({
            type: 'dataZoom',
            startValue: allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue: allDataX[Math.min(params.dataIndex + zoomSize / 2, allDataY.length - 1)]
        });
    });

});
//定义开始结束时间
var startDate = '';

var endDate = '';
//定义单位
var unit = '';

//定义获取到的改造项目数据
var projManage = {};
/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];

//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//柱状图配置项
// 指定图表的配置项和数据
option = {

    tooltip : {
        trigger: 'axis'
    },
    legend: {
        show:true,
        data:['定额量','使用量','偏差']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} °C'
            }
        },
        {   type: 'value',
            show: true,
            axisLabel : {
                formatter: '{value} %'
            }
        }
    ],
    series : [
        {
            name:'定额量',
            type:'bar',
            data:[],
            //itemStyle : {
            //    normal : {
            //        color:'#52d0ef',
            //        lineStyle:{
            //            color:'#53f4db',
            //            width:3
            //        }
            //    }
            //},

        },
        {
            name:'使用量',
            type:'bar',
            //itemStyle : {
            //    normal : {
            //        color:'darkOrange',
            //        lineStyle:{
            //            color:'white' +
            //            '',
            //            width:1
            //        }
            //    }
            //},
            data:[]

        },
        {
            name:'偏差',
            type:'line',
            showAllSymbol: true,
            yAxisIndex: 1,
            //itemStyle : {
            //    normal : {
            //        color:'darkOrange',
            //        lineStyle:{
            //            color:'red' +
            //            '',
            //            width:1
            //        }
            //    }
            //},
            data:[]


        }
    ]
};

/*---------------------------------otherFunction------------------------------*/


//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(){

    //从url中获取ID
    var idMessage = window.location.search;
    //改造项目ID
    var id = 0;

    //如果存在
    if(idMessage && idMessage != ''){

        id = idMessage.split('=')[1];
    }
    var ecParams = {
        PK_EnergyProj : id
    };

    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergySavTrackV2/GetProjManageByID',
        data:ecParams,
        timeout:_theTimes,
        success:function(result){

            console.log(result);

            projManage = result;
            //return false;

            //判断是否返回数据
            if(result == null || result.length == 0){
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'无数据', '');
                return false;
            }

            //改造名称
            $('.improve-name span').html(result.f_ProjectName);
            //改造内容
            $('.improve-content span').html(result.f_ProjectContent);
            //改造开始时间
            $('.start-date span').html(result.f_StartDate.split(' ')[0]);
            startDate = result.f_StartDate.split(' ')[0];
            //改造结束时间
            $('.end-date span').html(result.f_EndDate.split(' ')[0]);
            endDate = result.f_StartDate.split(' ')[0];
            //改造所属楼宇
            $('.belong-building span').html(result.energyProjPointers[0].f_PointerName);
            //改造涉及支路
            $('.belong-branch span').html(result.energyProjPointers[0].energyProjBranchs[0].f_BranchName);

            //根据能耗类型获取单位
            var energyType = result.f_EnergyType;

            unit = getUnit(energyType);

            //给页面上方改造时间赋值
            var startTime1 = moment(startDate).subtract('1','months').format('YYYY-MM-DD');
            //改造前开始时间
            $('.min').val(startTime1);
            //改造前结束时间
            $('.max').val(startDate);
            var endTime1 = moment(endDate).add('1','months').format('YYYY-MM-DD');
            //改造后结束时间
            $('.max1').val(endTime1);
            //改造后开始时间
            $('.min1').val(endDate);

            //获取eCharts图数据
            getEchartsData();

        },
        error:function(jqXHR, textStatus, errorThrown){

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
            }

        }
    })
};

//获取eCharts展示数据
function getEchartsData(){

    var ecParams = {

        "projManage" : projManage,
        "beforeST": $('.min').val(),
        "beforeET": $('.max').val(),

        "laterST": $('.min1').val(),
        "laterET": $('.max1').val()
    }

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergySavTrackV2/GetEnergyVerifyData',
        data:ecParams,
        timeout:_theTimes,
        success:function(result){

            console.log(result);

            //节能量
            $('#consumption-value-number').html(result.savingEnergyData.toFixed(1));
            //单位
            $('.the-cumulative-power-unit').html(unit);

            //co2排放量
            $('.compared-with-last-time0 b font').html(result.cO2Data.toFixed(1));
            //相当于植树
            $('.compared-with-last-time1 b font').html(result.treePlanting.toFixed(1));

            //改造前数据
            $('.quota-year b').html((result.beforeEnergyVerify.avgMetaData).toFixed(1) + unit);

            //改造后数据
            $('.quota-year1 b').html((result.laterEnergyVerify.avgMetaData).toFixed(1) + unit);

            //百分比数据
            $('.right-up-precent').html((Math.abs(result.savingEnergyPercent)*100).toFixed(1) + '%');

            //根据百分比数据判断箭头是上升还是下降
            if(result.savingEnergyPercent > 0){
                //大于0时使用向上的箭头
                $('.rights-up').addClass('right-ups');
                //小于0时使用向下的箭头
                $('.rights-up').removeClass('right-ups');
            }

        },
        error:function(jqXHR, textStatus, errorThrown){
            myChartTopLeft.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

}

