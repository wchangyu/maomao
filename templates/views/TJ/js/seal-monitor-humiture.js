/**
 * Created by admin on 2018/10/21.
 */
$(function(){

    //页面绘制空间容量
    drawSpaceData();

    //点击切换机房
    $('.top-title .userMonitor-name').on('click',function(){

        $('.top-title .userMonitor-name').removeClass('onChoose');

        $(this).addClass('onChoose');



    });

    //流程图上方切换系统图平面图
    $('.switchover').on('click',function(){

        //获取当前id
        var id = $(this).attr('data-id');


        if(id == 1){

            $(this).addClass('switchover1');

            $(this).attr('data-id','2');


        }else{


            $(this).removeClass('switchover1');

            $(this).attr('data-id','1');

        }

    });

    //切换左上角冷站或者空调时
    $('.left-title1 .userMonitor-name').on('click',function(){


        //获取当前流程图ID
        var userMonitorID = $(this).attr('data-monitor');

        sessionStorage.menuArg = '1,' + userMonitorID;

        //获取对应流程图
        userMonitor.init(false,false,1,$('.left-diagram'));

    });


    //当窗口大小变化时，使图表大小跟着改变

    window.onresize = function () {

        if( electricChart){

            electricChart.resize();
            electricChart1.resize();
            refrigerationChart.resize();
        }
    };

});

//-----------------------------------空间容量-------------------------------------//

//定义名称数组
var spaceNameArr = ['L','R'];

//定义数组长度
var spaceDataLength = 12;

//定义初始温湿度
var temperatureNum = 28;

var humidityNum = 60;

//页面绘制空间容量
function drawSpaceData(){

    //定义存放页面中的字符串
    var dataHtml = '';

    for(var i=0; i<spaceDataLength; i++){


        $(spaceNameArr).each(function(k,o){

            //随机一个当前温度
            var temperatureRandom = (randomNum(5) + temperatureNum).toFixed(1);

            //随机一个当前湿度
            var humidityRandom = (randomNum(10) + humidityNum).toFixed(1);

            //判断是否超标的标识
            var temperatureOverproof = '';

            var humidityOverproof = '';

            //判断温度是否超标
            if(temperatureRandom > 32 || temperatureRandom < 24){

                temperatureOverproof = 'overProof'
            }

            //判断湿度是否超标
            if(humidityRandom > 66 || humidityRandom < 54){

                humidityOverproof = 'overProof'
            }

            //随机名称
            var name = o + i + '通道';

            dataHtml +=   '<div class="data-container">' +

                            '<span class="name">'+name+'</span>' +
                            '<span class="temperature '+temperatureOverproof+'"> <font>'+temperatureRandom+'℃</font></span>' +
                            '<span class="humidity '+temperatureOverproof+'"> <font>'+humidityRandom+'%</font></span>' +

                         '</div>';


        });

    }

    //页面赋值
    $('.right-navigation .bottom-data-container ').html(dataHtml);

}

//生成一个几以内的随机数 figure为几就是几以内
function randomNum(figure){

    //随机正负值
    var plusMinus = 1;

    if(Math.random() > 0.5){

        plusMinus = -1;
    }

    //生成随机数
    var randomNum = (Math.random() * figure * plusMinus).toFixed(1);

    randomNum = parseFloat(randomNum);

    return randomNum;

}




//-----------------------------------电力容量-------------------------------------//

var electricChart = echarts.init(document.getElementById('electric-capacity-echart'));

var electricChart1 = echarts.init(document.getElementById('electric-capacity-echart1'));

var electricOption = {

    title: {
        text: '',
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
        show: false,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'horizontal',
        left : 15,
        y : 10,
        itemGap:8,
        data:['已用','未用'],
        show:true,
        itemWidth:12,
        itemHeight:12,
        padding: 5,
        textStyle:{
            color:'#687EA2',
            fontSize:12
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
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            data:[
                {
                    value:100,
                    name:'已用',
                    itemStyle: {
                        normal : {
                            color: '#31BEA4',
                            label: {show:false}
                        }
                    }

                },
                {
                    value:200,
                    name:'未用',
                    itemStyle: {
                        normal : {
                            color: '#4B85E5',
                            label: {show:false}
                        }
                    }
                }

            ]
        }
    ]
};

//页面赋值
electricChart.setOption(electricOption,true);

electricOption.legend.show = false;

electricChart1.setOption(electricOption,true);

//-----------------------------------制冷RTI-------------------------------------//

var refrigerationChart = echarts.init(document.getElementById('refrigeration-echart'));

var refrigerationOption ={
    title: {
        text: 'RTI',
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
            max:9,
            splitNumber: 15,
            axisTick: {            // 坐标轴小标记
                length: 8,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 11,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
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
                    width: 6
                }
            },
            data: [{value:5}]
        }
    ]
};

//页面赋值
refrigerationChart.setOption(refrigerationOption,true);



