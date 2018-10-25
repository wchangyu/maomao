/**
 * Created by admin on 2018/10/19.
 */
$(function(){

    //时间插件初始化
    _timeYMDComponentsFun($('.datatimeblocks'));

    //echart页面赋值
    drawEchart(echartDataArr);


});

//定义初始化时间
var startTime = moment().subtract('1','day').format('YYYY-MM-DD');

var endTime = moment().format('YYYY-MM-DD');

$('.min').val(startTime);

$('.max').val(endTime);

//---------------------------------下方echart图--------------------------//

//echart数据
var echartDataArr=[

 [
     {
         name:'报废到期',
         value:12
     },
     {
         name:'保修到期',
         value:8
     },
     {
         name:'逾期未还',
         value:6
     },
     {
         name:'维保到期',
         value:14
     },
     {
         name:'在线异常',
         value:18
     }
 ],

    [
        {
            name:'报废到期',
            value:6
        },
        {
            name:'逾期未还',
            value:8
        },
        {
            name:'维保到期',
            value:4
        },
        {
            name:'在线异常',
            value:11
        }
    ],

    [
        {
            name:'报废到期',
            value:3
        },

        {
            name:'逾期未还',
            value:8
        },
        {
            name:'维保到期',
            value:6
        }
    ],

    [
        {
            name:'报废到期',
            value:6
        },
        {
            name:'保修到期',
            value:12
        },
        {
            name:'逾期未还',
            value:8
        },
        {
            name:'维保到期',
            value:4
        },
        {
            name:'在线异常',
            value:11
        }
    ],

    [
        {
            name:'保修到期',
            value:16
        },
        {
            name:'逾期未还',
            value:8
        },
        {
            name:'维保到期',
            value:4
        },
        {
            name:'在线异常',
            value:11
        }
    ],
    [
        {
            name:'报废到期',
            value:6
        },
        {
            name:'维保到期',
            value:4
        },
        {
            name:'在线异常',
            value:11
        }
    ]
];

//资产信息echart图
var _propertyChart5 = echarts.init(document.getElementById('echart1'));

// 指定图表的配置项和数据 用于资产信息
var propertyOption = {
    title: {
        text: '58',
        subtext: '总故障数',
        left: 'center',
        top: '160',
        itemGap: 1,
        textBaseline:'middle',
        textStyle : {
            color : '#666666',
            fontFamily : '微软雅黑',
            fontSize : 36,
            fontWeight : 'normal'
        },
        subtextStyle:{
            color:'#757575',
            fontSize : 14,
            fontWeight : 'normal'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: " {b} : {c} ({d}%) "
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        show:true,
        data:['报废到期','保修到期','逾期未还','维保到期','在线异常'],
        textStyle:{
            color:'#687EA2'
        }

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['50%', '70%'],
            center:['50%', '58%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position:'outside',
                    textStyle : {
                        color:'white',
                        fontSize : '12',
                        fontWeight : 'bold'
                    },
                    padding:[0,-20,15,-15],
                    formatter: function(params){
                        //console.log(params);

                        return params.data.value + ' (' +  params.percent.toFixed(1) + '%)';
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
                            '#31BEA4','#2A9FD0', '#4D7AE1','#8A52E7','#D944DB', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
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
                    name:'报废到期',
                    value:12
                },
                {
                    name:'保修到期',
                    value:8
                },
                {
                    name:'逾期未还',
                    value:6
                },
                {
                    name:'维保到期',
                    value:14
                },
                {
                    name:'在线异常',
                    value:18
                }
            ]
        }
    ]
};

_propertyChart5.setOption(propertyOption,true);

//echart页面赋值
function drawEchart(dataArr){

    var length = $('.bottom-echart').length;

    for(var i=0; i<length; i++){

        ////获取当前ID
        //var id = $('.right-bottom-table .right-bottom-echart').eq(i).attr('id');

        var dom = document.getElementsByClassName('bottom-echart')[i];

        var rightTableChart = echarts.init(dom);

        //定义图例列表
        var legendArr = [];

        var echartArr = dataArr[i];

        var totalNum = 0;

        $(echartArr).each(function(i,o){

            legendArr.push(o.name);

            totalNum += o.value;

        });

        propertyOption.title.text = totalNum;

        propertyOption.legend.data = legendArr;

        propertyOption.series[0].data = echartArr;

        rightTableChart.setOption(propertyOption,true);


    }

}



