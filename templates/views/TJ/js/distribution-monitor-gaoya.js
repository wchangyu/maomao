/**
 * Created by admin on 2018/10/25.
 */
/**
 * Created by admin on 2018/10/22.
 */
$(function(){

    //页面绘制右侧数据
    //drawSpaceData();

    //给左侧下方系统容量echart赋值
     systemCapacityEchart();

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

//-----------------------------------变压器数据-------------------------------------//


//定义数组长度
var spaceDataLength = 12;


//页面绘制右侧数据
function drawSpaceData(){

    //定义存放页面中的字符串
    var dataHtml = '';

    for(var i=1; i<spaceDataLength; i++){

        var thisName = 'K'+i;

        dataHtml +=

            '<div class="data-container">' +
            '<h3>'+thisName+' 精密空调</h3>' +
            '<p>' +
            '<span class="name">控制</span>' +
            '<span class="data">' +
            '<select name="" id="">' +
            '<option value="0">超节能</option>' +
            '<option value="1">一般节能</option>' +
            '</select>' +
            '</span>' +
            '</p>' +
            '<p>' +
            '<span class="name">运行状态</span>' +
            '<span class="data">' +
            '<input type="text" class="state" value="ON">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">湿度设定值</span>' +
            '<span class="data">' +
            '<input type="text" class="" value="60%">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">送风温度设定</span>' +
            '<span class="data">' +
            '<input type="text" class="" value="18℃">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">送风温度</span>' +
            '<span class="data">' +
            '<input type="text" class="green-data" value="18℃">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">送风湿度</span>' +
            '<span class="data">' +
            '<input type="text" class="green-data" value="50%">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">回风温度</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="22℃">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">风机频率</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="45HZ">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">电动阀开度</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="70%">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">加湿开度</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="10%">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">风机报警</span>' +
            '<span class="data">' +
            '<span class="green-ball imaginary"><font></font></span>' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">滤网压差报警</span>' +
            '<span class="data">' +
            '<span class="green-ball imaginary"><font></font></span>' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">持续运行时间</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="2500">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">总运行时间</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="87600">' +
            '</span>' +
            '</p>' +

            '</div>';


    }

    //页面赋值
    $('.right-navigation .bottom-data-container ').html(dataHtml);

}


// 指定图表的配置项和数据 用于系统容量
var option0 = {
    title: {
        text: '制冷系统(kw)',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        bottom: '-10',
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
            color:'#333'
        },
        show:true

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

//系统容量echart图
var _rightMiddleChart1 = echarts.init(document.getElementById('left-bottom-echart1'));

var _rightMiddleChart2 = echarts.init(document.getElementById('left-bottom-echart2'));

var _rightMiddleChart3 = echarts.init(document.getElementById('left-bottom-echart3'));

var _rightMiddleChart4 = echarts.init(document.getElementById('left-bottom-echart4'));

//系统容量数据
var systemCapacityEcahrtArr = [_rightMiddleChart1,_rightMiddleChart2,_rightMiddleChart3,_rightMiddleChart4];
var systemCapacityArr = [
    {
        'name':'IT-TA',
        "data":[1300,1400],
        "data1":[24,7,12,1]
    },
    {
        'name':'IT-TB',
        "data":[565,2635],
        "data1":[60,5,55,3]

    },
    {
        'name':'PO-TA',
        "data":[904,3096],
        "data1":[24,7,12,1]

    },
    {
        'name':'PO-TB',
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
};






