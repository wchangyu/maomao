/**
 * Created by admin on 2018/8/23.
 */

$(function(){

    //弹窗中页面图片加载
    for(var i=0; i<6; i++){

        //获取当前的dom
        var dom = $('.equipment-data .the-choose-show-data').eq(i);

        //获取当前的图片
        var thisImg = 'img/' + dom.attr('data-img') + '.png';

        dom.css({

            'background':'url("'+thisImg+'") no-repeat center 5px'
        });

    };

    //初始化日期
    _timeComponentsFun1($('.datatimeblock'));

    //历史数据页面赋值
    showEchart();

    //表格数据页面赋值
    tableData();

    //弹窗中表格数据页面赋值
     tableData1();

    //机房报警echart页面赋值
    bottomRightEchart();

    //lcc经济分析页面赋值
     economicsChartData();


    //点击交接班记录新增按钮
    $('.right-work-record .right-white').on('click',function(){

        $('#coldStation-myModal').modal('show');

    });

    //点击交接班中添加按钮
    $('#coldStation-myModal .confirm').on('click',function(){

        var time = moment($('#coldStation-myModal .min').val()).format('MM-DD HH:mm');

        var people = $('#coldStation-myModal .operation-people').val();

        var equipment = $('#coldStation-myModal .equipment').val();

        var state = $('#coldStation-myModal .state').val();

        var things = $('#coldStation-myModal .things').val();


        //存放数据
        var obj = {

            "time":time,

            "people":people,

            "area":equipment,

            "state1":state,

            "thing":things
        };

        tableArr.unshift(obj);

        //页面赋值
        tableData();

        $('#coldStation-myModal').modal('hide');

    });

    //点击控制中确定按钮
    $('.right-control .bottom-sure').on('click',function(){


        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'设置成功', '');

    });

    //点击上方流程图弹出设备信息窗口
    $('#content-main-right').on('click',function(){

        $('.equipment-data').show();

    });

    $('.equipment-data .close1').on('click',function(){

        $('.equipment-data').hide();
    });

    //切换状态
    $('.right-on-off .save-energy').on('click',function(){

        $(this).parent('.right-on-off').find('.save-energy').addClass('save-energy1');

        $(this).removeClass('save-energy1');

    });

    //切换下方展示内容
    $('.the-choose-show-data-container .switch').on('click',function(){

        //获取当前id
        var thisIndex = $(this).attr('data-id');

        if(thisIndex == 1){

            $('.right-equipment-data .bottom-equiptment-table').show();

            $('.right-equipment-data .bottom-equip-chart').hide();

        }else if(thisIndex == 2){

            $('.right-equipment-data .bottom-equiptment-table').hide();

            $('.right-equipment-data .bottom-equip-chart').show();
        }

    });

    //弹窗中全生命周期
    $('.equipment-data .the-choose-show-data').on('click',function(){

        //判断当前类型
        var type = $(this).attr('data-type');

        if(type == 0){

            return false;
        }

        $('.equipment-data .the-choose-show-data').removeClass('onChoose');

        $(this).addClass('onChoose');

        for(var i=0; i<6; i++){

            //获取当前的dom
            var dom = $('.equipment-data .the-choose-show-data').eq(i);

            //获取当前的图片
            var thisImg = 'img/' + dom.attr('data-img') + '.png';

            dom.css({

                'background':'url("'+thisImg+'") no-repeat center 5px'
            });

        }

        var dom1 = $(this);

        if(type == 1){

            //获取当前的图片
             thisImg = 'img/' + dom1.attr('data-img1') + '.png';

        }

        dom1.css({

            'background':'url("'+thisImg+'") no-repeat center 5px'
        });

    });

    //点击维保记录
    $('.equipment-data .the-choose-show-data').eq(1).click();


    window.onresize = function () {

        if(myChart1 ){

            myChart.resize();

            myChart1.resize();

            myChart3.resize();

            pieChart1.resize();

            pieChart2.resize();

        }
    };

});

