/**
 * Created by admin on 2018/8/22.
 */
/**
 * Created by admin on 2018/8/22.
 */
$(function(){

    //图片页面加载
    for(var i=0; i<6; i++){

        //获取当前的dom
        var dom = $('.equipment-data .the-choose-show-data').eq(i);

        //获取当前的图片
        var thisImg = 'img/' + dom.attr('data-img') + '.png';

        dom.css({

            'background':'url("'+thisImg+'") no-repeat center 5px'
        });

    };


    //按分钟初始化时间
    _timeComponentsFun1($('.datatimeblock'));

    //历史数据页面赋值
    showEchart();

    //表格数据页面赋值
    tableData();

    //机房报警echart页面赋值
    bottomRightEchart();

    //弹窗表格数据页面赋值
    tableData1();

    //点击鹰眼图
    $('.bpd-navigation .bpd-shade').on('click',function(){

        //获取当前左侧机房的背景图class名
        var imgName = $(this).attr('data-img');

        //获取当前父元素背景图的class名
        var imgName1 = $(this).attr('data-img1');

        if(imgName == 'content-main-right'){

            //表格数据页面赋值
            tableData();

            //echart页面赋值
            showEchart();

        }else{

            //表格数据页面赋值
            tableData1();

            //echart页面赋值
            showEchart1();
        }

        //左侧机房
        $('#right-container #content-main-right').removeClass();

        $('#right-container #content-main-right').addClass('content-main-right');

        $('#right-container #content-main-right').addClass(imgName);

        //右侧鹰眼图
        $(this).parent().removeClass();

        $(this).parent().addClass(' bottom-img-content');

        $(this).parent().addClass(imgName1);

        $('.bottom-img-content .bpd-shade').removeClass('isChoosed');

        $(this).addClass('isChoosed');

        $('.switchover').attr('data-id','1');

        $('.switchover').removeClass('switchover1');
    });

    //流程图上方切换系统图平面图
    $('.switchover').on('click',function(){


        //获取当前id
        var id = $(this).attr('data-id');

        //获取当前导航图信息
        var imgData = $('.bottom-img-content .isChoosed').attr('data-img');

        if(id == 1){


            $(this).addClass('switchover1');

            $(this).attr('data-id','2');

            if(imgData == 'content-main-right'){

                $('#right-container .content-main-right').addClass('content-main-right-pingmian');

            }else {

                $('#right-container .content-main-right').addClass('content-main-right-pingmian1');

            }


        }else{

            $('#right-container .content-main-right').removeClass('content-main-right-pingmian');

            $('#right-container .content-main-right').removeClass('content-main-right-pingmian1');

            $(this).removeClass('switchover1');

            $(this).attr('data-id','1');

        }

    });

    //-----------------------------设备弹窗 病历本功能--------------------------------//

    $('#content-main-right').on('click',function(){

        $('.equipment-data').show();

    });

    $('.equipment-data .close1').on('click',function(){

        $('.equipment-data').hide();
    });

    //点击控制中确定按钮
    $('.right-control .bottom-sure').on('click',function(){


        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'设置成功', '');

    });


    //切换状态
    $('.right-on-off .save-energy').on('click',function(){

        $(this).parent('.right-on-off').find('.save-energy').addClass('save-energy1');

        $(this).removeClass('save-energy1');

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

    //点击知识库
    $('.equipment-data .the-choose-show-data').eq(2).click();


    window.onresize = function () {

        if(myChart ){

            myChart.resize();
        }
    };

});

var dataArr = [
{
    "dataDate": "2018-08-22T00:00",
    "data": 6466.4297
}, {
    "dataDate": "2018-08-22T01:00",
    "data": 6400.0792
}, {
    "dataDate": "2018-08-22T02:00",
    "data": 6345.0767
}, {
    "dataDate": "2018-08-22T03:00",
    "data": 6275.879
}, {
    "dataDate": "2018-08-22T04:00",
    "data": 6570.2213
}, {
    "dataDate": "2018-08-22T05:00",
    "data": 6873.3517
}, {
    "dataDate": "2018-08-22T06:00",
    "data": 6459.3715
}, {
    "dataDate": "2018-08-22T07:00",
    "data": 6020.3592
}, {
    "dataDate": "2018-08-22T08:00",
    "data": 6503.2391
}, {
    "dataDate": "2018-08-22T09:00",
    "data": 6537.2488
}, {
    "dataDate": "2018-08-22T10:00",
    "data": 6911.1791
}, {
    "dataDate": "2018-08-22T11:00",
    "data": 6484.009
}, {
    "dataDate": "2018-08-22T12:00",
    "data": 6270.2891
}, {
    "dataDate": "2018-08-22T13:00",
    "data": 6109.2293
}, {
    "dataDate": "2018-08-22T14:00",
    "data": 6722.6695
}];

var dataArr0 = [
    {
        "dataDate": "2018-08-22T00:00",
        "data": 3166.4297
    }, {
        "dataDate": "2018-08-22T01:00",
        "data": 3200.0792
    }, {
        "dataDate": "2018-08-22T02:00",
        "data": 2945.0767
    }, {
        "dataDate": "2018-08-22T03:00",
        "data": 3075.879
    }, {
        "dataDate": "2018-08-22T04:00",
        "data": 3370.2213
    }, {
        "dataDate": "2018-08-22T05:00",
        "data": 3173.3517
    }, {
        "dataDate": "2018-08-22T06:00",
        "data": 2959.3715
    }, {
        "dataDate": "2018-08-22T07:00",
        "data": 3020.3592
    }, {
        "dataDate": "2018-08-22T08:00",
        "data": 2903.2391
    }, {
        "dataDate": "2018-08-22T09:00",
        "data": 3237.2488
    }, {
        "dataDate": "2018-08-22T10:00",
        "data": 3311.1791
    }, {
        "dataDate": "2018-08-22T11:00",
        "data": 2984.009
    }, {
        "dataDate": "2018-08-22T12:00",
        "data": 3170.2891
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

//页面赋值
function showEchart1(){

    var xArr = [];

    var dataArr1 = [];

    $(dataArr0).each(function(i,o){

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
        "thing":"上游10KV年检，注意观察中控",
        "area":"1#10KV 2#10KV",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"李四"
    }
];

var tableArr1 = [
    {

        "time":"08-20  8:00",
        "thing":"预计9月10日做UPS年度维保",
        "area":"",
        "class":"一般",
        "state":"未处理",
        "state1":"持续",
        "people":"李四"
    },
    {

        "time":"08-20 09:30",
        "thing":"UPS-B2维修完成，待测试后自动运行，严禁操作",
        "area":"UPS-B2",
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
            "<td style='text-align: left!important;text-indent:20px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 150px;cursor: pointer' title='" + o.thing + "'>"+ o.thing+"</td>"+
            "<td>"+ o.area+"</td>"+
            "<td>"+ o.state1+"</td>"+
            "<td>"+ o.people+"</td>"+
            "</tr>";

    });

    $('.bottom-record-table tbody').html(html);
};

function tableData1(){

    var html = "";

    $(tableArr1).each(function(i,o){

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

var myChart5 = echarts.init(document.getElementById('bottom-right-echart5'));

var myChart6 = echarts.init(document.getElementById('bottom-right-echart6'));

//页面重绘数据
myChart1.setOption(_conditioneroption,true);

var chartArr = [myChart1,myChart2,myChart5,myChart3,myChart4,myChart6];

//机房报警数据
var rightBottomDataArr = [
    {
        "name":"总机",
        "value1":"200",
        "value2":"18"
    },

    {
        "name":"电流",
        "value1":"200",
        "value2":"18"
    },
    {
        "name":"频率",
        "value1":"200",
        "value2":"18"
    },
    {
        "name":"总机",
        "value1":"200",
        "value2":"18"
    },
    {
        "name":"电流",
        "value1":"200",
        "value2":"18"
    },
    {
        "name":"频率",
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

//-----------------------------弹窗中知识库数据展示--------------------------//

var tableArr1 = [
    {

        "time":"08-20",
        "thing":"定期检查UPS蓄电池电压",
        "area":"5#风扇启动器损坏，已更换",
        "state":"已完成",
        "people":"李强"
    },
    {

        "time":"08-20",
        "thing":"定期检查更换UPS输入及蓄电池保险丝",
        "area":"断路器掉电，重启",
        "state":"已完成",
        "people":"李强"
    },
    {

        "time":"08-15",
        "thing":"需要保持UPS柜门过滤网的干净",
        "area":"蒸发器清洗",
        "state":"已完成",
        "people":"李强"
    }
];

//弹窗表格数据页面赋值
function tableData1(){

    var html = "";

    $(tableArr1).each(function(i,o){

        html += "<tr>" +
            "<td class='title'>"+ (i+1)+"</td>"+
            "<td>"+ o.thing+"</td>"+
            "<td class='title'>"+ o.time+"</td>"+
            "<td class='title1'>"+ o.people+"</td>"+
            "</tr>";

    });

    $('.bottom-equiptment-table tbody').html(html);
};





