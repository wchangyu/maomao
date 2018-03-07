/**
 * Created by admin on 2018/1/22.
 */
$(function(){

    //获取页面主题部分数据
    getTPDevMonitor();

    //获取下方能源管理数据
    getPointerData();

    //获取电耗分项数据
    getFirstEnergyItemData();

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


    //默认刷新时间
    var _refresh = sessionStorage.getItem("dapinInterval");

    if(_refresh!=0){

        //定时刷新
        setInterval(function(){

            //获取页面主题部分数据
            getTPDevMonitor();

            //获取下方能源管理数据
            getPointerData();

            //获取电耗分项数据
            getFirstEnergyItemData();


        },_refresh * 1000 * 60)
    }

});

//定义是否出现加载遮罩的标识
var ifShowLoading = true;

var ifShowLoading1 = true;

var ifShowLoading2 = true;

//定义计算安全运行天数的开始日期
var startSafeDate = new Date('2017/01/01 12:00');

var date2 = new Date();

var s1 = startSafeDate.getTime(),s2 = date2.getTime();

var total = (s2 - s1)/1000;

var safeDays = parseInt(total / (24*60*60));//计算整数天数

//给页面中赋值
$('.right-bottom-safe .safe-days').html(safeDays);

console.log(safeDays);

//冷热源echart
var _electricityEcharts = echarts.init(document.getElementById('equipment-chart-electricity'));

var _electricityEcharts1 = echarts.init(document.getElementById('equipment-chart-electricity1'));

var dataStyle = {
    normal: {
        label: {show:false},
        labelLine: {show:false}
    }
};
var placeHolderStyle = {
    normal : {
        color: 'rgba(0,0,0,0)',
        label: {show:false},
        labelLine: {show:false}
    },
    emphasis : {
        color: 'rgba(0,0,0,0)'
    }
};

