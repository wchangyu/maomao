/**
 * Created by admin on 2018/11/17.
 */
$(function(){

    //左侧echart循环赋值
     drawEchart();

    //给右侧环形图echart赋值
    operationEchart();

    //页面上方天气信息时间
    getWeatherDate();

});

//获取当前时间
var curDate = moment().format('YYYY-MM-DD');

var curWeek =weekToWord(moment().format('d'));

var year = curDate.split('-')[0];

var month = curDate.split('-')[1];

var day = curDate.split('-')[2];

$('.the-date .date').html(curDate);

$('.interval0 .year').html(year);

$('.interval0 .month').html(month);

$('.interval0 .day').html(day);

$('.the-date .week').html(curWeek);

//获取当前是星期几 中文
function weekToWord(num){

    if(num == 0){

        return '星期日';

    }else if(num == 1){

        return '星期一';

    }else if(num == 2){

        return '星期二';

    }else if(num == 3){

        return '星期三';

    }else if(num == 4){

        return '星期四';

    }else if(num == 5){

        return '星期五';

    }else if(num == 6){

        return '星期六';
    }
};

//页面上方天气信息时间
function getWeatherDate(){

    var length = $('.right-week-message-container').length + 1;

    for(var i=1; i<length; i++){

        var thisDate = moment().add(i,'days').format('MM-DD');

        $('.right-week-message-container').eq(i-1).find('.date').html(thisDate);
    }
}

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

