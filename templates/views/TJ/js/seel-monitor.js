/**
 * Created by admin on 2018/8/22.
 */
$(function(){

    //时间设置
    _timeYMDComponentsFun($('.datatimeblock'));

    //历史数据页面赋值
    showEchart();

    //表格数据页面赋值
     tableData(tableArr);

    //机房报警echart页面赋值
     bottomRightEchart();

    //温度报警查询表格页面赋值
     tableData1();

    //点击第一个报警统计弹出压差报警弹窗
    $('#bottom-right-echart1').on('click',function(){

        $('#seal-myModal').modal('show');

    });

    //点击压差报警弹窗的确定按钮
    $(' .bottom-sure1').on('click',function(){

        $(this).parents('.alarm-container').modal('hide');

    });

    //点击分派按钮
    $('#seal-myModal .choose-ways-container0 .assign').on('click',function(){

        $('#assign-myModal').modal('show');

    });

    //点击分派中下发按钮
    $('.choose-ways-container2 .issue').on('click',function(){

        $(this).parents('.alarm-container').modal('hide');

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'下发成功', '');

    });

    //点击压差报警按钮
    $('.choose-ways-container0 .defer').on('click',function(){


        $('#delay-myModal').modal('show');


    });

    //点击查看监控按钮
    $('.examine-monitor').on('click',function(){

        window.open('urgency-alarm.html');

    });

    //点击分派中下发按钮
    $('.choose-ways-container3 .issue').on('click',function(){

        $('#delay-myModal').modal('hide');

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'操作成功', '');

    });

    //----------------------------------温度报警----------------------------------//

    //点击第二个报警统计弹出温度报警弹窗
    $('#bottom-right-echart2').on('click',function(){

        $('#seal-myModal1').modal('show');

    });

    //点击分派按钮
    $('#seal-myModal1 .choose-ways-container0 .assign').on('click',function(){

        $('#assign-myModal1').modal('show');

    });

    //点击查询按钮
    $('#seal-myModal1 .choose-ways-container0 .show-data').on('click',function(){

        $('#show-alarm-myModal').modal('show');

    });

    //----------------------------------设备故障报警----------------------------------//

    //点击第二个报警统计弹出温度报警弹窗
    $('#bottom-right-echart3').on('click',function(){

        $('#seal-myModal2').modal('show');

    });

    //点击查询按钮
    $('#seal-myModal2 .choose-ways-container0 .show-data').on('click',function(){

        $('#show-alarm-myModal1').modal('show');

    });

    //----------------------------------切换紧急报警页面----------------------------------//

    //点击第二个报警统计弹出温度报警弹窗
    $('#bottom-right-echart4').on('click',function(){

       window.location.href = "urgency-alarm.html";

    });


    //-----------------------------------右上角导航---------------------------------//
    //点击导航 切换右侧图片
    $('.jifang .the-shade').on('click',function(){

        var numArr = ['A','B','C','D'];

        //获取对应图片
        var imgName = $(this).attr('data-img');

        //左侧机房
        $('#right-container #content-main-right').removeClass();

        $('#right-container #content-main-right').addClass('content-main-right');

        $('#right-container #content-main-right').addClass(imgName);

        $('.left-diagram .left-title1').html('IT机房' + numArr[$(this).data('id') - 1]);

        //表格数据页面赋值
        tableData(totalTtableDataArr[parseInt($(this).data('id')) - 1]);

    });

    //--------------------------左侧流程图-------------------------------------//

    $('#right-container .userMonitor-shade').on('click',function(){

        //获取当前索引
        var index = $(this).index();

        if(index == 0){

            //历史数据页面赋值
            showEchart();

        }else{

            //历史数据页面赋值 两条曲线
            showEchart(true);

        }

    });

    window.onresize = function () {

        if(myChart ){

            myChart.resize();
        }
    };

});

