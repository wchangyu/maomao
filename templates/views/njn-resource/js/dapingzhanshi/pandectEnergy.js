/**
 * Created by admin on 2018/1/22.
 */
$(function(){

    //获取页面主题部分数据
    getTPDevMonitor();

    ////获取电耗分项数据
    //getFirstEnergyItemData();

    //设备报警
    getStationAlarmData(1);

    //时间插件初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //点击能源管理上方切换时间按钮
    $('.right-bottom-container .right-tab').on('click',function(){

        //删除之前选中的类
        $(this).parents('.left-tab-container').find('.right-tab').removeClass('right-tab-choose');

        //给当前选中元素添加选中类名
        $(this).addClass('right-tab-choose');

        //设备报警
        getStationAlarmData(1);

        getStationAlarmNum();

    });

    //默认刷新时间
    var _refresh = sessionStorage.getItem("dapinInterval");

    if(_refresh!=0){

        //定时刷新
        setInterval(function(){

            //获取页面主题部分数据
            getTPDevMonitor();

            //设备报警
            getStationAlarmData(1);

            //设备报警
            getStationAlarmData(1);


        },_refresh * 1000 * 60)
    };

    //点击报警信息弹出报警弹窗 并展示数据
    $(".alarm-data-container").on('click',function(){

        //显示悬浮窗
        $('#alarm-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //放入到弹窗标题中
        $('#alarm-message .systematic-name').html(title);

    });

    //点击运行信息弹出运行弹窗 并展示数据
    $(".bottom-equipment-chart-show").on('click',function(){

        //显示悬浮窗
        $('#run-number-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //放入到弹窗标题中
        $('#run-number-message .systematic-name').html(title);

        //获取数据

    });

    //点击运行温度弹出运行弹窗 并展示数据
    $(".bottom-equipment-chart-humiture").on('click',function(){

        //显示悬浮窗
        $('#humiture-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //console.log(title);

        //放入到弹窗标题中
        $('#humiture-message .systematic-name').html(title);

        var condition = {
            "reportID": "1",
            "requesparameters": [
                {
                    "name": "dh_name",
                    "value": ""
                },
                {
                    "name": "dh_weizhi",
                    "value": ""
                },
                {
                    "name": "dh_ctypeid",
                    "value": "4321"
                },
                {
                    "name": "dh_devtype",
                    "value": "7"
                },
                {
                    "name": "dh_pointerid",
                    "value": curPointerIDArr[0]
                }
            ]
        };

        //获取后台数据
        getTableData(condition,'#dateTables-humiture');

    });

    //点击电功率信息弹出电功率弹窗 并展示数据
    $(".bottom-equipment-chart-electric").on('click',function(){

        //显示悬浮窗
        $('#electric-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //console.log(title);

        //放入到弹窗标题中
        $('#electric-message .systematic-name').html(title);

    });

    //点击故障率信息弹出故障率弹窗 并展示数据
    $(".bottom-equipment-chart-fault").on('click',function(){

        //显示悬浮窗
        $('#failure-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //console.log(title);

        //放入到弹窗标题中
        $('#failure-message .systematic-name').html(title);

    });

    //点击能耗信息弹出能耗弹窗 并展示数据
    $(".bottom-equipment-chart-energy").on('click',function(){

        //显示悬浮窗
        $('#energy-message').modal('show');


    });

    //点击能耗费用信息弹出能耗费用弹窗 并展示数据
    $(".bottom-equipment-chart-cost").on('click',function(){

        //显示悬浮窗
        $('#cost-message').modal('show');

    });

    //点击节能减排信息弹出能耗费用弹窗 并展示数据
    $(".right-bottom-centent-conservation").on('click',function(){

        //获取当前能耗类型
        var title = $(this).find('.top-title').html();

        //放入到弹窗标题中
        $('#conservation-message h4').html(title);

        //显示悬浮窗
        $('#conservation-message').modal('show');

    });

    //点击能耗费用信息弹出能耗费用弹窗 并展示数据
    $(".right-bottom-content-trouble").on('click',function(){

        //显示悬浮窗
        $('#trouble-message').modal('show');

    });


    //点击打开消防系统
    $('.platform-title').on('click',function(){

        window.open ="rdsp-bs-js:{'fcfid':'2','type':'2'}"
    });



    ////当鼠标放到系统选项卡上时
    //$('.right-bottom-equipment-container').on('hover','.equipment-title',function(){
    //
    //    var jumpData = $(this).attr('jump-data');
    //
    //    //暖通系统
    //    if(jumpData){
    //
    //        jumpData = parseInt(jumpData);
    //
    //        $(".jump-containers").eq(jumpData).show();
    //
    //    }
    //
    //});
    //
    //$('.right-bottom-equipment-container').on('hover','.jump-containers',function(){
    //
    //    $(this).show();
    //});
    //
    //
    ////当鼠标离开系统选项卡上时
    //$('.right-bottom-equipment-container').on('mouseleave','.equipment-title',function(){
    //
    //    var jumpData = $(this).attr('jump-data');
    //
    //    //暖通系统
    //    if(jumpData){
    //
    //        jumpData = parseInt(jumpData);
    //
    //
    //        $(".jump-containers").eq(jumpData).hide();
    //
    //    }
    //
    //});
    //
    //$('.right-bottom-equipment-container').on('mouseleave','.jump-containers',function(){
    //
    //    $(this).hide();
    //});

});

//左侧下方柱状图
var leftBottomChart = echarts.init(document.getElementById('echarts-left-bottom'));

var leftBottomOption = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top:'7%',
        containLabel: true,
        borderColor:'#A8A8A8',
        borderWidth:2
    },
    xAxis : [
        {
            type : 'category',
            data : [],
            axisTick: {
                alignWithLabel: true
            },
            boundaryGap: false,//从起点开始
            nameTextStyle:{
                color:'#DCF1FF'
            },
            nameGap:1,
            axisLine:{
                lineStyle:{
                    color:'#DCF1FF'
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            nameTextStyle:{
                color:'#DCF1FF'
            },
            //name:'单位：次',
            nameLocation:'end',
            axisLine:{
                lineStyle:{
                    color:'#DCF1FF'
                }
            }
        }
    ],
    series : [
        {
            name:'设备报警',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            smooth:true,
            itemStyle:{
                normal:{
                    color:'#fff',
                    borderColor: "#2170F4",
                    lineStyle:{
                        width:2,
                        color:'#fff'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2170F4'
                    }, {
                        offset: 1,
                        color: '#61854f'
                    }])
                }
            },
            data:[]
        },
        {
            name:'能耗报警',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            smooth:true,
            itemStyle:{
                normal:{
                    color:'#fff',
                    borderColor: "#14E398",
                    lineStyle:{
                        width:2,
                        color:'#fff'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#14E398'
                    }, {
                        offset: 1,
                        color: '#61854f'
                    }])
                }
            },
            data:[]
        },
        {
            name:'能耗报警',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            smooth:true,
            itemStyle:{
                normal:{
                    color:'#fff',
                    borderColor: "#EAD01E",
                    lineStyle:{
                        width:2,
                        color:'#fff'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#EAD01E'
                    }, {
                        offset: 1,
                        color: '#61854f'
                    }])
                }
            },
            data:[]
        }
    ]
};

