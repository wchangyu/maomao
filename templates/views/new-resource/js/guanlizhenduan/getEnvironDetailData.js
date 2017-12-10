
/**
 * Created by admin on 2017/12/4.
 */
$(function(){

    //默认加载数据
    getPointerData('OneKeyDiag/GetEnvironDetailData');

    /*---------------------------------buttonEvent------------------------------*/
    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };
});

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));
//环形图
var myChartTopLeft1 = echarts.init(document.getElementById('rheader-content-17'));

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    calculable : true,
    xAxis : [
        {
            show:'false',
            type : 'category',
            data:['定额量','能耗量']
        }
    ],
    yAxis : [
        {
            show : false,
            type : 'value'
        }
    ],
    series : [
        {
            name:'',
            type:'bar',
            data:[],
            barMaxWidth: '30'
        }
    ]
};

//折线图配置项
var optionLine = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['指标数据','定额数据'],
        top:'30'
    },
    toolbox: {
        show : true,
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['bar', 'line']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['本期','上期']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    grid: {
        left: '10%',
        right: '8%'
    },
    series : [
        {
            name:'指标数据',
            type:'line',
            smooth:true,
            data:[]
        },
        {
            name:'当前数据',
            type:'line',
            smooth:true,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ],
                itemStyle : {
                    normal:{
                        color:'#019cdf'
                    }
                },
                label:{
                    normal:{
                        textStyle:{
                            color:'#d02268'
                        }
                    }
                }
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}


                ]

            },
            data:[]
        }
    ]
};

//环形图配置项
var option1 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        type: 'scroll',
        top: 10,
        bottom: 10,
        data:['正常','异常'],
        show : false
    },
    grid:{
        left:'right'
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series: [
        {
            name:'整体统计',
            type:'pie',
            radius: ['50%', '75%'],
            data:[
                {name:'正常',value:600},
                {name:'异常',value:400}
            ],
            center:['50%','50%'],
            itemStyle:{
                normal:{
                    label:{
                        show: true,
                        formatter: '{b} : \n {c} ({d}%)'
                    },
                    labelLine :{show:true}
                }
            }
        }
    ]
};

myChartTopLeft1.setOption(option1,true);

/*---------------------------------otherFunction------------------------------*/

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(url){
    //定义存放返回数据的数组（本期 X Y）
    var allData = [];
    var allDataX = [];
    var allDataY = [];
    var allDataY1 = [];
    var allDataY2 = [];
    var totalAllData = 0;

    //定义获得数据的参数
    var ecParams = {};

    //获取数据标识ID
    var id = parseInt(window.location.search.split('=')[1]) + 1;

    var diagSpecificArrs =  JSON.parse(sessionStorage.getItem('diagSpecific'));

    //改变头部显示信息
    var energyName = '';

    //获取传递给后台的数据
    $(diagSpecificArrs).each(function(i,o){
        //如果ID相等
        if(o.indexId == id){

            //获取当前的诊断问题对象
            ecParams = o;
            //获取当前错误描述
            energyName = o.oneKeyDiagDesc;
        }

    });

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+url,
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            myChartTopLeft.showLoading();
        },
        success:function(result){

            myChartTopLeft.hideLoading();

            console.log(result);

            //return false;

            //判断是否返回数据
            if(result == null){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }

            //改变头部日期
            var date = '';

            $('.right-header-title').html(energyName + ' &nbsp;' + date);

            //首先处理本期的数据
            allData.length = 0;

            $(result.diagEnvironDatas).each(function(i,o){
                allData.push(o);
            });

            //首先处理实时数据
            allDataX.length = 0;
            allDataY.length = 0;
            allDataY1.length = 0;
            allDataY2.length = 0;

            //绘制echarts

            //确定x轴
            for(var i=0;i<allData.length;i++){

                allDataX.push(allData[i].dataDate);

            }

            //确定本期y轴
            for(var i=0;i<allData.length;i++){
                //指标数据
                allDataY.push(allData[i].indicatorData.toFixed(2));
                //当前数据
                allDataY1.push(allData[i].environData.toFixed(2));
            }

            //echart折现图
            optionLine.xAxis[0].data = allDataX;
            optionLine.series[0].data = allDataY;
            optionLine.series[1].data = allDataY1;

            //echart柱状图
            allDataY2.push(result.sumDingEData.toFixed(2));
            allDataY2.push(result.sumEnergyData.toFixed(2));

            optionBar.series[0].data = allDataY2;
            //上方echarts
            myChartTopLeft.setOption(optionLine,true);
            //下方柱状图
            myChartTopLeft1.setOption(optionBar,true);

            //比例
            var percent = (Math.abs(result.energyDingeScale * 100)).toFixed(1) + '%';
            $('.left-pillar .percent').html(percent);

            if(result.energyDingeScale > 0){
                //向上的图标
                $('.left-pillar').addClass('up');
            }else{
                //向下的图标
                $('.left-pillar').removeClass('up');
            }

            //下方诊断信息
            if(prm.diagItemTypeFlag == '455'){

                $('.right-diagnose').show();

            }else{

                $('.right-diagnose').hide();

            }

            //右侧展示信息


        },
        error:function(jqXHR, textStatus, errorThrown){

            myChartTopLeft.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
            }
        }
    })
}