var dataArr = [{
    "dataDate": "2018-08-22T00:00",
    "data": 2966.4297,

}, {
    "dataDate": "2018-08-22T01:00",
    "data": 3100.0792
}, {
    "dataDate": "2018-08-22T02:00",
    "data": 3245.0767
}, {
    "dataDate": "2018-08-22T03:00",
    "data": 2975.879
}, {
    "dataDate": "2018-08-22T04:00",
    "data": 3370.2213
}, {
    "dataDate": "2018-08-22T05:00",
    "data": 3273.3517
}, {
    "dataDate": "2018-08-22T06:00",
    "data": 2959.3715
}, {
    "dataDate": "2018-08-22T07:00",
    "data": 2920.3592
}, {
    "dataDate": "2018-08-22T08:00",
    "data": 3203.2391
}, {
    "dataDate": "2018-08-22T09:00",
    "data": 3037.2488
}, {
    "dataDate": "2018-08-22T10:00",
    "data": 3111.1791
}, {
    "dataDate": "2018-08-22T11:00",
    "data": 3384.009
}, {
    "dataDate": "2018-08-22T12:00",
    "data": 2970.2891
}, {
    "dataDate": "2018-08-22T13:00",
    "data": 3109.2293
}, {
    "dataDate": "2018-08-22T14:00",
    "data": 3222.6695
}];

//左下角折线图
var myChart = echarts.init(document.getElementById('left-bottom-cheart'));