var dataArr = [
    {
    "dataDate": "2018-08-22T00:00",
    "data": 1266.4297
}, {
    "dataDate": "2018-08-22T01:00",
    "data": 1000.0792
}, {
    "dataDate": "2018-08-22T02:00",
    "data": 1145.0767
}, {
    "dataDate": "2018-08-22T03:00",
    "data": 1275.879
}, {
    "dataDate": "2018-08-22T04:00",
    "data": 1270.2213
}, {
    "dataDate": "2018-08-22T05:00",
    "data": 1273.3517
}, {
    "dataDate": "2018-08-22T06:00",
    "data": 1059.3715
}, {
    "dataDate": "2018-08-22T07:00",
    "data": 1020.3592
}, {
    "dataDate": "2018-08-22T08:00",
    "data": 1203.2391
}, {
    "dataDate": "2018-08-22T09:00",
    "data": 1337.2488
}, {
    "dataDate": "2018-08-22T10:00",
    "data": 1111.1791
}, {
    "dataDate": "2018-08-22T11:00",
    "data": 1084.009
}, {
    "dataDate": "2018-08-22T12:00",
    "data": 1270.2891
}, {
    "dataDate": "2018-08-22T13:00",
    "data": 1009.2293
}, {
    "dataDate": "2018-08-22T14:00",
    "data": 1222.6695
}
];

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
                    //normal:{
                    //    color:'#019cdf'
                    //}
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
        "thing":"3#冷机流量开关故障，如需要运行，可以将流量开关短路",
        "area":"3#冷机",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"李四"
    },
    {

        "time":"08-20 09:30",
        "thing":"3#二次泵b3漏水，无报警，待修，禁止启动",
        "area":"b3水泵",
        "class":"紧急",
        "state":"未处理",
        "state1":"持续",
        "people":"李四"
    }
];

//表格数据页面赋值
function tableData(){

    var html = "";

    $(tableArr).each(function(i,o){

        html += "<tr>" +
            "<td>"+ o.time+"</td>"+
            "<td style='text-align: left!important;text-indent:20px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 150px;cursor: pointer' title='" + o.thing + "'>"+ o.thing+"</td>"+
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
        "name":"冷机",
        "value1":"3",
        "value2":"2"
    },

    {
        "name":"冷冻泵",
        "value1":"4",
        "value2":"3"
    },
    {
        "name":"冷却泵",
        "value1":"5",
        "value2":"3"
    },
    {
        "name":"冷却塔",
        "value1":"3",
        "value2":"1"
    },
    {
        "name":"补水泵",
        "value1":"4",
        "value2":"2"
    },
    {
        "name":"定压罐",
        "value1":"5",
        "value2":"4"
    },
    {
        "name":"水系统",
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

//--------------------------------------冷站实时能效--------------------------------//
// 指定图表的配置项和数据 用于冷站实时能效
var option2 =  {

    tooltip : {
        formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
        show:false,
        feature: {
            restore: {},
            saveAsImage: {}
        }
    },
    series: [
        {
            name: '冷站能效(EER)',
            type: 'gauge',
            min: 2.6,
            max: 8,
            splitNumber: 5,
            radius: '95%',
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color:[ [0.16, '#c13c33'], [0.27, '#ecd253'],[0.44,'#64849d'],[8,'#8ec6ad']],

                    width: 6
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                borderRadius: 1,
                color: 'auto',
                formatter: function (value) {
                    return value.toFixed(1);
                    //return value;
                },
                padding: 3,
            },

            detail: {formatter:'{value}'},
            data: [{value: 3.3, name: '\n\n\n\n\n\n\n\n\n\n\n\n冷站能效(EER)'}]
        }
    ]
};

var pieChart1 = echarts.init(document.getElementById('pie-chart1'));

var pieChart2 = echarts.init(document.getElementById('pie-chart2'));

//页面重绘数据
pieChart1.setOption(option2,true);

var option3 =  {

    tooltip : {
        formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
        show:false,
        feature: {
            restore: {},
            saveAsImage: {}
        }
    },
    series: [
        {
            name: '冷机效率(COP)',
            type: 'gauge',
            min: 3.6,
            max: 8.5,
            splitNumber: 5,
            radius: '95%',
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color:[ [0.18, '#c13c33'], [0.32, '#ecd253'],[0.49,'#64849d'],[8.5,'#8ec6ad']],

                    width: 6
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                borderRadius: 1,
                color: 'auto',
                formatter: function (value) {
                    return value.toFixed(1);
                    //return value;
                },
                padding: 3,
            },

            detail: {formatter:'{value}'},
            data: [{value: 4.2, name: '\n\n\n\n\n\n\n\n\n\n\n\n冷机能效(COP)'}]
        }
    ]
};

option3.series[0].data[0].name = '\n\n\n\n\n\n\n\n\n\n\n\n冷机效率(COP)';

//页面重绘数据
pieChart2.setOption(option3,true);


//-----------------------------维保记录数据展示--------------------------//

var tableArr1 = [
    {

        "time":"08-20",
        "thing":"2#冷机冷凝压力高",
        "area":"5#风扇启动器损坏，已更换",
        "state":"已完成",
        "people":"张三"
    },
    {

        "time":"07-20",
        "thing":"1#冷机出水温度无法启动",
        "area":"断路器掉电，重启",
        "state":"已完成",
        "people":"李四"
    },
    {

        "time":"05-15",
        "thing":"维保",
        "area":"蒸发器清洗",
        "state":"已完成",
        "people":"外修"
    },
    {
        "time":"04-11",
        "thing":"控制屏黑屏，机组运行",
        "area":"控制器接线松动，插紧，清灰，重启",
        "state":"已完成",
        "people":"王五"
    }
];

//表格数据页面赋值
function tableData1(){

    var html = "";

    $(tableArr1).each(function(i,o){

        html += "<tr>" +
            "<td class='title'>"+ o.time+"</td>"+
            "<td>"+ o.thing+"</td>"+
            "<td>"+ o.area+"</td>"+
            "<td class='title1'>"+ o.state+"</td>"+
            "<td class='title1'>"+ o.people+"</td>"+
            "</tr>";

    });

    $('.bottom-equiptment-table tbody').html(html);
};


//---------------------------------弹窗中的经济分析--------------------------//

//柱状图配置项
var optionBar1 = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['报警数','未处理数'],
        top:'1',
        textStyle: {
            color: '#fff'
        },
        show:true
    },
    grid: {
        left: '2%',
        right: '2%',
        top:"14%",
        containLabel: true,
        bottom:'1%'
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
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
            data:[]
        }
    ],
    yAxis : [
        {
            type : 'value',
            name:'单位:(万元)',
            nameTextStyle:{
                color:'white'
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            }
        }
    ],
    dataZoom: [
        {
            type: 'inside'
        }
    ],
    series : [

    ]
};