//左侧环形图
var _conditioneroption = {

    title: {
        text: '228',
        subtext: '总台数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '118',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 24,
            fontWeight : 'normal',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 12
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 15,
        y : 5,
        itemGap:4,
        data:['运行中','故障中','停机中'],
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
            radius : [55, 65],
            center:['50%', '55%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:200,
                    name:'运行中',
                    itemStyle: {
                        normal : {
                            color: '#14e398'
                        }
                    }

                },
                {
                    value:28,
                    name:'',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [45, 55],
            center:['50%', '55%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:18,
                    name:'故障中',
                    itemStyle: {
                        normal : {
                            color: '#f8276c'

                        }
                    }
                },
                {
                    value:210,
                    name:'',
                    itemStyle : placeHolderStyle
                }


            ]
        },
        {
            name:'3',
            type:'pie',
            radius : [35, 45],
            center:['50%', '55%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:10,
                    name:'停机中',
                    itemStyle: {
                        normal : {
                            color: '#ead01e'

                        }
                    }
                },
                {
                    value:218,
                    name:'',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//101#楼
var _conditionerEcharts = echarts.init(document.getElementById('equipment-chart-conditioner'));

_conditionerEcharts.setOption( _conditioneroption,true);


var _electricityoption = {

    title: {
        text: '25.6℃',
        subtext: '室内温度',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '118',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 24,
            fontWeight : 'normal',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 12
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 15,
        y : 5,
        itemGap:4,
        data:['室内湿度','室外温度'],
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
            radius : [55, 65],
            center:['50%', '55%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:20.6,
                    name:'室内湿度',
                    itemStyle: {
                        normal : {
                            color: '#14e398'
                        }
                    }

                },
                {
                    value:26.4,
                    name:'',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [45, 55],
            center:['50%', '55%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:25.6,
                    name:'室外温度',
                    itemStyle: {
                        normal : {
                            color: '#2170f4'

                        }
                    }
                },
                {
                    value:21.4,
                    name:'',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

var _electricityEcharts = echarts.init(document.getElementById('equipment-chart-conditioner1'));

_electricityEcharts.setOption(_electricityoption,true);

//左侧echart循环赋值
function drawEchart(){

    var theLength = $('.bottom-equipment-chart-data').length;

    for(var i=0; i<theLength; i++){

        var echartDom = document.getElementsByClassName('bottom-equipment-chart-data')[i];

        var leftChart = echarts.init(echartDom);

        leftChart.setOption( _conditioneroption,true);

        var echartDom1 = document.getElementsByClassName('bottom-equipment-chart-show')[i];

        var rightChart = echarts.init(echartDom1);

        rightChart.setOption( _electricityoption,true);

    }

};


//--------------------------------页面右侧环形图-----------------------------//

//运维统计echart图
var _rightMiddleChart7 = echarts.init(document.getElementById('equipment-chart-right'));


// 指定图表的配置项和数据 用于运维统计
var option2 = {
    title: {
        text: '228',
        subtext: '总台数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '110',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 24,
            fontWeight : 'normal',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 12
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: " {c} "
    },
    legend: {
        orient : 'vertical',
        x : 15,
        y : 5,
        itemGap:4,
        show:true,
        itemWidth:22,
        itemHeight:10,
        data:['已完成','派单中','进行中'],
        textStyle:{
            color:'white'
        }

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['50%', '65%'],
            center:['50%', '55%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: false,
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
                            '#14E398','#EAD01E', '#2170F4','#993BDB','#cfcf14', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
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
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '16',
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
                {
                    name:'已完成',
                    value:115
                },
                {
                    name:'派单中',
                    value:24
                },
                {
                    name:'进行中',
                    value:11
                }
            ]
        }
    ]
};

_rightMiddleChart7.setOption(option2,true);


//右侧环形图数据
var operationDataArr = [

    {
        'name':'数量',
        'data':[
            {
                name:'温度',
                value:22
            },
            {
                name:'湿度',
                value:38
            },
            {
                name:'压力',
                value:90
            }
        ]

    },
    {
        'name':'数量',
        'data':[
            {
                name:'温度',
                value:8
            },
            {
                name:'湿度',
                value:12
            },
            {
                name:'压力',
                value:15
            }
        ]

    },
    {
        'name':'工单量',
        'data':[
            {
                name:'已完成',
                value:115
            },
            {
                name:'派单中',
                value:20
            },
            {
                name:'进行中',
                value:15
            }
        ]

    },
    {
        'name':'未完成',
        'data':[
            {
                name:'空调',
                value:20
            },
            {
                name:'冷库',
                value:7
            },
            {
                name:'管道',
                value:5
            },
            {
                name:'其他',
                value:3
            }
        ]

    },
    {
        'name':'万元',
        'data':[
            {
                name:'电',
                value:115
            },
            {
                name:'水',
                value:20
            },
            {
                name:'气',
                value:15
            }
        ]

    },
    {
        'name':'万元',
        'data':[
            {
                name:'电',
                value:20
            },
            {
                name:'水',
                value:10
            },
            {
                name:'气',
                value:5
            }
        ]

    }

];

//给右侧环形图echart赋值
function operationEchart(){

    $(operationDataArr).each(function(i,o){


        option2.title.subtext = operationDataArr[i].name;

        var totolNum = 0;

        option2.series[0].data = operationDataArr[i].data;

        var ledendArr = [];

        $(operationDataArr[i].data).each(function(k,j){

            ledendArr.push(j.name);

            totolNum += j.value;
        });

        option2.title.text=  totolNum;

        option2.legend.data = ledendArr;

        var echartDom = document.getElementsByClassName('bottom-equipment-chart-shows')[i];

        var leftChart = echarts.init(echartDom);

        leftChart.setOption( option2,true);

    })
};


//------------------------------------------能源管理echart----------------------------------

var colorBar = '#2170F4';

//中间下方柱状图
var leftBottomChart1 = echarts.init(document.getElementById('echarts-left-bottom1'));

var option00 = {
    color: [colorBar],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '2%',
        right: '2%',
        bottom: '1%',
        top:'14%',
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
            name:'单位:(kWh)',
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


//-----------------------------------------温度曲线-----------------------------------------//
var temOption = {

    grid: {
        left: '0.5%',
        right: '0.5%',
        bottom: '1%',
        top:'2',
        show:false
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        },
        show:false
    },
    xAxis: {
        type: 'category',
        data: ['18','19','20','21','22','23','24'],
        show:false
    },
    yAxis: {
        type: 'value',
        max:20,
        min:-5,
        show:false
    },
    series: [
        {
            name:'最高温度',
            type:'line',
            color:'#DD4B7B',
            itemStyle : {

                normal: {
                    label : {
                        show: true,
                        formatter: '{c}°'
                    }
                }
            },
            data:[12, 10, 11, 12, 10, 9, 11]
        },
        {
            name:'最低温度',
            type:'line',
            color:'#E2E2E2',
            itemStyle : {
                normal: {
                    label : {
                        show: true,
                        position:'bottom',
                        formatter: '{c}°'
                    }
                }
            },
            data:[4, 2, 2, 3, 4, 2, 5]
        }
    ]
};

//中间下方柱状图
var centerTopChart = echarts.init(document.getElementById('bottom-temp-curve'));

centerTopChart.setOption(temOption);