//重绘chart图
leftBottomChart.setOption(option0);

//定义是否出现加载遮罩的标识
var ifShowLoading = true;

var ifShowLoading2 = true;

//定义计算安全运行天数的开始日期
var startSafeDate = new Date('2017/01/01 12:00');

var date2 = new Date();

var s1 = startSafeDate.getTime(),s2 = date2.getTime();

var total = (s2 - s1)/1000;

var safeDays = parseInt(total / (24*60*60));//计算整数天数

//给页面中赋值
$('.right-bottom-safe .safe-days').html(safeDays);

//console.log(safeDays);

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
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
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
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:['输入电量','输出冷量'],
        show:true,
        itemWidth:22,
        itemHeight:10,
        textStyle:{
            color:'white',
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

//_electricityEcharts.setOption(_electricityoption,true);
//
//_electricityEcharts1.setOption(_electricityoption,true);


//组合空调echart
var _conditionerEcharts = echarts.init(document.getElementById('equipment-chart-conditioner'));

var _conditionerEcharts1 = echarts.init(document.getElementById('equipment-chart-conditioner1'));

var _conditioneroption = {

    title: {
        text: '228',
        subtext: '总台数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '115',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
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
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:['运行中','故障中','维修中'],
        show:true,
        itemWidth:20,
        itemHeight:10,
        textStyle:{
            color:'white',
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
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:68,
                    name:'运行中',
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
                    name:'故障中',
                    itemStyle: {
                        normal : {
                            color: '#f8276c'

                        }
                    }
                },
                {
                    value:71,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        },
        {
            name:'3',
            type:'pie',
            radius : [30, 40],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:19,
                    name:'维修中',
                    itemStyle: {
                        normal : {
                            color: '#ead01e'

                        }
                    }
                },
                {
                    value:81,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//_conditionerEcharts.setOption(_conditioneroption,true);
//
//_conditionerEcharts1.setOption(_electricityoption,true);


//电梯系统echart
var _elevatorEcharts = echarts.init(document.getElementById('equipment-chart-elevator'));

var _elevatorEcharts1 = echarts.init(document.getElementById('equipment-chart-elevator1'));


//_elevatorEcharts.setOption(_conditioneroption,true);
//
//_elevatorEcharts1.setOption(_conditioneroption,true);

//动环系统echart
var _rotatingEcharts = echarts.init(document.getElementById('equipment-chart-rotating'));

var _rotatingEcharts1 = echarts.init(document.getElementById('equipment-chart-rotating1'));


//_rotatingEcharts.setOption(_conditioneroption,true);
//
//_rotatingEcharts1.setOption(_electricityoption,true);



//站房照明echart
var _stationEcharts = echarts.init(document.getElementById('equipment-chart-station'));

var _stationoption = {

    title: {
        text: '228',
        subtext: '总台数',
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
        y : 10,
        itemGap:2,
        data:['运行中','故障中'],
        show:true,
        itemWidth:20,
        itemHeight:10,
        textStyle:{
            color:'white',
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
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:68,
                    name:'运行中',
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
                    name:'故障中',
                    itemStyle: {
                        normal : {
                            color: '#f8276c'

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

//_stationEcharts.setOption( _stationoption,true);


//站台照明echart
var _platformEcharts = echarts.init(document.getElementById('equipment-chart-platform'));

//_platformEcharts.setOption( _stationoption,true);

//送排风echart
var _windEcharts = echarts.init(document.getElementById('equipment-chart-wind'));

//_windEcharts.setOption( _stationoption,true);

//给排水echart
var _waterEcharts = echarts.init(document.getElementById('equipment-chart-water'));

//_waterEcharts.setOption( _stationoption,true);

//能源管理echart配置

var _energyOption = {
    title: {
        text: '2255',
        subtext: '总能耗',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '116',
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
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:[],
        show:true,
        itemWidth:20,
        itemHeight:10,
        textStyle:{
            color:'white',
            fontSize:10
        }
    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['58%', '72%'],
            center:['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'outside'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#14E398', '#2170F4','#EAD01E', '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : false,
                        formatter:'{d}'+'%'+ '\n{b}',
                        color:'white'
                    },
                    labelLine : {
                        show : false,
                        color:'white'

                    }
                },
                emphasis : {
                    label : {
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '18',
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
                    name:'已完成',
                    value:100
                },
                {
                    name:'派单中',
                    value:80
                },
                {
                    name:'进行中',
                    value:45
                }
            ]
        }
    ]
};

//能管重绘数据


//设备故障echart图
var _useelectricityChart = echarts.init(document.getElementById('echarts-left-bottom2'));

var _useelectricityoption = {
    title: {
        text: '225',
        subtext: '工单量',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '102',
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
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:[]
    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['45%', '60%'],
            center:['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'outside'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : true,
                        formatter:'{d}'+'%'+ '\n{b}',
                        color:'white'
                    },
                    labelLine : {
                        show : true,
                        color:'white'

                    }
                },
                emphasis : {
                    label : {
                        show : true,
                        position : 'center',
                        textStyle : {
                            fontSize : '18',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data:[
                    {
                        name:'已完成',
                        value:100
                    },
                    {
                        name:'派单中',
                        value:80
                    },
                    {
                        name:'进行中',
                        value:45
                    }
            ]
        }
    ]
};


// 指定图表的配置项和数据 用于本日用能分项
var option8 = {
    title: {
        text: '225',
        subtext: '工单量',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: '160',
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
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:['暖通系统','照明系统','电梯系统','动环系统','给排水','消防系统','自动售检票','能源管理'],
        textStyle:{
            color:'white'
        }

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['50%', '65%'],
            center:['65%', '56%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
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
                            '#0d9dcb', '#0cd34c','#cfcf14', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
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
                            fontSize : '30',
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
                    name:'暖通系统',
                    value:50
                },
                {
                    name:'照明系统',
                    value:45
                },
                {
                    name:'电梯系统',
                    value:35
                },
                {
                    name:'动环系统',
                    value:30
                },
                {
                    name:'给排水',
                    value:25
                },
                {
                    name:'消防系统',
                    value:20
                },
                {
                    name:'自动售检票',
                    value:10
                },
                {
                    name:'能源管理',
                    value:10
                }
            ]
        }
    ]
};


//设备故障页面重绘数据
//_useelectricityChart.setOption(option8,true);


//重绘chart图
//_useelectricityChart.setOption(_useelectricityoption);


var _useelectricityoption1 = {
    title: {
        text: '225',
        subtext: '工单量',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '102',
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
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:[]
    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['45%', '60%'],
            center:['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'outside'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : true,
                        formatter:'{d}'+'%'+ '\n{b}',
                        color:'white'
                    },
                    labelLine : {
                        show : true,
                        color:'white'

                    }
                },
                emphasis : {
                    label : {
                        show : true,
                        position : 'center',
                        textStyle : {
                            fontSize : '18',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data:[
                {
                    name:'照明',
                    value:100
                },
                {
                    name:'暖通空调',
                    value:80
                },
                {
                    name:'设备设施',
                    value:45
                }
            ]
        }
    ]
};

//运维联动
var _operationresponseChart = echarts.init(document.getElementById('operation-chart-response'));

var _operationresponseChart1 = echarts.init(document.getElementById('operation-chart-response1'));

//重绘chart图
_operationresponseChart.setOption(_useelectricityoption);

_operationresponseChart1.setOption(option8);

//清空数据
$('.bottom-content-data span').html('');

//-----------------------------------获取页面主体部分数据----------------------------//

//定义环形图颜色集合
var colorArr1 = ['#14e398','#2170f4'];

var colorArr2 = ['#14e398','#f8276c','#ead01e'];

//定义echart集合
var echartNameArr = [_electricityEcharts,_electricityEcharts1,_conditionerEcharts,_conditionerEcharts1,_elevatorEcharts,_elevatorEcharts1, _rotatingEcharts, _rotatingEcharts1,
    _stationEcharts,_platformEcharts,_windEcharts,_waterEcharts,  _useelectricityChart];

//插入背景圆形图
var cicleHtml =   '<div class="bottom-equipment-chart-background"></div>';

$('.right-bottom-equipment-container .bottom-equipment-chart-container .bottom-content-data').before(cicleHtml);

//获取当前是冬季还是夏季 冬季返回 0 夏季返回1
function getSeason(){

    //获取当前年份
    var year = moment().format('YYYY');

    var curDate = moment().format('YYYY-MM-DD');

    //夏季时间
    var summerDate1 = year + '-03-15';

    var summerDate2 = year + '-09-15';

    //如果在夏季
    if(curDate > summerDate1 && curDate < summerDate2){

        return 1

    }else{

        return 0
    }
};

//获取数据
function getTPDevMonitor(){

    //开始结束时间
    var startTime = moment().format('YYYY-MM-DD');

    var endTime = moment().add(1,'days').format('YYYY-MM-DD');

    //传递给后台的数据
    var ecParams = {
        "startTime": startTime,
        "endTime":  endTime,
        "pointerIDs": curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'NJNDeviceShow/GetTPDevMonitorNew',
        data:ecParams,
        //timeout:_theTimes * 2,
        beforeSend:function(){

            if(ifShowLoading){
                $( echartNameArr).each(function(i,o){

                    o.showLoading({
                        maskColor: 'rgba(33,43,55,0.8)'
                    });
                });

                ifShowLoading = false;
            }

        },
        success:function(result){

            $( echartNameArr).each(function(i,o){

                o.hideLoading();
            });

            if(result == null || result.length == 0){

                return false;
            }

            //定义设备故障的数组
            var alarmNumArr = [];

            //暖通系统
            alarmNumArr.push({name:"暖通系统",value:result.hvacAirsOBJ.alarmNum});

            //照明系统
            alarmNumArr.push({name:"照明系统",value:result.lightSysOBJ.alarmNum});

            //电梯系统
            alarmNumArr.push({name:"电梯系统",value:result.elevatorSysOBJ.alarmNum});

            //动环系统
            alarmNumArr.push({name:"动环系统",value:result.rotaryFaceSysOBJ.alarmNum});

            //给排水系统
            alarmNumArr.push({name:"给排水",value:result.sendDrainWaterOBJ.alarmNum});

            //消防系统
            alarmNumArr.push({name:"消防系统",value:result.fireControlSysOBJ.alarmNum});

            //售检票系统
            alarmNumArr.push({name:"自动售检票",value:result.sellCheckTicketOBJ.alarmNum});

            //能管系统
            alarmNumArr.push({name:"能源管理",value:result.energyManagerOBJ.alarmNum});

            option8.series[0].data = alarmNumArr;

            var totalAlarmNum = 0;

            $(alarmNumArr).each(function(i,o){

                totalAlarmNum += o.value;
            });

            option8.title.text = totalAlarmNum;

            _useelectricityChart.setOption(option8,true);

            //-----------------------------暖通系统---------------------------//

            //电冷能效
           var elecColdEffic = result.hvacAirsOBJ.hvacAirData.nxVa + '%';

            //elecColdEffic = "80.8%";

            //输入电量
            var inputElecData = parseFloat(result.hvacAirsOBJ.hvacAirData.qeVa);

            //输出电冷量
            var elecColdData = parseFloat(result.hvacAirsOBJ.hvacAirData.rcVa);

            //获取当前是冬季夏季 夏季为1 冬季为2 非冬夏0

            var elecColdDataArr = [];

            var elecColdCenterData = {};

            var eleUnit = '';

            //如果是夏天
            if(result.hvacAirsOBJ.hvacAirData.ty == 1){

                elecColdDataArr = [
                    {name:'输入电量',data:inputElecData},
                    {name:'输出冷量',data:elecColdData}
                ];

                elecColdCenterData = {name:'电冷能效',data:elecColdEffic};

                //$('.right-bottom-container .right-bottom-equipment .right-bottom-equipment-container ').eq(0).find('.equipment-title a').html('冷冻机房');

                eleUnit = "KW";

            }else{

                elecColdDataArr = [
                    {name:'输入蒸汽',data:inputElecData},
                    {name:'输出热量',data:elecColdData}
                ];

                elecColdCenterData = {name:'换热能效',data:elecColdEffic};

                //$('.right-bottom-container .right-bottom-equipment .right-bottom-equipment-container ').eq(0).find('.equipment-title a').html('换热站');

                eleUnit = "KW";
            }


            //给echarts赋值
            drawEcharts(elecColdDataArr,'equipment-chart-electricity',colorArr1,elecColdCenterData, _electricityoption, eleUnit);

            //运行故障数

            //总台数
            var hvacallNum = result.hvacAirsOBJ.allNum;

            //运行中
            var hvacrunNum = result.hvacAirsOBJ.runNum;

            //故障中
            var hvacfaultNum = result.hvacAirsOBJ.faultNum;

            //维修中
            var hvacrepairNum = result.hvacAirsOBJ.repairNum;

            var hvacairDataArr = [
                {name:'运行中',data:hvacrunNum},
                {name:'故障中',data:hvacfaultNum},
                {name:'维修中',data:hvacrepairNum}
            ];

            var hvacairCenterData = {name:'总台数',data:hvacallNum};

            //给echarts赋值
            drawEcharts(hvacairDataArr,'equipment-chart-electricity1',colorArr2,hvacairCenterData, _conditioneroption,'');

            //电功率
            $('#equipment-chart-electricity').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.hvacAirsOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-electricity1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.hvacAirsOBJ.alarmNum);

            $('#equipment-chart-electricity1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.hvacAirsOBJ.cDataIDNum);

            //-----------------------------照明系统---------------------------//
            //总台数
            var allNum = result.lightSysOBJ.houseLightAllNum;

            //运行中
            var runNum = result.lightSysOBJ.houseLightRunNum;

            //故障中
            var faultNum = result.lightSysOBJ.houseLightFaultNum;

            //维修中
            var repairNum = result.lightSysOBJ.houseLightRepairNum;

            var airDataArr = [
                {name:'运行中',data:runNum},
                {name:'故障中',data:faultNum},
                {name:'维修中',data:repairNum}
            ];

            var airCenterData = {name:'站房回数',data:allNum};

            //给echarts赋值
            drawEcharts(airDataArr,'equipment-chart-conditioner',colorArr2,airCenterData, _conditioneroption,'');


            //-----------------------------站台照明---------------------------//
            //总回路
            //var platformAllTimesNum = result.lightSysOBJ.platformLightAllNum;

            var platformAllTimesNum = 268;

            //运行中
            //var platformrunNum = result.lightSysOBJ.platformLightRunNum;

            var platformrunNum = 107;

            //故障中
            var platformfaultNum = result.lightSysOBJ.platformLightFaultNum;

            //维修中
            var platformrepairNum = result.lightSysOBJ.platformLightRepairNum;

            var platformArr = [
                {name:'运行中',data:platformrunNum},
                {name:'故障中',data:platformfaultNum},
                {name:'维修中',data:platformrepairNum}
            ];

            var platformData = {name:'站台回路',data:platformAllTimesNum};

            //给echarts赋值
            drawEcharts(platformArr,'equipment-chart-conditioner1',colorArr2,platformData, _conditioneroption,'');

            //电功率
            $('#equipment-chart-conditioner').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.lightSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-conditioner1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.lightSysOBJ.alarmNum);

            $('#equipment-chart-conditioner1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.lightSysOBJ.cDataIDNum);


            //-----------------------------电梯系统---------------------------//
            //直梯数
            var allNum1 = result.elevatorSysOBJ.verticalLadder.allNum;

            //运行中
            var runNum1 = result.elevatorSysOBJ.verticalLadder.allNum;

            //故障中
            var faultNum1 = result.elevatorSysOBJ.verticalLadder.faultNum;

            //维修中
            var repairNum1 = result.elevatorSysOBJ.verticalLadder.repairNum;

            var elevatorDataArr = [
                {name:'运行中',data:runNum1 },
                {name:'故障中',data:faultNum1 },
                {name:'维修中',data:repairNum1 }
            ];

            var elevatorCenterData = {name:'直梯数',data:allNum1};

            //给echarts赋值
            drawEcharts(elevatorDataArr,'equipment-chart-elevator',colorArr2,elevatorCenterData, _conditioneroption,'');

            //扶梯数
            var allNum2 = result.elevatorSysOBJ.escalator.allNum;

            //运行中
            var runNum2 = result.elevatorSysOBJ.escalator.allNum;

            //故障中
            var faultNum2 = result.elevatorSysOBJ.escalator.faultNum;

            //维修中
            var repairNum2 = result.elevatorSysOBJ.escalator.repairNum;

            var elevatorDataArr1 = [
                {name:'运行中',data:runNum2 },
                {name:'故障中',data:faultNum2 },
                {name:'维修中',data:repairNum2 }
            ];

            var elevatorCenterData1 = {name:'扶梯数',data:allNum2};

            //给echarts赋值
            drawEcharts(elevatorDataArr1,'equipment-chart-elevator1',colorArr2,elevatorCenterData1, _conditioneroption,'');


            //电功率
            $('#equipment-chart-elevator').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.elevatorSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-elevator1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.elevatorSysOBJ.alarmNum);

            $('#equipment-chart-elevator1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.elevatorSysOBJ.cDataIDNum);


            //-----------------------------动环系统---------------------------//
            //机房数
            var rotaryFaceallNum = result.rotaryFaceSysOBJ.machineRoomNum;

            //运行中
            var rotaryFacerunNum = result.rotaryFaceSysOBJ.runNum;

            //故障中
            var rotaryFacefaultNum = result.rotaryFaceSysOBJ.faultNum;

            //维修中
            var rotaryFacerepairNum = result.rotaryFaceSysOBJ.repairNum;

            var rotaryFaceArr = [
                {name:'运行中',data:rotaryFacerunNum},
                {name:'故障中',data:rotaryFacefaultNum},
                {name:'维修中',data:rotaryFacerepairNum}
            ];

            var rotaryFaceData = {name:'机房数',data:rotaryFaceallNum};

            //给echarts赋值
            drawEcharts(rotaryFaceArr,'equipment-chart-rotating',colorArr2,rotaryFaceData, _conditioneroption,'');

            //送风温度
            var indoorTemp1 = result.rotaryFaceSysOBJ.indoorTemp;

            //室内温度
            var steamData1 = result.rotaryFaceSysOBJ.indoorTemp;

            //室内湿度
            var indoorHumidity = result.rotaryFaceSysOBJ.indoorHumidity;

            var TempArr = [
                {name:'室内温度',data:steamData1},
                {name:'室内湿度',data:indoorHumidity}
            ];

            var indoorTempData = {name:'室内温度',data:indoorTemp1};

            //给echarts赋值
            drawEcharts(TempArr,'equipment-chart-rotating1',colorArr1,indoorTempData, _electricityoption,'℃');

            //电功率
            $('#equipment-chart-rotating').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.rotaryFaceSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-rotating1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.rotaryFaceSysOBJ.alarmNum);

            $('#equipment-chart-rotating1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.rotaryFaceSysOBJ.cDataIDNum);


            //-----------------------------给排水---------------------------//
            //总回路
            var allTimesNum = result.sendDrainWaterOBJ.allSetNumber;

            //运行中
            var statHouserunNum = result.sendDrainWaterOBJ.runNum;

            //故障中
            var statHousefaultNum = result.sendDrainWaterOBJ.faultNum;

            //维修中
            var statHouseRepairNum = result.sendDrainWaterOBJ.repairNum;

            var statHouseArr = [
                {name:'运行中',data:statHouserunNum},
                {name:'故障中',data:statHousefaultNum},
                {name:'维修中',data:statHouseRepairNum}
            ];

            var statHouseData = {name:'总台数',data:allTimesNum};

            //给echarts赋值
            drawEcharts(statHouseArr,'equipment-chart-station',colorArr2,statHouseData, _conditioneroption,'');

            //电功率
            $('#equipment-chart-station').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.sendDrainWaterOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-station').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.sendDrainWaterOBJ.alarmNum);

            $('#equipment-chart-station').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.sendDrainWaterOBJ.cDataIDNum);


            //-----------------------------消防系统---------------------------//
            //总台数
            var fireControlAllTimesNum = result.fireControlSysOBJ.allSetNumber;

            //运行中
            var fireControlrunNum = result.fireControlSysOBJ.runNum;


            //故障中
            var fireControlfaultNum = result.fireControlSysOBJ.faultNum;

            //维修中
            var fireControlrepairNum = result.fireControlSysOBJ.repairNum;

            var fireControlArr = [
                {name:'运行中',data:fireControlrunNum},
                {name:'故障中',data:fireControlfaultNum},
                {name:'维修中',data:fireControlrepairNum}
            ];

            var fireControlData = {name:'总台数',data:fireControlAllTimesNum};

            //给echarts赋值
            drawEcharts(fireControlArr,'equipment-chart-platform',colorArr2,fireControlData, _conditioneroption,'');

            //电功率
            $('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.fireControlSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.fireControlSysOBJ.alarmNum);

            //$('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.fireControlSysOBJ.cDataIDNum)

            $('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.fireControlSysOBJ.cDataIDNum);


            //-----------------------------自动售检票---------------------------//
            //总台数
            var sendExhaustAllTimesNum = result.sellCheckTicketOBJ.allSetNumber;

            //运行中
            var sendExhaustrunNum = result.sellCheckTicketOBJ.runNum;

            //故障中
            var sendExhaustfaultNum = result.sellCheckTicketOBJ.faultNum;

            //维修中
            var sendExhaustrepairNum = result.sellCheckTicketOBJ.repairNum;


            var sendExhaustArr = [
                {name:'运行中',data:sendExhaustrunNum},
                {name:'故障中',data:sendExhaustfaultNum},
                {name:'维修中',data:sendExhaustrepairNum}
            ];

            var sendExhaustData = {name:'总台数',data:sendExhaustAllTimesNum};

            //给echarts赋值
            drawEcharts(sendExhaustArr,'equipment-chart-wind',colorArr2,sendExhaustData, _conditioneroption,'');

            //故障率
            $('#equipment-chart-wind').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.sellCheckTicketOBJ.runPercent.toFixed(1) + '<span>%</span>');

            //检测点
            $('#equipment-chart-wind').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.sellCheckTicketOBJ.alarmNum);

            $('#equipment-chart-wind').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.sellCheckTicketOBJ.cDataIDNum);


            //-----------------------------能源管理---------------------------//

            //获取存放能耗的数组
            var energyArr = result.energyManagerOBJ.energyKeyValues;

            //存放页面中显示的数据
            var dataArr = [];

            //存放图例
            var legendArr = [];

            $(energyArr).each(function(i,o){

                //排除气的能耗
                if(o.energyItemID != "311"){

                    var obj = {};

                    //获取当前的能耗名称
                    obj.name = _getEcName(o.energyItemID);

                    legendArr.push(_getEcName(o.energyItemID));

                    //获取当前的能耗数值
                    obj.value = o.energyData.toFixed(2);

                    dataArr.push(obj);
                }
            });


            //总能耗
            _energyOption.title.text = result.energyManagerOBJ.allEnergyData.toFixed(0);

            _energyOption.series[0].data = dataArr;

            _energyOption.legend.data = legendArr;

            //能管重绘数据
            _waterEcharts.setOption(_energyOption,true);

            //总费用
            $('#equipment-chart-water').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.energyManagerOBJ.allEnergyCostData.toFixed(1) + '<span>元</span>');

            //检测点
            $('#equipment-chart-water').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.energyManagerOBJ.alarmNum);

            $('#equipment-chart-water').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.energyManagerOBJ.cDataIDNum)


        },
        error:function(jqXHR, textStatus, errorThrown){

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};

//获取下方能源管理数据
function getPointerData(){
    //定义存放返回数据的数组（本期 X Y）
    var allData = [];
    var allDataX = [];
    var allDataY = [];
    var totalAllData = 0;

    //存放要传的楼宇集合
    var postPointerID = [];

    //存放要传的分户ID
    var officeID = '';

    //存放要传的支路ID
    var serviceID = '';

    //是否标煤
    var isBiaoMeiEnergy = 0;

    //单位类型 0为kwh t
    var unitType = '0';

    //确定楼宇id

    postPointerID.push(curPointerIDArr);

    //能耗类型
    _ajaxEcType = $('.right-bottom-energyment-control .left-tab-choose').attr('unit-type');

    //获取展示日期类型
    var showDateType = getShowDateType1()[0];

    //获取用户选择日期类型
    var selectDateType = getShowDateType1()[1];

    //获取开始时间
    var startTime = getPostTime11()[0];

    //获取开始时间
    var endTime = getPostTime11()[1];

    //定义获得数据的参数
    var ecParams = {
        "energyItemID": _ajaxEcType,
        "isBiaoMeiEnergy": isBiaoMeiEnergy,
        "pointerIDs": postPointerID,
        "officeID": officeID,
        "serviceID": serviceID,
        "unityType": unitType,
        "showDateType": showDateType,
        "selectDateType": selectDateType,
        "startTime": startTime,
        "endTime": endTime
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyQueryV2/GetPointerEnergyQuery',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            if(ifShowLoading1){

                leftBottomChart1.showLoading({
                    maskColor: 'rgba(33,43,55,0.8)'
                });

                ifShowLoading1 = false;
            }

        },
        success:function(result){
            leftBottomChart1.hideLoading();
            //console.log(result);

            //判断是否返回数据
            if(result == null){

                option00.xAxis[0].data = [];
                option00.series[0].data = [];

                leftBottomChart1.setOption(option00);

                return false;
            }


            //首先处理本期的数据
            allData.length = 0;

            $(result.ecMetaDatas).each(function(i,o){
                allData.push(o);
            });

            //首先处理实时数据
            allDataX.length = 0;
            allDataY.length = 0;

            //绘制echarts
            if(showDateType == 'Hour' ){
                //确定x轴
                for(var i=0;i<allData.length;i++){
                    var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                    var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataJoin);
                    }
                }
            }else{
                //确定x轴
                for(var i=0;i<allData.length;i++){
                    var dataSplit = allData[i].dataDate.split('T')[0];

                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataSplit);
                    }
                }
            };

            //确定本期y轴
            for(var i=0;i<allData.length;i++){
                allDataY.push(allData[i].data.toFixed(1));
            }

            //echart柱状图
            option00.xAxis[0].data = allDataX;
            option00.series[0].data = allDataY;

            leftBottomChart1.setOption(option00);


        },
        error:function(jqXHR, textStatus, errorThrown){
            leftBottomChart1.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
        }
    })
};