var barObj =   {
    name:'报警数',
    type:'bar',
    data:[],
    itemStyle: {
        normal: {
            //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
            color: '#31BEA4'
        }
    },
    markLine:{

        data : [
            [ {name: '',  x: 30, y: 150},

                {name: '', x: 500, y: 150}]

        ]

    },
    barMaxWidth: '60'
};

var economicsChart = echarts.init(document.getElementById('economics-chart'));

var economicsDataArr = [

    {
        "name":"月采购成本",
        "data":[0.5,1.2,1.1,0.9,1.2,1.1,1.0,0.8]
    },
    {
        "name":"能效惩罚",
        "data":[0.2,0.6,0.8,0.9,1.2,1.8,2.0,2.8]
    },
    {
        "name":"维修成本",
        "data":[0,0,0,0,3.5,1.1,0.8,1.0]
    },
    {
        "name":"能耗成本",
        "data":[16,17,18,19,20,22,25,25]
    },
];

var economicsXArr = ['18-01','18-02','18-03','18-04','18-05','18-06','18-07','18-08'];

//lcc经济分析页面赋值
function economicsChartData(){

    var colorArr = ['#D944DB','#8A52E7','#4D7AE1','#31BEA4'];

    //存放图例
    var legendArr = [];

    $(economicsDataArr).each(function(i,o){

        var thisObj = {};

        //运用深拷贝方法
        deepCopy(barObj,thisObj);

        legendArr.push(o.name);

        thisObj.name = o.name;

        thisObj.data = o.data;

        thisObj.itemStyle.normal.color = colorArr[i];

        optionBar1.series[i] = thisObj;

    });

    console.log(optionBar1);

    optionBar1.xAxis[0].data = economicsXArr;

    optionBar1.legend.data = legendArr;

    economicsChart.setOption(optionBar1,true);
}






