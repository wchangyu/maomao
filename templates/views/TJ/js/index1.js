/**
 * Created by admin on 2018/8/21.
 */

$(function(){

    //左上方介绍的滚动效果
     //scollIntroduce();

    //给实时报警赋值
    alarmData();

    //给系统容量echart赋值
     systemCapacityEchart();

    //给冗余量echart赋值
    redundancyEchart();

    //给工单量echart赋值
     operationEchart();

    $('.bottom-sure').on('click',function(){

        window.location.href = 'shiftingDuty.html';
    });

    //当窗口大小变化时，使图表大小跟着改变

    window.onresize = function () {

        if(_rightMiddleChart1 ){
            _rightMiddleChart1.resize();
            _rightMiddleChart2.resize();
            _rightMiddleChart3.resize();
            _rightMiddleChart4.resize();
            _rightMiddleChart5.resize();
            _rightMiddleChart6.resize();
            _rightMiddleChart7.resize();
            _rightMiddleChart8.resize();
            energyLeftEchart.resize();
            energyRightEchart.resize();
            _gaugeChart.resize();
            _healthChart.resize();

        }
    };

});

//定义定时器
var timer;

var scollHeight = -30;

var scollHeight1 = 0;

//报警数据
var alarmArr = [

    {

        "time":"08-20  8:00",
        "thing":"CRAH01过滤网压差报警",
        "area":"IT机房A",
        "class":"一般",
        "state":"未处理"
    },
    {

        "time":"08-20 09:30",
        "thing":"LEAK06报警",
        "area":"IT机房C",
        "class":"紧急",
        "state":"未处理"
    },
    {

        "time":"08-20 15:02",
        "thing":"CH-1冷凝压力高",
        "area":"制冷站",
        "class":"一般",
        "state":"未处理"
    },
    {

        "time":"08-20 18:15",
        "thing":"SCHP-3变频器过载",
        "area":"制冷站",
        "class":"紧急",
        "state":"未处理"
    },
    {

        "time":"08-20 20:20",
        "thing":"TH44相对湿度高",
        "area":"IT机房D",
        "class":"一般",
        "state":"未处理"
    },
    {

        "time":"08-20 22:05",
        "thing":"电池B12电压低",
        "area":"电池机房B",
        "class":"一般",
        "state":"未处理"
    },
    {

        "time":"08-20 04:06",
        "thing":"UPS-M-3故障报警",
        "area":"变电室A",
        "class":"紧急",
        "state":"未处理"
    },
    {

        "time":"08-20 08:24",
        "thing":"TH22温度高",
        "area":"IT机房C",
        "class":"紧急",
        "state":"未处理"
    },
    {

        "time":"08-20 11:08",
        "thing":"TH23温度高",
        "area":"IT机房C",
        "class":"紧急",
        "state":"未处理"
    },
    {

        "time":"08-20 12:43",
        "thing":"MAU-01过滤网压差报警",
        "area":"新风机房",
        "class":"一般",
        "state":"未处理"
    },
    {

        "time":"08-20 13:10",
        "thing":"TE-1液位低",
        "area":"制冷站",
        "class":"一般",
        "state":"未处理"
    },
    {

        "time":"08-20 22:11",
        "thing":"CH-2排气压力高",
        "area":"制冷站",
        "class":"一般",
        "state":"未处理"
    }
];

//给实时报警赋值
function alarmData(){

    var html = "";

    $(alarmArr).each(function(i,o){

        var color = "blue";

        if(o.class == '紧急'){

            color = 'red';
        }

        html += "<tr>" +
                    "<td>"+ o.time+"</td>"+
                    "<td style='text-align: left!important;text-indent:20px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 150px;cursor: pointer' title='" + o.thing + "'>"+ o.thing+"</td>"+
                    "<td>"+ o.area+"</td>"+
                    "<td class='"+color+"'>"+ o.class+"</td>"+
                    "<td>"+ o.state+"</td>"+
                 "</tr>";

    });

    $('.bottom-table tbody').html(html);

    var tableHeight = $('.scrollbar1').height();

    setTimeout(function(){

        //滚动播放
        timer = setInterval(function(){

            scollHeight++;
            var height = scollHeight * -1;

            if( tableHeight + height <= 30){
                $('.scrollbar1').css({
                    top:'30px'
                });
                scollHeight = -30;
            }else{

                $('.scrollbar1').css({
                    top:height+'px'
                })
            }

        },100)

    },3000);



};

