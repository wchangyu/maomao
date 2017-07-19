/**
 * Created by admin on 2017/7/17.
 */
var myChart = echarts.init(document.getElementById('energy-demand'));

// 指定图表的配置项和数据
option = {

    tooltip : {
        trigger: 'axis'
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} °C'
            }
        }
    ],
    series : [
        {
            name:'最高气温',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            //itemStyle : {
            //    normal : {
            //        color:'#53f4db',
            //        lineStyle:{
            //            color:'#53f4db',
            //            width:3
            //        }
            //    }
            //},
            smooth:true,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
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
            }
        }
    ]
};

var myChart1 = echarts.init(document.getElementById('energy-demand1'));

// 指定图表的配置项和数据
option1 = {
    title: {
        text: '总能耗 单位：吨标煤',
        textStyle: {
            fontSize: '14'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['20%', '80%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        fontSize: '12'
                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};

var myChart2 = echarts.init(document.getElementById('energy-demand2'));

// 指定图表的配置项和数据
option2 = {
    title: {
        text: '总能耗 单位：吨标煤',
        textStyle: {
            fontSize: '14'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['20%', '80%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        fontSize: '12'
                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};

var myChart3 = echarts.init(document.getElementById('energy-demand3'));
//
option3 = {
    tooltip : {
        formatter: "{a} <br/>{b} : {c}%"
    },
    series: [
        {
            name: '业务指标',
            type: 'gauge',
            radius: '100%',
            endAngle:'-134.999',
            data: [{value: 30, name: '完成率'}]
        }
    ]
};





window.onresize = function () {
    if(myChart ){
        myChart.resize();
        myChart1.resize();
        myChart2.resize();
        myChart3.resize();
    }
};

myChart.setOption(option);
myChart1.setOption(option1);
myChart2.setOption(option2);
myChart3.setOption(option3);

$('.top-cut li a').on('click',function(){

    $(this).parents('ul').find('a').removeClass('onClicks');
    $(this).addClass('onClicks');
});