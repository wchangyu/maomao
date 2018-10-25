/**
 * Created by admin on 2018/10/24.
 */
$(function(){

    //点击诊断内容
    $('.bottom-diagram-message').on('click','.specific-data',function(){

        $('#diagnostic-myModal').modal('show');


    });

    //诊断弹窗中确定按钮
    $('#diagnostic-myModal .bottom-btn span').on('click',function(){

        $('#diagnostic-myModal').modal('hide');

        _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'执行成功', '');

    });

    //页面加载动画
    diagramEchart.showLoading({});
    diagramEchart1.showLoading({});

    setTimeout(function(){

        diagramEchart.setOption(diagramOption,true);

        diagramEchart1.setOption(option0,true);

        diagramEchart.hideLoading({});
        diagramEchart1.hideLoading({});

        window.clearInterval(timer);

        $('.top-result-icon .bottom-message').html('扫描完成');

    },4000);

    //下方诊断内容
    addResultData();


    window.onresize = function () {

        if(diagramEchart ){

            diagramEchart.resize();

        }
    };

});

//定义评分
var gradeNum = 10;

//定时器
var timer = setInterval(function(){

    gradeNum ++ ;

    $('.top-result-icon .grade').html(gradeNum);

},60);

//诊断信息汇总
var diagramEchart = echarts.init(document.getElementById('diagram-echart'));

// 指定图表的配置项和数据 用于报警信息
var diagramOption = {

    tooltip:{
        trigger:'axis',
        axisPointer:{
            type:'shadow'
        },
        show:false,
        formatter:function (params) {
            var tar = params[1];
            var tars = params[0];
            return tar.name + '<br/>' + tar.seriesName + '  ' + tar.value + '<br/>' + tars.seriesName + '  ' + tars.value;
        }
    },
    toolbox:{
        show:false,
        feature:{
            mark:{show:true},
            dataView:{show:true, readOnly:false},
            restore:{show:true},
            saveAsImage:{show:true}
        }
    },
    grid:{
        left:'1%',
        right:'1%',
        bottom:'8%',
        top:"12%",
        borderColor:'#ccc',
        containLabel:true
    },
    xAxis:{
        show:'true',
        type : 'category',
        axisLabel: {
            color:'#959595' //刻度线标签颜色
        },
        axisLine:{
            show:false
        },
        axisTick:{
            show:false
        },
        data:['诊断超标数量','离线设备数量']
    },
    yAxis:{
        type:'value',
        axisLabel: {
            color:'#959595' //刻度线标签颜色
        },
        axisLine:{
            show:false
        },
        axisTick:{
            show:false
        }
    },
    series:[
        {
            name:'问题汇总',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:function(params){
                        var colorList = [
                            '#4B85E5','#E1C649', '#4D7AE1','#8A52E7','#D944DB', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    }
                }
            },
            data:[45,8],
            barMaxWidth:'100'
        }
    ]
};

// 问题数量
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
        data:[],
        textStyle:{
            color:'white'
        },
        show:false

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: '75%',
            center:['50%', '45%'],
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

                        return params.value
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
                    name:'紧急',
                    value:2
                },
                {
                    name:'一般',
                    value:6
                }
            ]
        }
    ]
};

//诊断信息汇总
var diagramEchart1 = echarts.init(document.getElementById('diagram-echart1'));


// 指定图表的配置项和数据 用于弹窗展示
var diagramOption2 = {

    tooltip:{
        trigger:'axis',
        axisPointer:{
            type:'shadow'
        },
        show:false,
        formatter:function (params) {
            var tar = params[1];
            var tars = params[0];
            return tar.name + '<br/>' + tar.seriesName + '  ' + tar.value + '<br/>' + tars.seriesName + '  ' + tars.value;
        }
    },
    toolbox:{
        show:false,
        feature:{
            mark:{show:true},
            dataView:{show:true, readOnly:false},
            restore:{show:true},
            saveAsImage:{show:true}
        }
    },
    grid:{
        left:'1%',
        right:'1%',
        bottom:'8%',
        top:"20%",
        borderColor:'#ccc',
        containLabel:true
    },
    legend: {
        orient : 'horizontal',
        left : 'center',
        y : 10,
        itemGap:8,
        data:['TA','TB','TC'],
        show:true,
        itemWidth:12,
        itemHeight:12,
        padding: 5,
        textStyle:{
            color:'#687EA2',
            fontSize:12
        }
    },
    xAxis:{
        show:'true',
        type : 'category',
        axisLabel: {
            color:'#959595' //刻度线标签颜色
        },
        data:['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00']
    },
    yAxis:{
        type:'value',
        axisLabel: {
            color:'#959595' //刻度线标签颜色
        }
    },
    series:[
        {
            name:'TC',
            type:'line',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#5BDEB6'
                }
            },
            data:[8,7,6,5,6,8,9,11,12,11,10,10.5]
        },
        {
            name:'TB',
            type:'line',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#4B85E5'
                }
            },
            data:[4,5,3,3,2,4,6,5,9,7,6,8]
        },
        {
            name:'TA',
            type:'line',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#F25B72'
                }
            },
            data:[5,2,4,2,3,4,6,7,8,6,5,8]
        }
    ]
};

//弹窗中温度趋势折线图
var diagramEchart2 = echarts.init(document.getElementById('diagnostic-data-echart'));

diagramEchart2.setOption(diagramOption2,true);

//页面诊断信息赋值
var diagnosticArr = ['2','1','1','2'];

//用于判断是否诊断完成
var resultNum = 0;

function addResultData(){

    //$('.bottom-diagram-message').showLoading();

    $(diagnosticArr).each(function(i,o){

        setTimeout(function(){

            $('.bottom-diagram-message').find('.bottom-specific-message').eq(resultNum).find('.trouble-num font').html(o);

            $('.bottom-diagram-message').find('.bottom-specific-message').eq(resultNum).find('.bottom-specific-data-container .specific-data').show();

            resultNum++;

            //诊断完成
            if(resultNum == diagnosticArr.length){

                //$('.bottom-diagram-message').hideLoading();

                resultNum = 0;
            }

        },1000 * (i+1));

    });

}