//获取后台table表格中的数据
function getTableData(condition,dom){

    //传递给后台的参数
    var  ecParams = condition;

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'YWFZ/GetFroms',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){


        },
        success:function(result){

            var dataArr = packagingTableData(result[1]);

            //console.log(dataArr);

            //获取到table中数据
            var tableData = result[1].data;

            //拼接table中要展示的字符串
            var tableHtml = "";

            //遍历table中数据进行拼接
            $(tableData).each(function(i,o){

                tableHtml += "<tr>";

                 var lineArr = o;

                $(lineArr).each(function(i,o){

                    tableHtml += "<td>"+ o +"</td>";
                });

                tableHtml += "</tr>";
            });

            $(dom).find('tbody').html(tableHtml);
        },
        error:function(jqXHR, textStatus, errorThrown){
            leftBottomChart1.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
        }
    })
}


//获取电耗分项数据
function getFirstEnergyItemData(){

    //获取开始时间
    var startTime = getPostTime11()[0];

    //获取结束时间
    var endTime = getPostTime11()[1];


    //传递给后台的数据
    var ecParams = {
        "startTime": startTime,
        "endTime": endTime,
        "energyItemType": '01',
        "pointerIDs":  curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetFirstEnergyItemData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            if(ifShowLoading2){

                _useelectricityChart.showLoading({
                    maskColor: 'rgba(33,43,55,0.8)'
                });

                ifShowLoading2 = false;
            }

        },
        success:function(result){

            //console.log(result);

            _useelectricityChart.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //存放能耗数据
            var dataArr = [];

            //存放图例中数据
            var legendArr = [];

            var allData = 0;

            $(result).each(function(i,o){

                //if(i > 2){
                //    return false;
                //}
                var obj = {};
                //获取能耗数据
                obj.value = o.energyItemValue.toFixed(1);

                allData += parseFloat(o.energyItemValue.toFixed(1));
                //获取能耗名称
                obj.name = o.energyItemName;

                dataArr.push(obj);

                //给图例中存储数据
                legendArr.push(o.energyItemName);
            });

            //数据赋值
            option8.series[0].data = dataArr;

            //图例赋值
            option8.legend.data = legendArr;

            option8.title.text = allData.toFixed(1);

            option8.title.subtext = '总电量';
            //页面重绘数据
            _useelectricityChart.setOption(option8,true);

        },
        error:function(jqXHR, textStatus, errorThrown){
            _useelectricityChart.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    });
};

