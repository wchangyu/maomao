/**
 * Created by admin on 2017/7/17.
 */
//实时能耗
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

//能耗构成
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


//面积指标
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

// 指定图表的配置项和数据
option3 = {
    title: {
        text: '单\n位\n面\n积\n电\n耗',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前电耗',
            type: 'gauge',
            radius: '100%',
            min: 0,
            max: 30,
            splitNumber: 5,
            data: [{value: 6, name: 'kWh/㎡'}]
        }
    ]
};

var myChart31 = echarts.init(document.getElementById('energy-demand31'));

// 指定图表的配置项和数据
option31 = {
    title: {
        text: '单\n位\n面\n积\n水\n耗',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前水耗',
            type: 'gauge',
            radius: '100%',
            min: 0,
            max: 30,
            splitNumber: 5,
            data: [{value: 18, name: 'L/㎡'}]
        }
    ]
};

var myChart32 = echarts.init(document.getElementById('energy-demand32'));

// 指定图表的配置项和数据
option32 = {
    title: {
        text: '单\n位\n面\n积\n耗\n冷',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前冷耗',
            type: 'gauge',
            radius: '100%',
            min: 0,
            max: 30,
            splitNumber: 5,
            data: [{value: 0, name: 'MJ/㎡'}]
        }
    ]
};

var myChart33 = echarts.init(document.getElementById('energy-demand33'));

// 指定图表的配置项和数据
option33 = {
    title: {
        text: '单\n位\n面\n积\n耗\n热',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前耗冷',
            type: 'gauge',
            radius: '100%',
            min: 0,
            max: 30,
            splitNumber: 5,
            data: [{value: 0, name: 'MJ/㎡'}]
        }
    ]
};

//用能排名部分
var myChart4 = echarts.init(document.getElementById('energy-demand4'));

// 指定图表的配置项和数据
option4 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: 0,
        bottom: 20,
        right:20,
        left:100
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['灼伤大楼','转化医学研究院','儿童住院部','门诊和急诊','外科楼','内科楼']
    },
    series: [
        {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
        }
    ]
};

var myChart41 = echarts.init(document.getElementById('energy-demand41'));

// 指定图表的配置项和数据
option41 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: 10,
        bottom: 20,
        right:20,
        left:100
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['灼伤大楼','转化医学研究院','儿童住院部','门诊和急诊','外科楼','内科楼']
    },
    series: [
        {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
        }
    ]
};


//当窗口大小变化时，使图表大小跟着改变

window.onresize = function () {
    if(myChart ){
        myChart.resize();
        myChart1.resize();
        myChart2.resize();
        myChart3.resize();
    }
};

//初始化配置
myChart.setOption(option);
myChart1.setOption(option1);
myChart2.setOption(option2);
myChart3.setOption(option3);
myChart31.setOption(option31);
myChart32.setOption(option32);
myChart33.setOption(option33);
myChart33.setOption(option33);
myChart4.setOption(option4);
myChart41.setOption(option41);

$('.top-cut li a').on('click',function(){

    $(this).parents('ul').find('a').removeClass('onClicks');
    $(this).addClass('onClicks');
});

$('.top-choose-energy a').on('click',function(){

    $(this).parent('.top-choose-energy').find('a').removeClass('onClicks');
    $(this).addClass('onClicks');
});




getEnergyPanking();

//获取后台能耗排名数据

function getEnergyPanking(){

    //能耗分项ID
    var energyItemCode = getUnitID(100);

    var pointerIdArr = getPointersId();

    $.ajax({
        type: 'post',
        url: IP + "/EnergyItemDatas/GetTopPointerEcs",
        timeout: theTimes,
        data:{
            "startTime": "2017-07-24",
            "endTime": "2017-07-25",
            "itemCount": 6,
            "energyItemCode": energyItemCode,
            "pointerIDs": pointerIdArr
        },
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
}