var _electricityoption = {

    title: {
        text: '3.5',
        subtext: '电冷能效',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '115',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:['输入电量','输出冷量'],
        show:true,
        itemWidth:22,
        itemHeight:10,
        textStyle:{
            color:'white',
            fontSize:10
        }
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
    series : [
        {
            name:'1',
            type:'pie',
            radius : [50, 60],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:68,
                    name:'输入电量',
                    itemStyle: {
                        normal : {
                            color: '#14e398'
                        }
                    }

                },
                {
                    value:32,
                    name:'68kw',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:29,
                    name:'输出冷量',
                    itemStyle: {
                        normal : {
                            color: '#2170f4'

                        }
                    }
                },
                {
                    value:71,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//_electricityEcharts.setOption(_electricityoption,true);
//
//_electricityEcharts1.setOption(_electricityoption,true);


//空调机组echart
var _conditionerEcharts = echarts.init(document.getElementById('equipment-chart-conditioner'));

var _conditionerEcharts1 = echarts.init(document.getElementById('equipment-chart-conditioner1'));

var _conditioneroption = {

    title: {
        text: '228',
        subtext: '总台数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '115',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:['运行中','故障中','维修中'],
        show:true,
        itemWidth:20,
        itemHeight:10,
        textStyle:{
            color:'white',
            fontSize:10
        }
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
    series : [
        {
            name:'1',
            type:'pie',
            radius : [50, 60],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:68,
                    name:'运行中',
                    itemStyle: {
                        normal : {
                            color: '#14e398'
                        }
                    }

                },
                {
                    value:32,
                    name:'68kw',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:29,
                    name:'故障中',
                    itemStyle: {
                        normal : {
                            color: '#f8276c'

                        }
                    }
                },
                {
                    value:71,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        },
        {
            name:'3',
            type:'pie',
            radius : [30, 40],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:19,
                    name:'维修中',
                    itemStyle: {
                        normal : {
                            color: '#ead01e'

                        }
                    }
                },
                {
                    value:81,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//_conditionerEcharts.setOption(_conditioneroption,true);
//
//_conditionerEcharts1.setOption(_electricityoption,true);


//电梯系统echart
var _elevatorEcharts = echarts.init(document.getElementById('equipment-chart-elevator'));

var _elevatorEcharts1 = echarts.init(document.getElementById('equipment-chart-elevator1'));


//_elevatorEcharts.setOption(_conditioneroption,true);
//
//_elevatorEcharts1.setOption(_conditioneroption,true);

//动环系统echart
var _rotatingEcharts = echarts.init(document.getElementById('equipment-chart-rotating'));

var _rotatingEcharts1 = echarts.init(document.getElementById('equipment-chart-rotating1'));


//_rotatingEcharts.setOption(_conditioneroption,true);
//
//_rotatingEcharts1.setOption(_electricityoption,true);



//站房照明echart
var _stationEcharts = echarts.init(document.getElementById('equipment-chart-station'));

var _stationoption = {

    title: {
        text: '228',
        subtext: '总台数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '115',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:['运行中','故障中'],
        show:true,
        itemWidth:20,
        itemHeight:10,
        textStyle:{
            color:'white',
            fontSize:10
        }
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
    series : [
        {
            name:'1',
            type:'pie',
            radius : [50, 60],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:68,
                    name:'运行中',
                    itemStyle: {
                        normal : {
                            color: '#14e398'
                        }
                    }

                },
                {
                    value:32,
                    name:'68kw',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:29,
                    name:'故障中',
                    itemStyle: {
                        normal : {
                            color: '#f8276c'

                        }
                    }
                },
                {
                    value:71,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//_stationEcharts.setOption( _stationoption,true);


//站台照明echart
var _platformEcharts = echarts.init(document.getElementById('equipment-chart-platform'));

//_platformEcharts.setOption( _stationoption,true);

//送排风echart
var _windEcharts = echarts.init(document.getElementById('equipment-chart-wind'));

//_windEcharts.setOption( _stationoption,true);

//给排水echart
var _waterEcharts = echarts.init(document.getElementById('equipment-chart-water'));

//_waterEcharts.setOption( _stationoption,true);



//能源管理echart
//左侧下方柱状图
var leftBottomChart1 = echarts.init(document.getElementById('echarts-left-bottom1'));

var option = {
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
        top:'2%',
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
leftBottomChart1.setOption(option);



//用电分项echart图
var _useelectricityChart = echarts.init(document.getElementById('echarts-left-bottom2'));

var _useelectricityoption = {
    title: {
        text: '225',
        subtext: '工单量',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '102',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
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
            radius: ['45%', '60%'],
            center:['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'outside'
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
                            '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : true,
                        formatter:'{d}'+'%'+ '\n{b}',
                        color:'white'
                    },
                    labelLine : {
                        show : true,
                        color:'white'

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
                    show: true
                }
            },
            data:[
                    {
                        name:'已完成',
                        value:100
                    },
                    {
                        name:'派单中',
                        value:80
                    },
                    {
                        name:'进行中',
                        value:45
                    }
            ]
        }
    ]
};



// 指定图表的配置项和数据 用于本日用能分项
var option8 = {
    title: {
        text: '225',
        subtext: '工单量',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: '120',
        top: '122',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:[],
        textStyle:{
            color:'white'
        }

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
                            '#14E398', '#0BA3C3','#0353F7', '#3C27D5', '#6512D7','#f8276c', '#33E3B6', '#ead01e','#f8276c'
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


//重绘chart图
//_useelectricityChart.setOption(_useelectricityoption);


var _useelectricityoption1 = {
    title: {
        text: '225',
        subtext: '工单量',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '102',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
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
            radius: ['45%', '60%'],
            center:['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'outside'
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
                            '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : true,
                        formatter:'{d}'+'%'+ '\n{b}',
                        color:'white'
                    },
                    labelLine : {
                        show : true,
                        color:'white'

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
                    show: true
                }
            },
            data:[
                {
                    name:'照明',
                    value:100
                },
                {
                    name:'暖通空调',
                    value:80
                },
                {
                    name:'设备设施',
                    value:45
                }
            ]
        }
    ]
};

//运维联动
var _operationresponseChart = echarts.init(document.getElementById('operation-chart-response'));

var _operationresponseChart1 = echarts.init(document.getElementById('operation-chart-response1'));

//重绘chart图
_operationresponseChart.setOption(_useelectricityoption);

_operationresponseChart1.setOption(_useelectricityoption1);

//清空数据
$('.bottom-content-data span').html('');

//-----------------------------------获取页面主体部分数据----------------------------//

//定义环形图颜色集合
var colorArr1 = ['#14e398','#2170f4'];

var colorArr2 = ['#14e398','#f8276c','#ead01e'];

//定义echart集合
var echartNameArr = [_electricityEcharts,_electricityEcharts1,_conditionerEcharts,_conditionerEcharts1,_elevatorEcharts,_elevatorEcharts1, _rotatingEcharts, _rotatingEcharts1,
    _stationEcharts,_platformEcharts,_windEcharts,_waterEcharts ];

//插入背景圆形图
var cicleHtml =   '<div class="bottom-equipment-chart-background"></div>';

$('.right-bottom-equipment-container .bottom-equipment-chart-container .bottom-content-data').before(cicleHtml);

//获取当前是冬季还是夏季 冬季返回 0 夏季返回1
function getSeason(){

    //获取当前年份
    var year = moment().format('YYYY');

    var curDate = moment().format('YYYY-MM-DD');

    //夏季时间
    var summerDate1 = year + '-03-15';

    var summerDate2 = year + '-09-15';

    //如果在夏季
    if(curDate > summerDate1 && curDate < summerDate2){

        return 1

    }else{

        return 0
    }
};

//获取数据
function getTPDevMonitor(){

    //开始结束时间
    var startTime = moment().format('YYYY-MM-DD');

    var endTime = moment().add(1,'days').format('YYYY-MM-DD');

    //传递给后台的数据
    var ecParams = {
        "startTime": startTime,
        "endTime":  endTime,
        "pointerIDs": curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'NJNDeviceShow/GetTPDevMonitor',
        data:ecParams,
        //timeout:_theTimes * 2,
        beforeSend:function(){

            if(ifShowLoading){
                $( echartNameArr).each(function(i,o){

                    o.showLoading({
                        maskColor: 'rgba(33,43,55,0.8)'
                    });
                });

                ifShowLoading = false;
            }

        },
        success:function(result){

            //console.log(result);

            $( echartNameArr).each(function(i,o){

                o.hideLoading();
            });

            if(result == null || result.length == 0){

                return false;
            }

            //-----------------------------冷热源---------------------------//
            //电冷能效
            var elecColdEffic = (result.coldHotSourceOBJ.elecColdEffic * 100).toFixed(1) + '%';

            //输入电量
            var inputElecData = result.coldHotSourceOBJ.inputElecData;

            //输出电冷量
            var elecColdData = result.coldHotSourceOBJ.elecColdData;

            //获取当前是冬季夏季 夏季为1 冬季为2 非冬夏0

            var elecColdDataArr = [];

            var elecColdCenterData = {};

            var eleUnit = '';

            //如果是夏天
            if(result.coldHotSourceOBJ.winterORSummer == 1){

                elecColdDataArr = [
                    {name:'输入电量',data:inputElecData},
                    {name:'输出冷量',data:elecColdData}
                ];

                elecColdCenterData = {name:'电冷能效',data:elecColdEffic};

                //$('.right-bottom-container .right-bottom-equipment .right-bottom-equipment-container ').eq(0).find('.equipment-title a').html('冷冻机房');

                eleUnit = "KW";

            }else{

                elecColdDataArr = [
                    {name:'东输入蒸汽',data:inputElecData},
                    {name:'东输出热量',data:elecColdData}
                ];

                elecColdCenterData = {name:'换热能效',data:elecColdEffic};

                //$('.right-bottom-container .right-bottom-equipment .right-bottom-equipment-container ').eq(0).find('.equipment-title a').html('换热站');

                eleUnit = "KW";
            }


            //给echarts赋值
            drawEcharts(elecColdDataArr,'equipment-chart-electricity',colorArr1,elecColdCenterData, _electricityoption, eleUnit);

            var eleUnit1 = '';

            //汽冷能效
            var steamColdEffic = (result.coldHotSourceOBJ.steamColdEffic * 100).toFixed(1) + '%';

            //输入汽量
            var steamData = result.coldHotSourceOBJ.steamData;

            //输出汽冷量
            var steamColdData = result.coldHotSourceOBJ.steamColdData;

            var steamColdEfficData;

            var steamDataArr;

            //夏季为1
            if(result.coldHotSourceOBJ.winterORSummer == 1){

                steamDataArr = [
                    {name:'输入蒸汽',data:steamData},
                    {name:'输出冷量',data:steamColdData}
                ];

                steamColdEfficData = {name:'汽冷能效',data:steamColdEffic};

                eleUnit1 = "KW";

            }else{

                steamDataArr = [
                    {name:'西输入蒸汽',data:steamData},
                    {name:'西输出热量',data:steamColdData}
                ];

                steamColdEfficData = {name:'换热能效',data:steamColdEffic};

                eleUnit1 = "KW";
            }

            //给echarts赋值
            drawEcharts(steamDataArr,'equipment-chart-electricity1',colorArr1,steamColdEfficData, _electricityoption, eleUnit1);

            //电功率
            $('#equipment-chart-electricity').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.coldHotSourceOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-electricity1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.coldHotSourceOBJ.alarmNum);

            $('#equipment-chart-electricity1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.coldHotSourceOBJ.cDataIDNum);

            //-----------------------------空调机组---------------------------//
            //总台数
            var allNum = result.airUnitOBJ.allNum;

            //运行中
            var runNum = result.airUnitOBJ.runNum;

            //故障中
            var faultNum = result.airUnitOBJ.faultNum;

            //维修中
            var repairNum = result.airUnitOBJ.repairNum;

            var airDataArr = [
                {name:'运行中',data:runNum},
                {name:'故障中',data:faultNum},
                {name:'维修中',data:repairNum}
            ];

            var airCenterData = {name:'总台数',data:allNum};

            //给echarts赋值
            drawEcharts(airDataArr,'equipment-chart-conditioner',colorArr2,airCenterData, _conditioneroption,'');


            //送风温度
            var indoorTemp = result.airUnitOBJ.sendExhaustTemp;

            //室内湿度
            var steamData = result.airUnitOBJ.indoorHumidity;

            //室内温度
            var outdoorTemp = result.airUnitOBJ.indoorTemp;

            var TempArr = [
                {name:'室内温度',data:outdoorTemp},
                {name:'室内湿度',data:steamData}
            ];

            var indoorTempData = {name:'送风温度',data:indoorTemp};

            //给echarts赋值
            drawEcharts(TempArr,'equipment-chart-conditioner1',colorArr1,indoorTempData, _electricityoption,'℃');

            //电功率
            $('#equipment-chart-conditioner').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.airUnitOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-conditioner1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.airUnitOBJ.alarmNum);

            $('#equipment-chart-conditioner1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.airUnitOBJ.cDataIDNum);


            //-----------------------------电梯系统---------------------------//
            //直梯数
            var allNum1 = result.elevatorSysOBJ.verticalLadder.allNum;

            //运行中
            var runNum1 = result.elevatorSysOBJ.verticalLadder.allNum;

            //故障中
            var faultNum1 = result.elevatorSysOBJ.verticalLadder.faultNum;

            //维修中
            var repairNum1 = result.elevatorSysOBJ.verticalLadder.repairNum;

            var elevatorDataArr = [
                {name:'运行中',data:runNum1 },
                {name:'故障中',data:faultNum1 },
                {name:'维修中',data:repairNum1 }
            ];

            var elevatorCenterData = {name:'直梯数',data:allNum1};

            //给echarts赋值
            drawEcharts(elevatorDataArr,'equipment-chart-elevator',colorArr2,elevatorCenterData, _conditioneroption,'');

            //扶梯数
            var allNum2 = result.elevatorSysOBJ.escalator.allNum;

            //运行中
            var runNum2 = result.elevatorSysOBJ.escalator.allNum;

            //故障中
            var faultNum2 = result.elevatorSysOBJ.escalator.faultNum;

            //维修中
            var repairNum2 = result.elevatorSysOBJ.escalator.repairNum;

            var elevatorDataArr1 = [
                {name:'运行中',data:runNum2 },
                {name:'故障中',data:faultNum2 },
                {name:'维修中',data:repairNum2 }
            ];

            var elevatorCenterData1 = {name:'扶梯数',data:allNum2};

            //给echarts赋值
            drawEcharts(elevatorDataArr1,'equipment-chart-elevator1',colorArr2,elevatorCenterData1, _conditioneroption,'');


            //电功率
            $('#equipment-chart-elevator').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.elevatorSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-elevator1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.elevatorSysOBJ.alarmNum);

            $('#equipment-chart-elevator1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.elevatorSysOBJ.cDataIDNum);


            //-----------------------------动环系统---------------------------//
            //机房数
            var rotaryFaceallNum = result.rotaryFaceSysOBJ.machineRoomNum;

            //运行中
            var rotaryFacerunNum = result.rotaryFaceSysOBJ.runNum;

            //故障中
            var rotaryFacefaultNum = result.rotaryFaceSysOBJ.faultNum;

            //维修中
            var rotaryFacerepairNum = result.rotaryFaceSysOBJ.repairNum;

            var rotaryFaceArr = [
                {name:'运行中',data:rotaryFacerunNum},
                {name:'故障中',data:rotaryFacefaultNum},
                {name:'维修中',data:rotaryFacerepairNum}
            ];

            var rotaryFaceData = {name:'机房数',data:rotaryFaceallNum};

            //给echarts赋值
            drawEcharts(rotaryFaceArr,'equipment-chart-rotating',colorArr2,rotaryFaceData, _conditioneroption,'');

            //送风温度
            var indoorTemp1 = result.rotaryFaceSysOBJ.indoorTemp;

            //室内温度
            var steamData1 = result.rotaryFaceSysOBJ.indoorTemp;

            //室内湿度
            var indoorHumidity = result.rotaryFaceSysOBJ.indoorHumidity;

            var TempArr = [
                {name:'室内温度',data:steamData1},
                {name:'室内湿度',data:indoorHumidity}
            ];

            var indoorTempData = {name:'室内温度',data:indoorTemp1};

            //给echarts赋值
            drawEcharts(TempArr,'equipment-chart-rotating1',colorArr1,indoorTempData, _electricityoption,'℃');

            //电功率
            $('#equipment-chart-rotating').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.rotaryFaceSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-rotating1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.rotaryFaceSysOBJ.alarmNum);

            $('#equipment-chart-rotating1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.rotaryFaceSysOBJ.cDataIDNum);


            //-----------------------------站房照明---------------------------//
            //总回路
            var allTimesNum = result.statHouseLightOBJ.allTimesNum;

            //运行中
            var statHouserunNum = result.statHouseLightOBJ.runNum;

            //故障中
            var statHousefaultNum = result.statHouseLightOBJ.faultNum;

            var statHouseArr = [
                {name:'运行中',data:statHouserunNum},
                {name:'故障中',data:statHousefaultNum}
            ];

            var statHouseData = {name:'总回路',data:allTimesNum};

            //给echarts赋值
            drawEcharts(statHouseArr,'equipment-chart-station',colorArr2,statHouseData, _electricityoption,'');

            //电功率
            $('#equipment-chart-station').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.statHouseLightOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-station').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.statHouseLightOBJ.alarmNum);

            $('#equipment-chart-station').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.statHouseLightOBJ.cDataIDNum);

            //-----------------------------站台照明---------------------------//
            //总回路
            //var platformAllTimesNum = result.platformLightOBJ.allTimesNum;

            var platformAllTimesNum = 268;

            //运行中
            //var platformrunNum = result.platformLightOBJ.runNum;

            var platformrunNum = 107;

            //故障中
            var platformfaultNum = result.platformLightOBJ.faultNum;

            var platformArr = [
                {name:'运行中',data:platformrunNum},
                {name:'故障中',data:platformfaultNum}
            ];

            var platformData = {name:'总回路',data:platformAllTimesNum};

            //给echarts赋值
            drawEcharts(platformArr,'equipment-chart-platform',colorArr2,platformData, _electricityoption,'');

            //电功率
            $('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.platformLightOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.platformLightOBJ.alarmNum);

            //$('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.platformLightOBJ.cDataIDNum)

            $('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+"268");

            //-----------------------------送排风---------------------------//
            //总台数
            var sendExhaustAllTimesNum = result.sendExhaustOBJ.allSetNumber;

            //运行中
            var sendExhaustrunNum = result.sendExhaustOBJ.runNum;

            //故障中
            var sendExhaustfaultNum = result.sendExhaustOBJ.faultNum;

            var sendExhaustArr = [
                {name:'运行中',data:sendExhaustrunNum},
                {name:'故障中',data:sendExhaustfaultNum}
            ];

            var sendExhaustData = {name:'总台数',data:sendExhaustAllTimesNum};

            //给echarts赋值
            drawEcharts(sendExhaustArr,'equipment-chart-wind',colorArr2,sendExhaustData, _electricityoption,'');

            //电功率
            $('#equipment-chart-wind').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.sendExhaustOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-wind').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.sendExhaustOBJ.alarmNum);

            $('#equipment-chart-wind').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.sendExhaustOBJ.cDataIDNum)



            //-----------------------------给排水---------------------------//
            //总台数
            var sendDrainWaterAllTimesNum = result.sendDrainWaterOBJ.allSetNumber;

            //运行中
            var sendDrainWaterrunNum = result.sendDrainWaterOBJ.runNum;

            //故障中
            var sendDrainWaterfaultNum = result.sendDrainWaterOBJ.faultNum;

            var sendDrainWaterArr = [
                {name:'运行中',data:sendDrainWaterrunNum},
                {name:'故障中',data:sendDrainWaterfaultNum}
            ];

            var sendDrainWaterData = {name:'总台数',data:sendDrainWaterAllTimesNum};

            //给echarts赋值
            drawEcharts(sendDrainWaterArr,'equipment-chart-water',colorArr2,sendDrainWaterData, _electricityoption,'');

            //电功率
            $('#equipment-chart-water').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.sendDrainWaterOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-water').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.sendDrainWaterOBJ.alarmNum);

            $('#equipment-chart-water').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.sendDrainWaterOBJ.cDataIDNum)


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

                option.xAxis[0].data = [];
                option.series[0].data = [];

                leftBottomChart1.setOption(option);

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
            option.xAxis[0].data = allDataX;
            option.series[0].data = allDataY;

            leftBottomChart1.setOption(option);


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

//获取电耗分项数据
function getFirstEnergyItemData(){

    //获取开始结束时间
    var startDate = moment().format('YYYY-MM-DD');

    var endDate =  moment().add('1','days').format('YYYY-MM-DD');

    //传递给后台的数据
    var ecParams = {
        "startTime": startDate,
        "endTime": endDate,
        "energyItemType": '01',
        "pointerIDs":  curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetFirstEnergyItemData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            if(ifShowLoading2){

                _useelectricityChart.showLoading({
                    maskColor: 'rgba(33,43,55,0.8)'
                });

                ifShowLoading2 = false;
            }

        },
        success:function(result){

            //console.log(result);

            _useelectricityChart.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //存放能耗数据
            var dataArr = [];

            //存放图例中数据
            var legendArr = [];

            var allData = 0;

            $(result).each(function(i,o){

                //if(i > 2){
                //    return false;
                //}
                var obj = {};
                //获取能耗数据
                obj.value = o.energyItemValue.toFixed(1);

                allData += parseFloat(o.energyItemValue.toFixed(1));
                //获取能耗名称
                obj.name = o.energyItemName;

                dataArr.push(obj);

                //给图例中存储数据
                legendArr.push(o.energyItemName);
            });

            //数据赋值
            option8.series[0].data = dataArr;

            //图例赋值
            option8.legend.data = legendArr;

            option8.title.text = allData.toFixed(1);

            option8.title.subtext = '总电量';
            //页面重绘数据
            _useelectricityChart.setOption(option8,true);

        },
        error:function(jqXHR, textStatus, errorThrown){
            _useelectricityChart.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    });
};


//重新绘制echarts方法
function drawEcharts(dataArr,echartsID,colorArr,centerData,option,unit){

    //定义总数
    var allData = 0;

    //如果是温度和湿度
    if(echartsID == 'equipment-chart-rotating1' || echartsID == 'equipment-chart-conditioner1'){

        allData = 70;

     //如果是冷热源 电数据
    }else if(echartsID == 'equipment-chart-electricity'){

        //如果是夏季
        if(getSeason() == 1){

            allData = 5752;

        }else{

            allData =13630 * 2;
        }
        //如果是冷热源 汽数据
    }else if(echartsID == 'equipment-chart-electricity1'){

        //如果是夏季
        if(getSeason() == 1){

            allData = 9496;

        }else{

            allData =13630 * 2;
        }

    }else{

        if(colorArr == colorArr1){

            allData = dataArr[0].data * 1.5;

        }else{
            allData = centerData.data;
        }
    }


    //定义图例集合
    var legendArr = [];

    $(dataArr).each(function(i,o){

        var value1;

        var value2;

        if(unit != ''){

            if(dataArr[i].data){
                value1 = dataArr[i].data.toFixed(2);
                value2 = (allData - dataArr[i].data).toFixed(2);
            }

        }else{
            value1 = dataArr[i].data;
            value2 = allData - dataArr[i].data;
        }

        var data = [
            {
                value:value1,
                name:dataArr[i].name,
                itemStyle: {
                    normal : {
                        color: colorArr[i]
                    }
                }

            },
            {
                value: value2,
                name:'',
                itemStyle : placeHolderStyle
            }
        ];

        //图例赋值
        legendArr.push(dataArr[i].name);

        //数据赋值
        option.series[i].data = data;

        //echart图开始处的展示数据
        if(allData != 0){

            var thisData = 0;

            if(colorArr == colorArr1){

                thisData = dataArr[i].data.toFixed(1);

            }else{

                thisData = dataArr[i].data;
            }

            if(echartsID == 'equipment-chart-rotating1' && i == 1 || echartsID == 'equipment-chart-conditioner1' && i == 1){

                    $('#'+ echartsID).prev('.bottom-content-data').find('span').eq(i).html(thisData+'%');

            }else{
                $('#'+ echartsID).prev('.bottom-content-data').find('span').eq(i).html(thisData+unit);
            }


        }else{

            $('#'+ echartsID).prev('.bottom-content-data').find('span').eq(i).html('0');

        }


    });
    //改变中间显示的文字
    if(unit != ''){

        if(typeof centerData.data == 'number'){

            option.title.text = (centerData.data).toFixed(1);

        }else{
            option.title.text = centerData.data;
        }


    }else{
        option.title.text = centerData.data;
    }


    option.title.subtext = centerData.name;

    option.legend.data = legendArr;

    //重绘echarts
    var thisCharts = echarts.init(document.getElementById(echartsID));

    thisCharts.setOption(option,true);

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