//折线图配置项
var optionLine = {

    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['TH4温度'],
        top:'5',
        left:'20'
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
        top:"16%",
        containLabel: true,
        bottom:"6%"
    },
    series : [

        {
            name:'TH4温度',
            type:'line',
            smooth:true,
            itemStyle : {
                normal : {
                    lineStyle:{
                        color:'#4B85E5'
                    }
                }
            },
            color:['#4B85E5'],
            markPoint : {
                data : [
                    {
                        type : 'max',
                        name: '最大值',
                        itemStyle:{
                            color:'#F25B72'
                        }

                    },
                    {
                        type : 'min',
                        name: '最小值',
                        itemStyle:{
                            color:'#5BDEB6'
                        }
                    }
                ],
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
        },
        {
            name:'CRAH1',
            type:'line',
            smooth:true,
            itemStyle : {
                normal : {
                    lineStyle:{
                        color:'red'
                    }
                }
            },
            color:['red'],
            markPoint : {
                data : [
                    {
                        type : 'max',
                        name: '最大值',
                        itemStyle:{
                            color:'#F25B72'
                        }

                    },
                    {
                        type : 'min',
                        name: '最小值',
                        itemStyle:{
                            color:'#5BDEB6'
                        }
                    }
                ],
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

//历史数据页面赋值
function showEchart(ifTwoLine){

    var xArr = [];

    var dataArr1 = [];

    var dataArr2 = [];

    $(dataArr).each(function(i,o){

        xArr.push(o.dataDate.split('T')[1]);

        dataArr1.push((o.data / 100) .toFixed(1));

        dataArr2.push((o.data / 1000 * 8).toFixed(1));
    });

    optionLine.xAxis[0].data = xArr;

    optionLine.series[0].data = dataArr1;

    if(ifTwoLine){

        optionLine.legend.data = ['TH4温度','CRAH1'];

        optionLine.series[1].data = dataArr2;

    }else{

        optionLine.legend.data = ['TH4温度'];

        optionLine.series[1].data = [];
    }

    //页面重绘数据
    myChart.setOption(optionLine,true);
};

//-----------------------------------交接班记录--------------------------------//

var tableArr = [
    {

        "time":"08-20 22:05",
        "thing":"IT机房A 冷通道TH4多次短暂报警，原因未知",
        "area":"TH1",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"张三"
    },
    {

        "time":"08-21 10:05",
        "thing":"IT机房A 8.25下午15:00安排外修公司进入IT机房A维修RPP-1",
        "area":"RPP-1",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"张三"
    }

];

var tableArr1 = [
    {

        "time":"08-20 22:05",
        "thing":"IT机房B增加机柜3个",
        "area":"",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"张三"
    }

];

var tableArr2 = [
    {

        "time":"08-21 20:05",
        "thing":"下午外修公司进入机房进行网络测试",
        "area":"",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"张三"
    }

];

var tableArr3 = [
    {

        "time":"08-23 12:05",
        "thing":"漏水绳报警，CRAH18冷凝水溢出，临时处理，注意观察",
        "area":"CRAH18",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"张三"
    },
    {

        "time":"08-24 10:05",
        "thing":"外修30日下午13:00进入维修ATS",
        "area":"ATS",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"李四"
    }

];



//---------------------------------温度报警查询弹窗数据----------------------//

var temperatureArr = [
    {

        "time":"当前",
        "content":"温度高",
        "class":"红色",
        "state":'未处理',
        "dispose":"诊断: 1，IT机房D平均温度正常 <br/>2，制冷系统无报警 <br/>建议: 1，重启CRAH14",
        "people":""
    },
    {

        "time":"08-20  8:00",
        "content":"温度高",
        "class":"红色",
        "state":'未处理',
        "dispose":"CRAH14跳闸，重启",
        "people":"张三"
    },
    {

        "time":"08-20 09:30",
        "content":"温度高",
        "class":"黄色",
        "state":'已处理',
        "dispose":"CRAH14跳闸，重启",
        "people":"李四"
    },
    {

        "time":"08-20 15:02",
        "content":"温度高",
        "class":"黄色",
        "state":'已处理',
        "dispose":"冷水电动阀卡死",
        "people":"张三"
    },
    {

        "time":"08-20 18:15",
        "content":"温度高",
        "class":"黄色",
        "state":'已处理',
        "dispose":"冷水电动阀卡死",
        "people":"张三"
    },
    {

        "time":"08-20 20:20",
        "content":"温度高",
        "class":"黄色",
        "state":'已处理',
        "dispose":"冷水电动阀卡死",
        "people":"张三"
    },
    {

        "time":"08-20 22:05",
        "content":"温度高",
        "class":"黄色",
        "state":'已处理',
        "dispose":"冷水电动阀卡死",
        "people":"张三"
    }
];

var totalTtableDataArr = [tableArr,tableArr1,tableArr2,tableArr3];


//表格数据页面赋值
function tableData(tableArr){

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


//温度报警查询表格页面赋值
function tableData1(){

    var html = "";

    $(temperatureArr).each(function(i,o){

        html += "<tr>" +
            "<td>"+ o.time+"</td>"+
            "<td>"+ o.content+"</td>"+
            "<td>"+ o.class+"</td>"+
            "<td>"+ o.state+"</td>"+
            "<td>"+ o.dispose+"</td>";

            if(o.people == ""){

                html +=   "<td><span class='examine-monitor'>查看监控</span></td>";

            }else{

                html +=   "<td>"+ o.people+"</td>";

            }

            html +=  "</tr>";
    });

    $('#show-alarm-myModal .bottom-temperature-table tbody').html(html);

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

var _conditioneroption = {

    title: {
        text: '温度',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '95',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : '#3E3E3E',
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
        right : 85,
        y : 10,
        itemGap:2,
        data:['运行中','故障中','维修中'],
        show:false,
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
                    value:200,
                    name:'报警数',
                    itemStyle: {
                        normal : {
                            color: '#5BDEB6',
                            label: {show:false}
                        }
                    }

                },
                {
                    value:100,
                    name:'68kW',
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
                    value:18,
                    name:'未处理数',
                    itemStyle: {
                        normal : {
                            color: '#4B85E5',
                            label: {show:false}
                        }
                    }
                },
                {
                    value:282,
                    name:'29kW',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//左下角折线图
var myChart1 = echarts.init(document.getElementById('bottom-right-echart1'));

var myChart2 = echarts.init(document.getElementById('bottom-right-echart2'));

var myChart3 = echarts.init(document.getElementById('bottom-right-echart3'));

var myChart4 = echarts.init(document.getElementById('bottom-right-echart4'));

//页面重绘数据
myChart1.setOption(_conditioneroption,true);

var chartArr = [myChart1,myChart2,myChart3,myChart4];

//机房报警数据
var rightBottomDataArr = [

    {
        "name":"温度",
        "value1":"200",
        "value2":"18"
    },
    {
        "name":"湿度",
        "value1":"200",
        "value2":"18"
    },
    {
        "name":"温度",
        "value1":"200",
        "value2":"18"
    },
    {
        "name":"湿度",
        "value1":"200",
        "value2":"18"
    }
];

//机房报警echart页面赋值
function bottomRightEchart(){

    $(rightBottomDataArr).each(function(i,o){

        _conditioneroption.title.text = o.name;

        _conditioneroption.series[0].data[0].value = o.value1;

        _conditioneroption.series[0].data[1].value =  (300 - o.value1);

        _conditioneroption.series[1].data[0].value = o.value2;

        _conditioneroption.series[1].data[1].value = (300 - o.value2);

        chartArr[i].setOption(_conditioneroption,true);

    });

};






