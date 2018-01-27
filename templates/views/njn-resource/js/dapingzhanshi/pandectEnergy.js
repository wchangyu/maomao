/**
 * Created by admin on 2018/1/22.
 */
$(function(){


});

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

_electricityEcharts.setOption(_electricityoption,true);

_electricityEcharts1.setOption(_electricityoption,true);


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

_conditionerEcharts.setOption(_conditioneroption,true);

_conditionerEcharts1.setOption(_electricityoption,true);


//电梯系统echart
var _elevatorEcharts = echarts.init(document.getElementById('equipment-chart-elevator'));

var _elevatorEcharts1 = echarts.init(document.getElementById('equipment-chart-elevator1'));


_elevatorEcharts.setOption(_conditioneroption,true);

_elevatorEcharts1.setOption(_conditioneroption,true);

//动环系统echart
var _rotatingEcharts = echarts.init(document.getElementById('equipment-chart-rotating'));

var _rotatingEcharts1 = echarts.init(document.getElementById('equipment-chart-rotating1'));


_rotatingEcharts.setOption(_conditioneroption,true);

_rotatingEcharts1.setOption(_electricityoption,true);



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

_stationEcharts.setOption( _stationoption,true);


//站台照明echart
var _platformEcharts = echarts.init(document.getElementById('equipment-chart-platform'));

_platformEcharts.setOption( _stationoption,true);

//送排风echart
var _windEcharts = echarts.init(document.getElementById('equipment-chart-wind'));

_windEcharts.setOption( _stationoption,true);

//给排水echart
var _waterEcharts = echarts.init(document.getElementById('equipment-chart-water'));

_waterEcharts.setOption( _stationoption,true);



//能源管理echart
//左侧下方柱状图
var leftBottomChart = echarts.init(document.getElementById('echarts-left-bottom1'));

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
            name:'直接访问',
            type:'bar',
            barWidth: '60%',
            data:[810, 952, 900, 934, 890, 730, 1020, 952, 900, 934, 890, 730]
        }
    ]
};

//重绘chart图
leftBottomChart.setOption(option);



//用电分项echart图
var _useelectricityChart = echarts.init(document.getElementById('echarts-left-bottom2'));

var _useelectricityoption = {

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
                            '#33E3B6', '#ead01e','#f8276c'
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
                        value:6
                    },
                    {
                        name:'送排风',
                        value:12
                    },
                    {
                        name:'空调',
                        value:9
                    }
            ]
        }
    ]
};

//重绘chart图
_useelectricityChart.setOption(_useelectricityoption);


//运维联动
var _operationresponseChart = echarts.init(document.getElementById('operation-chart-response'));

var _operationresponseChart1 = echarts.init(document.getElementById('operation-chart-response1'));

//重绘chart图
_operationresponseChart.setOption(_useelectricityoption);

_operationresponseChart1.setOption(_useelectricityoption);