//左上方介绍的滚动效果
function scollIntroduce(){

    var thisHeight = $('.top-introduce-container p').height();

    setTimeout(function(){

        //滚动播放
        var timer = setInterval(function(){

            scollHeight1++;

            var height = (scollHeight1 * -1) / 1;

            if( thisHeight + height <= 10){

                $('.top-introduce-container p').css({
                    top:'0px'
                });
                scollHeight1 = 0;
            }else{

                $('.top-introduce-container p').css({
                    top:height+'px'
                })
            }

        },100)

    },3000);

};

//系统容量echart

// 指定图表的配置项和数据 用于系统容量
var option0 = {
    title: {
        text: '制冷系统(kw)',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        bottom: '10',
        //itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : '#7d8998',
            fontFamily : '微软雅黑',
            fontSize : 14,
            fontWeight : 'normal',
            lineHeight:14
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: " {c} "
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:[],
        textStyle:{
            color:'white'
        },
        show:false

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: '75%',
            center:['50%', '45%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    textStyle : {
                        color:'white',
                        fontSize : '14',
                        fontWeight : 'bold'
                    },
                    formatter: function(params){

                        return params.percent.toFixed(1) + "%"
                    }

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
                            '#31BEA4', '#4B85E5','#cfcf14', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label:{
                        show: true,
                        position: 'inside',
                        textStyle : {
                            color:'black',
                            fontSize : '16',
                            fontWeight : 'bold'
                        },
                        formatter: '{a}:{b}'
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
                    name:'实际容量',
                    value:1300
                },
                {
                    name:'剩余容量',
                    value:1400
                }
            ]
        }
    ]
};

//系统容量echart图
var _rightMiddleChart1 = echarts.init(document.getElementById('right-middle-echart1'));

var _rightMiddleChart2 = echarts.init(document.getElementById('right-middle-echart2'));

var _rightMiddleChart3 = echarts.init(document.getElementById('right-middle-echart3'));

var _rightMiddleChart4 = echarts.init(document.getElementById('right-middle-echart4'));

//系统容量数据
var systemCapacityEcahrtArr = [_rightMiddleChart1,_rightMiddleChart2,_rightMiddleChart3,_rightMiddleChart4];
var systemCapacityArr = [
    {
        'name':'制冷系统(kw)',
        "data":[1300,1400],
        "data1":[24,7,12,1]
    },
    {
        'name':'动力供电(kva)',
        "data":[565,2635],
        "data1":[60,5,55,3]

    },
    {
        'name':'IT供电(kva)',
        "data":[904,3096],
        "data1":[24,7,12,1]

    },
    {
        'name':'IT(u)',
        "data":[10926,8940],
        "data1":[24,7,12,1]

    }
];

//给系统容量echart赋值
function systemCapacityEchart(){

    $(systemCapacityArr).each(function(i,o){

        option0.title.text = o.name;

        option0.series[0].data = o.data;

        systemCapacityEcahrtArr[i].setOption(option0,true);
    })
}

//冗余量echart图
var _rightMiddleChart5 = echarts.init(document.getElementById('right-middle-echart5'));

var _rightMiddleChart6 = echarts.init(document.getElementById('right-middle-echart6'));

