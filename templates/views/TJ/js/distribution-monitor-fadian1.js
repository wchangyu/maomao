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
            radius: '83%',
            min: 0,
            max:300,
            splitNumber: 10,
            axisTick: {            // 坐标轴小标记
                length: 6,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length:9,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {

                width: 3,
                length:40
            },
            itemStyle:{

                color:'white' //指针颜色
            },
            detail:{

                color:'white', //下方值的颜色
                fontSize:'18',
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
                    width: 4
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