//重新绘制echarts方法
function drawEcharts(dataArr,echartsID,colorArr,centerData,option,unit){

    //定义总数
    var allData = 0;

    //如果是温度和湿度
    if(echartsID == 'equipment-chart-rotating1'){

        allData = 70;

     //如果是冷热源 电数据
    }else if(echartsID == 'equipment-chart-electricity'){

        //如果是夏季
        if(getSeason() == 1){

            allData = 5752;

        }else{

            allData =13630 * 2;
        }

        //如果是冷热源 汽数据
    }else if(echartsID == 'equipment-chart-electricity1'){

        //如果是夏季
        if(getSeason() == 1){

            allData = 9496;

        }else{

            allData =13630 * 2;
        }

    }else{

        if(colorArr == colorArr1){

            allData = dataArr[0].data * 1.5;

        }else{
            allData = centerData.data;
        }
    }


    //定义图例集合
    var legendArr = [];

    $(dataArr).each(function(i,o){

        var value1;

        var value2;

        if(unit != ''){

            if(dataArr[i].data){
                value1 = dataArr[i].data.toFixed(2);
                value2 = (allData - dataArr[i].data).toFixed(2);
            }

        }else{
            value1 = dataArr[i].data;
            value2 = allData - dataArr[i].data;
        }

        var data = [
            {
                value:value1,
                name:dataArr[i].name,
                itemStyle: {
                    normal : {
                        color: colorArr[i]
                    }
                }

            },
            {
                value: value2,
                name:'',
                itemStyle : placeHolderStyle
            }
        ];

        //图例赋值
        legendArr.push(dataArr[i].name);

        //数据赋值
        option.series[i].data = data;

        //echart图开始处的展示数据
        if(allData != 0){

            var thisData = 0;

            if(colorArr == colorArr1){

                thisData = dataArr[i].data.toFixed(1);

            }else{

                thisData = dataArr[i].data;
            }

            if(echartsID == 'equipment-chart-rotating1' && i == 1){

                    $('#'+ echartsID).prev('.bottom-content-data').find('span').eq(i).html(thisData+'%');

            }else{
                $('#'+ echartsID).prev('.bottom-content-data').find('span').eq(i).html(thisData+unit);
            }


        }else{

            $('#'+ echartsID).prev('.bottom-content-data').find('span').eq(i).html('0');

        }


    });
    //改变中间显示的文字
    if(unit != ''){

        if(typeof centerData.data == 'number'){

            option.title.text = (centerData.data).toFixed(1);

        }else{
            option.title.text = centerData.data;
        }


    }else{
        option.title.text = centerData.data;
    }


    option.title.subtext = centerData.name;

    option.legend.data = legendArr;

    //运维中有关运行 故障的数据
    if(colorArr != colorArr1){

        //当前总台数
        var totalNum = centerData.data;

        //运行台数
        var runNum = dataArr[0].data;

        option.title.text = (runNum/totalNum * 100).toFixed(1) + "%";

        if(totalNum == 0){
            option.title.text =  "0.0%";
        }

        option.title.subtext = centerData.name +" "+ totalNum;
    }

    //重绘echarts
    var thisCharts = echarts.init(document.getElementById(echartsID));

    thisCharts.setOption(option,true);

};




