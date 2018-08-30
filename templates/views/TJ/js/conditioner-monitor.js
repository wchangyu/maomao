/**
 * Created by admin on 2018/8/23.
 */
$(function(){


    //历史数据页面赋值
    showEchart();

    //表格数据页面赋值
    tableData();

    //机房报警echart页面赋值
    bottomRightEchart();

    //点击切换控制中的设定
    $('.top-choose-type').on('click',function(){

        $('.top-choose-type').removeClass('choose');

        $(this).addClass('choose');

    });

    //点击控制中节能量测试按钮
    $('.save-energy').on('click',function(){

        $('.save-energy').addClass('save-energy1');

        $(this).removeClass('save-energy1');

    });

    //点击控制中确定按钮
    $('.right-control .bottom-sure').on('click',function(){


        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'设置成功', '');

    });


    window.onresize = function () {

        if(myChart ){

            myChart.resize();
        }
    };
});

var dataArr = [{
    "dataDate": "2018-08-22T00:00",
    "data": 1900.4297
}, {
    "dataDate": "2018-08-22T01:00",
    "data": 2100.0792
}, {
    "dataDate": "2018-08-22T02:00",
    "data": 2345.0767
}, {
    "dataDate": "2018-08-22T03:00",
    "data": 2275.879
}, {
    "dataDate": "2018-08-22T04:00",
    "data": 2270.2213
}, {
    "dataDate": "2018-08-22T05:00",
    "data": 2173.3517
}, {
    "dataDate": "2018-08-22T06:00",
    "data": 1959.3715
}, {
    "dataDate": "2018-08-22T07:00",
    "data": 2020.3592
}, {
    "dataDate": "2018-08-22T08:00",
    "data": 2303.2391
}, {
    "dataDate": "2018-08-22T09:00",
    "data": 2137.2488
}, {
    "dataDate": "2018-08-22T10:00",
    "data": 1911.1791
}, {
    "dataDate": "2018-08-22T11:00",
    "data": 2384.009
}, {
    "dataDate": "2018-08-22T12:00",
    "data": 2270.2891
}, {
    "dataDate": "2018-08-22T13:00",
    "data": 2109.2293
}, {
    "dataDate": "2018-08-22T14:00",
    "data": 1922.6695
}];

//左下角折线图
var myChart = echarts.init(document.getElementById('left-bottom-cheart'));

//折线图配置项
var optionLine = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['历史数据'],
        top:'30'
    },
    toolbox: {
        show : false,
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
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    grid: {
        left: '2%',
        right: '8%',
        top:"12%",
        containLabel: true,
        bottom:"6%"
    },
    series : [

        {
            name:'数据',
            type:'line',
            smooth:true,
            itemStyle : {
                normal : {
                    lineStyle:{
                        color:'#4B85E5'
                    }
                }
            },
            markPoint : {
                data : [
                    {
                        type : 'max',
                        name: '最大值',
                        itemStyle:{
                            color:'#F25B72'
                        },
                        textStyle:{
                            color:'#F25B72'
                        }

                    },
                    {
                        type : 'min',
                        name: '最小值',
                        itemStyle:{
                            color:'#5BDEB6'
                        },
                        textStyle:{
                            color:'#5BDEB6'
                        }
                    }
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
            data: []
        }
    ]
};

//页面赋值
function showEchart(){

    var xArr = [];

    var dataArr1 = [];

    $(dataArr).each(function(i,o){

        xArr.push(o.dataDate.split('T')[1]);

        dataArr1.push((o.data / 100) .toFixed(1));
    });

    optionLine.xAxis[0].data = xArr;

    optionLine.series[0].data = dataArr1;

    //页面重绘数据
    myChart.setOption(optionLine,true);
};

//-----------------------------------交接班记录--------------------------------//
var tableArr = [
    {

        "time":"08-20  8:00",
        "thing":"9.5日更换精密空调过滤网",
        "area":"CRAH14",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"张三"
    },
    {

        "time":"08-20 09:30",
        "thing":"最近雾霾严重，开启新风机组保持正压",
        "area":"FAU-1",
        "class":"紧急",
        "state":"未处理",
        "state1":"持续",
        "people":"张三"
    }
];

//表格数据页面赋值
function tableData(){

    var html = "";

    $(tableArr).each(function(i,o){

        html += "<tr>" +
            "<td>"+ o.time+"</td>"+
            "<td>"+ o.thing+"</td>"+
            "<td>"+ o.area+"</td>"+
            "<td>"+ o.state1+"</td>"+
            "<td>"+ o.people+"</td>"+
            "</tr>";

    });

    $('.bottom-record-table tbody').html(html);
};


//----------------------------------------机房温湿度报警-----------------------//


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
        labelLine: {show:true}
    },
    emphasis : {
        color: 'rgba(0,0,0,0)'
    }
};

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['报警数','未处理数'],
        top:'20',
        show:false
    },
    grid: {
        left: '5%',
        right: '8%',
        top:"8%",
        containLabel: true,
        bottom:'5%'
    },
    toolbox: {
        show : false,
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            show:'true',
            type : 'category',
            data:[]
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    dataZoom: [
        {
            type: 'inside'
        }
    ],
    series : [
        {
            name:'报警数',
            type:'bar',
            data:[],
            itemStyle: {
                normal: {
                    //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: '#31BEA4'
                }
            },
            barMaxWidth: '60'
        },
        {
            name:'未处理数',
            type:'bar',
            data:[],
            itemStyle: {
                normal: {
                    //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: '#4B85E5'
                }
            },
            barMaxWidth: '60'
        }

    ]
};

//左下角折线图
var myChart1 = echarts.init(document.getElementById('bottom-right-echart1'));

var myChart3 = echarts.init(document.getElementById('bottom-right-echart3'));

//页面重绘数据
myChart1.setOption(optionBar,true);

var chartArr = [myChart1,myChart3];

//机房报警数据
var rightBottomDataArr = [
    {
        "name":"送风温度",
        "value1":"3",
        "value2":"2"
    },

    {
        "name":"送风湿度",
        "value1":"4",
        "value2":"3"
    },
    {
        "name":"风压",
        "value1":"5",
        "value2":"3"
    },
    {
        "name":"风机",
        "value1":"3",
        "value2":"1"
    },
    {
        "name":"滤网",
        "value1":"4",
        "value2":"2"
    },
    {
        "name":"加湿",
        "value1":"5",
        "value2":"4"
    },
    {
        "name":"加热",
        "value1":"4",
        "value2":"3"
    }
];

//机房报警echart页面赋值
function bottomRightEchart(){

    var xArr = [];

    var dataArr1 = [];

    var dataArr2 = [];

    $(rightBottomDataArr).each(function(i,o){

        xArr.push(o.name);

        dataArr1.push(o.value1);

        dataArr2.push(o.value2);

    });

    optionBar.xAxis[0].data = xArr;

    optionBar.series[0].data = dataArr1;

    optionBar.series[1].data = dataArr2;


    chartArr[0].setOption(optionBar,true);

    chartArr[1].setOption(optionBar,true);
};











