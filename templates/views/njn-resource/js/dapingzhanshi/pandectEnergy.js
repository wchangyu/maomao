/**
 * Created by admin on 2018/1/22.
 */
$(function(){


});

//冷热源echart
var _electricityEcharts = echarts.init(document.getElementById('equipment-chart-electricity'));

var _electricityEcharts1 = echarts.init(document.getElementById('equipment-chart-electricity1'));

var dataStyle = {
    normal: {
        label: {show:false},
        labelLine: {show:false}
    }
};
var placeHolderStyle = {
    normal : {
        color: 'rgba(0,0,0,0)',
        label: {show:false},
        labelLine: {show:false}
    },
    emphasis : {
        color: 'rgba(0,0,0,0)'
    }
};

var _electricityoption = {

    title: {
        text: '3.5',
        subtext: '电冷能效',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '115',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 56,
        itemGap:2,
        data:[
            {
                name:'68kw'
            },
            {
                name:'29kw'
            }
        ],
        show:true,
        textStyle:{
            color:'white'
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
            itemStyle : dataStyle,
            data:[
                {
                    value:68,
                    name:'输入电量',
                    itemStyle: {
                        normal : {
                            color: '#14e398'
                        }
                    }

                },
                {
                    value:32,
                    name:'68kw',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:29,
                    name:'输出冷量',
                    itemStyle: {
                        normal : {
                            color: '#2170f4'

                        }
                    }
                },
                {
                    value:71,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

_electricityEcharts.setOption(_electricityoption,true);

_electricityEcharts1.setOption(_electricityoption,true);



