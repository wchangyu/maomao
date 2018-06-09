/**
 * Created by admin on 2018/5/28.
 */
$(function(){

    getSeAreaHouseLight();

});

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    calculable : true,
    xAxis : [
        {
            show:true,
            type : 'category',
            data:['参考值','实际值']
        }
    ],
    yAxis : [
        {
            show : false,
            type : 'value'
        }
    ],
    series : [
        {
            name:'',
            type:'bar',
            data:[],
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            'blue','#ebc940'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : false
                    },
                    labelLine : {
                        show : false
                    }
                }
            },
            barMaxWidth: '12'
        }
    ]
};

var option1 = {
    title:{
        text:'30%',
        textStyle:{
            color:'#09D188',
            fontSize:8,
            fontWeight:'normal'
        },
        bottom:"22%",
        left:'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'占比',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#09D188','#B4B8BC'
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
                        show : true,
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
                {value:135, name:'直接访问'},
                {value:210, name:'邮件营销'}
            ]
        }
    ]
};

//页面右侧Table的表头集合
var titleArr = ['位置','回路数','开启回路占比','平均照度(lux)','功率 kW','灯具数量','累计运行时间(h)'];

//配置流程图页面中的区域位置
var monitorAreaArr = [
    {
        "areaName":"-9.6m",
        "areaId":"2"
    },
    {
        "areaName":"0.0m",
        "areaId":"3"
    },
    {
        "areaName":"12.4m",
        "areaId":"4"
    },
    {
        "areaName":"17.1m",
        "areaId":"15"
    },
    {
        "areaName":"19.1m",
        "areaId":"6"
    },
    {
        "areaName":"22.4m",
        "areaId":"7"
    },
    {
        "areaName":"28.4m",
        "areaId":"8"
    },
    {
        "areaName":"东北角配楼1层",
        "areaId":"9"
    },
    {
        "areaName":"东北角配楼2层",
        "areaId":"10"
    },
    {
        "areaName":"西南角配楼1层",
        "areaId":"11"
    },
    {
        "areaName":"西南角配楼2层",
        "areaId":"12"
    }
];

//-------------------------------------获取流程图右侧展示数据--------------------------//

//当前楼宇ID
var curPointerIDArr = ['3101800201'];

//定义当前的设备类型 站房照明为21
var devTypeID = 21;

var url = 'http://huaqin.vicp.io:25708/BEEWebAPIys/api/';

function getSeAreaHouseLight(){

    //传递给后台的数据
    var ecParams = {
        "devTypeID": devTypeID,
        "pointerID": curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:url+'NJNDeviceShow/GetSeAreaHouseLight',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            //leftBottomChart.showLoading();

        },
        success:function(result){

            //console.log(result);

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //绘制数据
            drawDataTableByResult(titleArr,result);

        },
        error:function(jqXHR, textStatus, errorThrown){
            //leftBottomChart.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};


//绘制页面右侧的table
function drawDataTableByResult(titleArr,areaDataArr){

    //定义title
    var titleHtml = '';

    $(titleArr).each(function(i,o){

        //拼接title的字符串
        titleHtml += '<th>'+o+'</th>';

    });

    //把title放入到table中
    $('.right-bottom-table thead tr').html(titleHtml);

    //定义tbody中内容
    var bodyHtml = '';

    //存放要放到页面中展示的内容
    var realShowArr = [];

    //绘制table中主体数据
    $(areaDataArr).each(function(i,o){

        //获取当前区域ID
        var areaID = o.areaInfo.areaID;

        //是否在页面中绘制的标识
        var isDraw = false;

        $(monitorAreaArr).each(function(k,o){
            //如果存在此区域ID 则允许重绘
            if(o.areaId == areaID){

                isDraw = true;
                return false;
            }
        });

        var runHour = parseInt(Math.random() * 10000);

        //如果不需要重绘 退出本次循环
        if(!isDraw){
            return true;
        }

        //将本项添加到页面要显示的内容中
        realShowArr.push(o);

        //拼接页面中的字符串
        bodyHtml +=
            '<tr>' +
            '<td>' +
            '<span class="green-patch">'+ o.areaInfo.areaName+'</span>' +
            '</td>' +

            '<td>'+o.devNum+'</td>' +
            ' <td>' +

            '<div class="right-bottom-echart" id="">' +

            '</div>' +

            '</td>' +

            '<td>' +

            '<div class="right-bottom-echart1" id="">' +

            '</div>' +

            '</td>' +

            '<td>' + o.elecPower.toFixed(1) +'</td>' +

            '<td>' + o.devNum*3 +'</td>' +
            '<td>' + runHour +'</td>' +
            '</tr>';
    });

    //把body放入到table中

    $('.right-bottom-table tbody').html( bodyHtml);

    //给echart图赋值
    echartReDraw(realShowArr);

};

//给右侧流程图循环赋值
function echartReDraw(realDataArr){

    //根据页面中展示的数据给echarts循环赋值
    $(realDataArr).each(function(i,o){

        //开启回路占比
        var openLoopProp = o.openLoopProp;

        //故障回路占比
        var alarmLoopProp = o.alarmLoopProp;

        //参考值
        var referenceData = o.illuminanceRefer;

        var realData = o.illuminanceAVG;

        optionBar.series[0].data = [referenceData,realData];

        //var dataArr = [openLoopProp,alarmLoopProp];

        var dataArr = [openLoopProp];

        var tableDom = document.getElementsByClassName('right-bottom-table')[0];

        var tbodyDom = tableDom.getElementsByTagName('tbody')[0];

        var trDom = tbodyDom.getElementsByTagName('tr')[i];

        var echartDom1 = trDom.getElementsByClassName('right-bottom-echart1')[0];

        var rightTableChart1 = echarts.init(echartDom1);

        rightTableChart1.setOption(optionBar,true);


        $(dataArr).each(function(k,o){

            var echartDom = trDom.getElementsByClassName('right-bottom-echart')[k];

            var data1 = (o * 100).toFixed(0);

            var data2 = 100 - data1;

            option1.series[0].data = [data1,data2];

            option1.title.text = data1+ '%';

            var rightTableChart = echarts.init(echartDom);

            rightTableChart.setOption(option1,true);

        });
    });

};