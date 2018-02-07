/**
 * Created by admin on 2018/2/6.
 */
$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //获取当前时间
    var curDate = moment().format('YYYY-MM-DD');

    $('.datatimeblock').val(curDate);


    //树状图初始化
    $.fn.zTree.init($("#treeMultiple"), setting, zNodes);

    //默认选中第一个
    $('#treeMultiple_1_a').addClass('curSelectedNode');


    //总表用电趋势
    leftBottomChart.setOption(leftBottomOption);

    //用电分项
    _useelectricityChart.setOption(useelectricityoption);
});

var setting = {
    //check: {
    //    enable: true,
    //    chkStyle: "radio",
    //    chkboxType: { "Y": "s", "N": "ps" },
    //    radioType : "all"
    //},
    data: {
        key:{
            name:'name'
        },
        simpleData: {
            enable: true
        }
    },
    view:{
        showIcon:false
    },
    callback: {
        beforeClick: function(treeId, treeNode) {
            $('#treeMultiple_1_a').removeClass('curSelectedNode');
            //var zTree = $.fn.zTree.getZTreeObj("treeMultiple");
            //if (treeNode.isParent) {
            //    zTree.expandNode(treeNode);
            //    return false;
            //} else {
            //    demoIframe.attr("src",treeNode.file + ".html");
            //    return true;
            //}
        }
    }
};

var zNodes =[
    {id:110000, pId:0, name:"总表用电", open:true},
    {id:11001801, pId:110000, name:"空调用电"},
    {id:11001802, pId:110000, name:"动力用电"},
    {id:11001801, pId:110000, name:"特殊用电"},
    {id:11001801, pId:110000, name:"分项合计"},


    {id:110001, pId:0, name:"总表用电", open:true},
    {id:12001801, pId:110001, name:"门诊类"},
    {id:12001802, pId:110001, name:"急诊类"},
    {id:12001801, pId:110001, name:"医技类"},
    {id:12001801, pId:110001, name:"住院类"},
    {id:12001801, pId:110001, name:"科技类"},
    {id:12001801, pId:110001, name:"教学类"},
    {id:12001801, pId:110001, name:"行政类"},
    {id:12001801, pId:110001, name:"后勤类"},
    {id:12001801, pId:110001, name:"其他"},
    {id:12001801, pId:110001, name:"分项合计"},
    {id:12001801, pId:110001, name:"用电末端聚合值"}

];


//左侧下方柱状图
var leftBottomChart = echarts.init(document.getElementById('electricity-echart'));

var leftBottomOption = {
    color:['#16c7bd','#52bcfe','#ff9b4b'],
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
        top:'9%',
        containLabel: true,
        borderColor:'#A8A8A8',
        borderWidth:2
    },
    legend:{

        data:['今日','昨日','前日']
    },
    xAxis : [
        {
            type : 'category',
            data : ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00'],
            axisTick: {
                alignWithLabel: true
            },
            boundaryGap: false,//从起点开始
            nameTextStyle:{
                color:'#DCF1FF'
            },
            nameGap:1
            //axisLine:{
            //    lineStyle:{
            //        color:'#DCF1FF'
            //    }
            //}
        }
    ],
    yAxis : [
        {
            type : 'value',
            //nameTextStyle:{
            //    color:''
            //},
            nameLocation:'end',
            axisLine:{
                lineStyle:{
                    //color:'#DCF1FF'
                }
            }
        }
    ],
    series : [
        {
            name:'今日',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            //smooth:true,
            itemStyle:{

            },
            data:[91250,86250,97250,93630,92350,59620,65894,75628,86528,78965,86942,91256,84268,78952,86574,92568]
        },
        {
            name:'昨日',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            //smooth:true,
            itemStyle:{

            },
            data:[76850,93250,91250,76630,58350,79720,96894,82628,61528,84965,51942,88256,91268,56952,81574,74568]
        },
        {
            name:'前日',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            //smooth:true,
            itemStyle:{

            },
            data:[81850,76250,68250,69630,61350,52620,83894,79628,90528,64965,86942,82256,81268,60952,76574,94568]
        }
    ]
};



//用电分项echart图
var _useelectricityChart = echarts.init(document.getElementById('subentry-echart'));

// 指定图表的配置项和数据 用于本日用能分项
var useelectricityoption = {
    title: {
        text: '分项用能合计',
        subtext: '214586kWh',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: '150',
        top: '152',
        itemGap: 5,
        textBaseline:'middle',
        textStyle : {
            color : '#999',
            fontFamily : '微软雅黑',
            fontSize : 18,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color : 'black',
            fontWeight : 'bolder',
            fontSize : 16,
            lineHeight:26
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
        data:['照明插座用电','空调用电','动力用电','特殊用电']

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['50%', '70%'],
            center:['60%', '60%'],
            avoidLabelOverlap: false,
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#16c7bd','#52bcfe','#ffcc03','#ff9b4b'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : true,
                        formatter:'{d}'+'%'+ '\n{b}'
                    },
                    labelLine : {
                        show : true

                    }
                },
                emphasis : {
                    label : {
                        show : true,
                        position : 'center',
                        textStyle : {
                            fontSize : '20',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            data:[
                {
                    name:'照明插座用电',
                    value:124586
                },
                {
                    name:'空调用电',
                    value:64586
                },
                {
                    name:'动力用电',
                    value:34000
                },
                {
                    name:'特殊用电',
                    value:11530
                }
            ]
        }
    ]
};



