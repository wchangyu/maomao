/**
 * Created by admin on 2018/10/25.
 */
$(function(){

    //页面绘制右侧数据
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



});

//-----------------------------------列头柜参数报警-------------------------------------//


//定义数组长度
var spaceDataLength = 25;


//页面绘制右侧数据
function drawSpaceData(){

    //定义存放页面中的字符串
    var dataHtml = '';

    for(var i=1; i<spaceDataLength; i++){

        var thisName = 'P'+i;

        dataHtml +=

            '<div class="data-container">' +
            '<h3>'+thisName+' PDU参数</h3>' +

            '<p>' +
            '<span class="name title-name">进线</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">运行状态</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="ON">' +
            '</span>' +
            '</p>' +


            '<p>' +
            '<span class="name">故障</span>' +
            '<span class="data">' +
            '<input type="text" class="green-data" value="正常">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">A相电压</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="220">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">B相电压</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="220">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">C相电压</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="220">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">A相电流</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="110">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">B相电流</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="110">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">C相电流</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="110">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">频率</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="50Hz">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">功率因数</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0.9">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">有功电度</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="2335">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">无功电度</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="599">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">有功功率</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="300">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">无功功率</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="100">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">零底电压</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0">' +
            '</span>' +
            '</p>' +



        '</div>';


    }

    //页面赋值
    $('.right-navigation .bottom-data-container ').html(dataHtml);

};



// 指定图表的配置项和数据 用于电池容量
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
        data:['已用','未用'],
        textStyle:{
            color:'#999'
        },
        show:true

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: '75%',
            center:['50%', '58%'],
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
                    name:'已用',
                    value:1300
                },
                {
                    name:'未用',
                    value:1400
                }
            ]
        }
    ]
};

var _rightMiddleChart1 = echarts.init(document.getElementById('electric-capacity-echart'));

_rightMiddleChart1.setOption(option0,true);









