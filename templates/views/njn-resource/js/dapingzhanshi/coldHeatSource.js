/**
 * Created by admin on 2018/1/17.
 */

$(function(){

    //切换能耗曲线的选项卡
    $('.consumption-container span').on('click',function(){

        $(this).parent().children().removeClass('onClick');

        $(this).addClass('onClick');
    });

    //切换冷热站
    $('.right-bottom-container1 .right-bottom-tab-container span').on('click',function(){

        //获取当前点击的元素的index
        var index = $(this).index();

        //冷站
        if(index < 2){

            $('.right-bottom-container1 .right-bottom-content').eq(0).show();

            $('.right-bottom-container1 .right-bottom-content').eq(1).hide();

        }else{

            $('.right-bottom-container1 .right-bottom-content').eq(0).hide();

            $('.right-bottom-container1 .right-bottom-content').eq(1).show();

        }
    });

});


////配置流程图页面中的区域位置
//var monitorAreaArr = [
//    {
//        "areaName":"东冷站",
//        "areaId":"123"
//    },
//    {
//        "areaName":"西冷站",
//        "areaId":"62"
//    }
//];
////把区域信息放入到流程图页面中
//sessionStorage.monitorArea = JSON.stringify(monitorAreaArr);

//负荷率
// 指定图表的配置项和数据
var option = {
    title:{
        text: '30%',
        textStyle:{
            fontSize:'20',
            fontWeight:'bold',
            color:'#2170F4'
        },
        textBaseline:'middle',
        x:'center',
        bottom:'30%'
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
            name:'负荷率',
            type:'pie',
            radius: ['70%', '80%'],
            center:['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
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
                            '#2170F4','#e2e2e2'
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
            data:[30,70]
        }
    ]
};

var _myChart1 =  echarts.init(document.getElementById('bottom-content-chart'));

var _myChart2=  echarts.init(document.getElementById('bottom-content-chart1'));

_myChart1.setOption( option,true);

_myChart2.setOption( option,true);

//换热效率
// 指定图表的配置项和数据
var option1 = {
    title: {

        textStyle:{
            fontSize:'15',
            fontWeight:'normal'
        },
        textBaseline:'middle',

        subtextStyle:{
            color:'#333'
        },
        x:'center',
        bottom:'8'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前能耗',
            type: 'gauge',
            radius: '90%',
            center:['22%', '60%'],
            min: 0,
            max:3,
            splitNumber: 15,
            splitLine: {           // 分隔线
                length: 9,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width:5,
                z: 10
            },
            axisTick: {            // 坐标轴小标记
                splitNumber: 5,
                length: 7,        // 属性length控制线长
                lineStyle: {        // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
              fontSize:8
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 12,
                fontStyle: 'italic',
                color:'#666',
                z: 1,
                offsetCenter:[0, '75%']
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#2170F4'], [0.26, '#14E398'], [0.32, '#EAD01E'],[1, '#F8276C']],
                    width: 5
                }
            },
            data: [{value:1.2,name:'KW/RT'}]
        }
    ]
};

var _myChart2 =  echarts.init(document.getElementById('bottom-efficiency-chart'));

var _myChart3 =  echarts.init(document.getElementById('bottom-efficiency-chart1'));

_myChart2.setOption( option1,true);

_myChart3.setOption( option1,true);


//冷站中的仪表盘
var _refrigeratorChart1 =  echarts.init(document.getElementById('bottom-refrigerator-chart'));

var _refrigeratorChart2 =  echarts.init(document.getElementById('bottom-refrigerator-chart1'));

var _refrigeratorChart3 =  echarts.init(document.getElementById('bottom-refrigerator-chart2'));

_refrigeratorChart1.setOption( option1,true);

_refrigeratorChart2.setOption( option1,true);

_refrigeratorChart3.setOption( option1,true);


//能耗曲线
var option2 = {

    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['冷量','冷机']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        },
        show:false
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine:{
            lineStyle:{
                color:'#999'
            }
        },
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value',
        axisLine:{
            lineStyle:{
                color:'#999'
            }
        }
    },
    series: [
        {
            name:'冷量',
            type:'line',
            stack: '总量',
            itemStyle:{
                normal:{
                    color:'#2170F4'

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2170F4'
                    }, {
                        offset: 1,
                        color: '#fff'
                    }])
                }
            },
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'冷机',
            type:'line',
            stack: '总量',
            itemStyle:{
                normal:{
                    color:'#F8276C'

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#F8276C'
                    }, {
                        offset: 1,
                        color: '#fff'
                    }])
                }
            },
            data:[220, 182, 191, 234, 290, 330, 310]
        }
    ]
};

var _myChart4 = echarts.init(document.getElementById('consumotion-echart'));

_myChart4.setOption( option2,true);

//冷机中能耗曲线
var _consumotionChart = echarts.init(document.getElementById('consumotion-echart0'));

_consumotionChart.setOption( option2,true);

//供热温度曲线
var _myChart5 = echarts.init(document.getElementById('temperature-echart'));

_myChart5.setOption( option2,true);


//点击不同区域获取不同的设备列表
$('#monitor-menu-container').on('click','span',function(){

    //获取当前的区域ID
    var areaID = $(this).attr('data-district');

    //定义当前的设备类型
    var devTypeID = 1;

    //获取当前的设备列表
    getSecondColdHotSour('NJNDeviceShow/GetSecondColdHotSour', devTypeID, areaID);

});