// 指定图表的配置项和数据 用于冗余量
var option1 = {
    title: {
        text: '制冷系统(kw)',
        sublink: ' /n 良好',
        left: 'center',
        bottom: '10',
        //itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : '#7d8998',
            fontFamily : '微软雅黑',
            fontSize : 14,
            fontWeight : 'normal',
            lineHeight:14
        },
        subtextStyle:{
            color:'white',
            fontSize : 14
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: " {c} "
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:[],
        textStyle:{
            color:'white'
        },
        show:false

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['50%', '75%'],
            center:['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position:'outside',
                    textStyle : {
                        color:'white',
                        fontSize : '12',
                        fontWeight : 'bold'
                    },
                    padding:[0,-20,15,-25],
                    formatter: function(params){

                        return params.data
                    }
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
                            '#31BEA4','#d89946', '#4B85E5','#f25a72','#cfcf14', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : true
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
                length:'1px',
                length2:'1px',
                lineStyle:{
                  width:1
                },
                normal: {
                    show: true
                }
            },
            data:[
                {
                    name:'运行',
                    value:50
                },
                {
                    name:'故障',
                    value:14
                },
                {
                    name:'备用',
                    value:30
                },
                {
                    name:'停用',
                    value:6
                }
            ]
        }
    ]
};

var redundancyArr = [_rightMiddleChart5,_rightMiddleChart6];


//给冗余量echart赋值
function redundancyEchart(){

    $(redundancyArr).each(function(i,o){


        option1.title.text = systemCapacityArr[i].name;

        option1.series[0].data = systemCapacityArr[i].data1;

        o.setOption(option1,true);

    })
}

//运维统计echart图
var _rightMiddleChart7 = echarts.init(document.getElementById('right-middle-echart7'));

var _rightMiddleChart8 = echarts.init(document.getElementById('right-middle-echart8'));

// 指定图表的配置项和数据 用于运维统计
var option2 = {
    title: {
        text: ' 150 \n 工单量',
        subtext: ' 工单响应',
        left: '48%',
        top: '60',
        itemGap: 38,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 16,
            fontWeight : 'normal',
            lineHeight:17
        },
        subtextStyle:{
            color:'#7d8998',
            fontSize : 14,
            fontWeight : 'normal',
            lineHeight:18
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: " {c} "
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:['已完成','派单中','进行中'],
        textStyle:{
            color:'white'
        }

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['50%', '70%'],
            center:['60%', '40%'],
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
                            '#31BEA4','#d89946', '#4B85E5','#f25a72','#cfcf14', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
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

var operationArr = [_rightMiddleChart7,_rightMiddleChart8];

var operationDataArr = [
    {
        'name':'工单响应'
    },
    {
        'name':'工单分布',
        'data':[
            {
                name:'供配电',
                value:6
            },
            {
                name:'制冷空调',
                value:12
            },
            {
                name:'动环',
                value:3
            },
            {
                name:'其他',
                value:14
            }
        ]

    }
];

//给工单量echart赋值
function operationEchart(){

    $(operationArr).each(function(i,o){


        option2.title.subtext = operationDataArr[i].name;

        if(i == 1){

            option2.series[0].data = operationDataArr[i].data;

            var ledendArr = [];

            $(operationDataArr[i].data).each(function(k,j){

                ledendArr.push(j.name);
            });

            option2.title.text= ' 35 \n 未完成';

            option2.legend.data = ledendArr;
        }

        o.setOption(option2,true);

    })
}

//能耗统计柱状图
var energyLeftEchart = echarts.init(document.getElementById('energy-left-echart'));

// 指定图表的配置项和数据 用于能耗柱状图
var electricOption = {

    tooltip:{
        trigger:'axis',
        axisPointer:{
            type:'shadow'
        },
        formatter:function (params) {
            var tar = params[1];
            var tars = params[0];
            return tar.name + '<br/>' + tar.seriesName + '  ' + tar.value + '<br/>' + tars.seriesName + '  ' + tars.value;
        }
    },
    toolbox:{
        show:false,
        feature:{
            mark:{show:true},
            dataView:{show:true, readOnly:false},
            restore:{show:true},
            saveAsImage:{show:true}
        }
    },
    grid:{
        left:'1%',
        right:'1%',
        bottom:'1%',
        top:"6%",
        borderColor:'#ccc',
        containLabel:true
    },
    xAxis:{
        type:'category',
        //splitLine:{show:false},
        data:[]
    },
    yAxis:{
        type:'value',
        axisLabel: {
            color:'#B0BED0' //刻度线标签颜色
        },
        max:36000
    },
    series:[
        {
            name:'冷机',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#31BEA4'
                },
                emphasis:{
                    barBorderColor:'rgba(0,0,0,0.5)',
                    color:'#afc8de'
                }
            },
            data:[9300,9600,9800,9500,9100,9250,9650],
            barMaxWidth:'30'
        },
        {
            name:'水泵',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#4B85E5'
                },
                emphasis:{
                    barBorderColor:'rgba(0,0,0,0.5)',
                    color:'#9dc541'
                }
            },
            data:[620,640,653,633,607,617,643],
            barMaxWidth:'20',
        },
        {
            name:'精密空调',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#4D7AE1'
                },
                emphasis:{
                    barBorderColor:'rgba(0,0,0,0.5)',
                    color:'#9dc541'
                }
            },
            data:[233,240,245,238,238,231,241],
            barMaxWidth:'20',
        },
        {
            name:'IT',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#8A52E7'
                },
                emphasis:{
                    barBorderColor:'rgba(0,0,0,0.5)',
                    color:'#9dc541'
                }
            },
            data:[16244,16768,17117,16593,15895,16151,16855],
            barMaxWidth:'20',
        },
        {
            name:'其他',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#D944DB'
                },
                emphasis:{
                    barBorderColor:'rgba(0,0,0,0.5)',
                    color:'#9dc541'
                }
            },
            data:[2437,2515,2569,2489,2384,2424,2528],
            barMaxWidth:'20'
        }
    ]
};

