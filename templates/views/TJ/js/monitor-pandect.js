/**
 * Created by admin on 2018/10/23.
 */
$(function(){


});

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

//上方echart
var _conditioneroption = {

    title: {
        text: '106',
        subtext: '设备总数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '95',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : '#666666',
            fontFamily : '微软雅黑',
            fontSize : 24,
            fontWeight : 'bold',
            lineHeight:26
        },
        subtextStyle:{
            color:'#757575',
            fontSize : 12
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'horizontal', //'vertical',
        x : 'center',
        y: 'bottom',
        itemGap:2,
        data:['正常','异常','报警'],
        show:true,
        textStyle:{
            color:'#333',
            fontSize:10
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
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:91,
                    name:'正常',
                    itemStyle: {
                        normal : {
                            color: '#5BDEB6'
                        }
                    }

                },
                {
                    value:35,
                    name:'68',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:9,
                    name:'异常',
                    itemStyle: {
                        normal : {
                            color: '#F7D035'

                        }
                    }
                },
                {
                    value:117,
                    name:'29',
                    itemStyle : placeHolderStyle
                }


            ]
        },
        {
            name:'3',
            type:'pie',
            radius : [30, 40],
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:6,
                    name:'报警',
                    itemStyle: {
                        normal : {
                            color: '#F25B72'

                        }
                    }
                },
                {
                    value:120,
                    name:'29',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//动力环境
var _conditionerEcharts = echarts.init(document.getElementById('power-echart'));

_conditionerEcharts.setOption( _conditioneroption,true);

//电力
var _conditioneroption1 = {

    title: {
        text: '84',
        subtext: '设备总数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '95',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : '#666666',
            fontFamily : '微软雅黑',
            fontSize : 24,
            fontWeight : 'bold',
            lineHeight:26
        },
        subtextStyle:{
            color:'#757575',
            fontSize : 12
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'horizontal', //'vertical',
        x : 'center',
        y: 'bottom',
        itemGap:2,
        data:['正常','异常','报警'],
        show:true,
        textStyle:{
            color:'#333',
            fontSize:10
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
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:64,
                    name:'正常',
                    itemStyle: {
                        normal : {
                            color: '#5BDEB6'
                        }
                    }

                },
                {
                    value:20,
                    name:'68kW',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:12,
                    name:'异常',
                    itemStyle: {
                        normal : {
                            color: '#F7D035'

                        }
                    }
                },
                {
                    value:72,
                    name:'',
                    itemStyle : placeHolderStyle
                }


            ]
        },
        {
            name:'3',
            type:'pie',
            radius : [30, 40],
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:8,
                    name:'报警',
                    itemStyle: {
                        normal : {
                            color: '#F25B72'

                        }
                    }
                },
                {
                    value:76,
                    name:'',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

var _electricityEcharts = echarts.init(document.getElementById('electricity-echart'));

_electricityEcharts.setOption( _conditioneroption1,true);


//空调
var _conditioneroption2 = {

    title: {
        text: '136',
        subtext: '设备总数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '95',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : '#666666',
            fontFamily : '微软雅黑',
            fontSize : 24,
            fontWeight : 'bold',
            lineHeight:26
        },
        subtextStyle:{
            color:'#757575',
            fontSize : 12
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'horizontal', //'vertical',
        x : 'center',
        y: 'bottom',
        itemGap:2,
        data:['正常','异常','报警'],
        show:true,
        textStyle:{
            color:'#333',
            fontSize:10
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
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:106,
                    name:'正常',
                    itemStyle: {
                        normal : {
                            color: '#5BDEB6'
                        }
                    }

                },
                {
                    value:30,
                    name:'68kW',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:24,
                    name:'异常',
                    itemStyle: {
                        normal : {
                            color: '#F7D035'

                        }
                    }
                },
                {
                    value:112,
                    name:'',
                    itemStyle : placeHolderStyle
                }


            ]
        },
        {
            name:'3',
            type:'pie',
            radius : [30, 40],
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:13,
                    name:'报警',
                    itemStyle: {
                        normal : {
                            color: '#F25B72'

                        }
                    }
                },
                {
                    value:123,
                    name:'',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};
var _conditionerEcharts = echarts.init(document.getElementById('conditioner-echart'));

_conditionerEcharts.setOption( _conditioneroption2,true);

//安防
var _conditioneroption3 = {

    title: {
        text: '93',
        subtext: '设备总数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '95',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : '#666666',
            fontFamily : '微软雅黑',
            fontSize : 24,
            fontWeight : 'bold',
            lineHeight:26
        },
        subtextStyle:{
            color:'#757575',
            fontSize : 12
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'horizontal', //'vertical',
        x : 'center',
        y: 'bottom',
        itemGap:2,
        data:['正常','异常','报警'],
        show:true,
        textStyle:{
            color:'#333',
            fontSize:10
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
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:70,
                    name:'正常',
                    itemStyle: {
                        normal : {
                            color: '#5BDEB6'
                        }
                    }

                },
                {
                    value:23,
                    name:'68kW',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:11,
                    name:'异常',
                    itemStyle: {
                        normal : {
                            color: '#F7D035'

                        }
                    }
                },
                {
                    value:82,
                    name:'',
                    itemStyle : placeHolderStyle
                }


            ]
        },
        {
            name:'3',
            type:'pie',
            radius : [30, 40],
            center:['50%', '50%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:12,
                    name:'报警',
                    itemStyle: {
                        normal : {
                            color: '#F25B72'

                        }
                    }
                },
                {
                    value:81,
                    name:'',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};
var _protectionEcharts = echarts.init(document.getElementById('protection-echart'));

_protectionEcharts.setOption( _conditioneroption3,true);