/**
 * Created by admin on 2018/11/6.
 */
/**
 * Created by admin on 2018/11/6.
 */

$(function(){

    drawEchart()

});


// 指定图表的配置项和数据 用于蓄电池信息
var refrigerationChart = echarts.init(document.getElementById('accmulator-echart'));

var refrigerationOption ={
    title: {
        text: '',
        textStyle:{
            fontSize:'14',
            fontWeight:'normal',
            color:'#757575'
        },
        textBaseline:'middle',
        subtext:'',
        subtextStyle:{
            color:'#333'
        },
        x:'center',
        bottom:'8'
    },
    tooltip : {
        formatter: "{a} {b} : {c}"
    },
    series: [
        {
            name: 'RTI',
            type: 'gauge',
            radius: '88%',
            min: 0,
            max:300,
            splitNumber: 6,
            axisTick: {            // 坐标轴小标记
                length: 3,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length:5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {

                width: 3,
                length:30
            },
            itemStyle:{

                color:'white' //指针颜色
            },
            detail:{

                color:'white', //下方值的颜色
                fontSize:'14',
                padding:[30,0,0,0]
            },
            axisLabel: {
                show:true,
                fontSize:'9',
                padding: [0, 0, 0, -4],
                formatter: function (value) {
                    // return value.toFixed(1);
                    return value;
                }
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式

                    color: [[0.2, '#4B85E5'], [0.8, '#31BEA4'], [1, '#E93C94']],
                    width: 2
                }
            },
            data: [
                {
                    value:150,
                    color:'white'
                }
            ]
        }
    ]
};

//页面赋值
refrigerationChart.setOption(refrigerationOption,true);


//echart页面赋值
function drawEchart(){

    //获取echart长度
    var length = $('.bottom-echart-container').length;

    for(var i=0; i<length; i++){

        var echartDom = document.getElementsByClassName('bottom-echart-container')[i];

        var rightTableChart = echarts.init(echartDom);

        //定义随机数组

        rightTableChart.setOption(refrigerationOption,true);

    }
}

// 指定图表的配置项和数据 用于下方功率扇形图
var option0 = {
    title: {
        text: '',
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
            center:['50%', '50%'],
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
                    name:'有功功率',
                    value:600
                },
                {
                    name:'无功容量',
                    value:250
                },
                {
                    name:'空闲',
                    value:150
                }
            ]
        }
    ]
};

var refrigerationChart1 = echarts.init(document.getElementById('bottom-pie'));

var refrigerationChart2 = echarts.init(document.getElementById('bottom-pie1'));

refrigerationChart1.setOption(option0,true);

refrigerationChart2.setOption(option0,true);