energyLeftEchart.setOption(electricOption,true);

//右侧饼图
var dayNightOption = {

    title: {
        text: '用电分项',
        sublink: ' /n 良好',
        left: 'center',
        top: '160',
        //itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : '#7d8998',
            fontFamily : '微软雅黑',
            fontSize : 14,
            fontWeight : 'normal',
            lineHeight:14
        },
        subtextStyle:{
            color:'white',
            fontSize : 14
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend:{
        orient:'vertical',
        left:'left',
        show:false,
        data:['冷机','水泵','精密空调','IT','其他']
    },
    toolbox:{
        show:false,
        feature:{
            mark:{show:true},
            dataView:{show:true, readOnly:false},
            magicType:{
                show:true,
                type:['pie', 'funnel']
            },
            restore:{show:true},
            saveAsImage:{show:true}
        }
    },
    series:[
        {
            name:'',
            type:'pie',
            radius:'68%',
            center:['50%', '50%'],
            data:[
                {value:'66200', name:'冷机'},
                {value:'4413', name:'水泵'},
                {value:'1655', name:'精密空调'},
                {value:'115629', name:'IT'},
                {value:'17344', name:'其他'}
            ],
            label: {
                normal: {
                    show: true,
                    position: 'outside',
                    textStyle : {
                        color:'white',
                        fontSize : '12',
                        fontWeight : 'bold'
                    },
                    padding:[0,-20,15,-25],
                    formatter: function(params){

                        return params.percent.toFixed(1) + "%"
                    }

                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                length:'1px',
                length2:'1px',
                lineStyle:{
                    width:1
                },
                normal: {
                    show: true
                }
            },
            itemStyle:{
                normal:{
                    color:function(params) {

                        var colorList = [
                            '#31BEA4','#4B85E5','#4D7AE1','#8A52E7','#D944DB'
                        ];
                        return colorList[params.dataIndex]
                    },
                    label:{
                        show: false,
                        formatter: '{b} : {c} ({d}%)'
                    }
                },
                emphasis:{
                    shadowBlur:10,
                    shadowOffsetX:0,
                    shadowColor:'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

//能耗统计饼图
var energyRightEchart = echarts.init(document.getElementById('energy-right-echart'));

energyRightEchart.setOption(dayNightOption,true);


//-----------------------------------能效指标---------------------------//
//仪表盘
var _gaugeChart = echarts.init(document.getElementById('gaugeChart'));

//仪表盘参数
var _gaugeOption = {
    tooltip : {
        formatter: "{a} <br/>{c} {b}"
    },
    toolbox: {
        show: false,
        feature: {
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    series : [
        {
            name: 'PUE',
            type: 'gauge',
            z: 3,
            min: 1,
            max: 4,
            splitNumber: 5,
            radius: '95%',
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color:[ [0.2, '#4B85E5'], [0.4, '#21f0ce'],[0.6,'#ecd253'],[4,'#f03992']],

                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                borderRadius: 1,
                color: 'auto',
                padding: 3,
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
                 color:'white'
            },
            detail : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                //formatter: function (value) {
                //    value = (value + '').split('.');
                //    value.length < 2 && (value.push('0'));
                //    return ('0' + value[0]).slice(-2)
                //        + '.' + (value[1] + '0').slice(0, 2);
                //},
                fontWeight: 'bolder',
                fontFamily: 'Arial',
                width: 100,
                fontSize:'18px',
                color: 'white',
                rich: {}
            },
            data:[{value: 1.8, name: 'PUE'}]
        },
        {
            name: 'CLF',
            type: 'gauge',
            center: ['20%', '55%'],    // 默认全局居中
            radius: '65%',
            min:0,
            max:2,
            endAngle:45,
            splitNumber:4,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.27, '#4B85E5'], [0.40, '#21f0ce'], [0.67,'#ecd253'],[4,'#f03992']],
                    width: 8

                }
            },
            axisTick: {            // 坐标轴小标记
                length:12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length:20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width:5
            },
            title: {
                offsetCenter: [0, '-30%'],       // x, y，单位px
                color:'white'
            },
            detail: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize:'18px',
                color: 'white'
            },
            data:[{value: 0.5, name: 'CLF'}]
        },
        {
            name: 'PLF',
            type: 'gauge',
            center: ['80%', '55%'],    // 默认全局居中
            radius: '65%',
            min:0,
            max:0.5,
            startAngle:145,
            splitNumber:5,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.20, '#4B85E5'], [0.40, '#21f0ce'],[0.60,'#ecd253'],[4,'#f03992']],
                    width: 8
                }
            },
            axisTick: {            // 坐标轴小标记
                length:12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length:20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width:5
            },
            title: {
                offsetCenter: [0, '-30%'],       // x, y，单位px
                color:'white'
            },
            detail: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize:'18px',
                color: 'white'
            },
            data:[{value: 0.2, name: 'PLF'}]
        }
    ]
};

//生成
_gaugeChart.setOption(_gaugeOption,true);


//----------------------------------健康诊断雷达图-------------------------//

//雷达图参数
var _healthOption = {
    title: {
        text: '基础雷达图',
        show:false
    },
    tooltip: {},
    legend: {
        data: [],
        show:false
    },
    //grid: { // 控制图的大小，调整下面这些值就可以，
    //    x: 40,
    //    x2: 100,
    //    y2: 150// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
    //},

    radar: {
        // shape: 'circle',
        radius: 52,//设置雷达图大小
        name: {
            textStyle: {
                color: '#fff',
                borderRadius: 3,
                padding: [-2, -5]
            }
        },
        indicator: [
            { name: '动环系统', max: 6},
            { name: '空调末端', max: 6},
            { name: '制冷系统', max: 6},
            { name: '低压设备', max: 6},
            { name: '高压设备', max: 6}
        ]
    },
    series: [{
        name: '雷达图',
        type: 'radar',
        // areaStyle: {normal: {}},
        data : [
            {
                value : [2, 3, 6, 4, 1],
                name : '健康诊断'
            }
        ]
    }]
};

//雷达图
var _healthChart = echarts.init(document.getElementById('healthChart'));

//生成
_healthChart.setOption(_healthOption,true);

