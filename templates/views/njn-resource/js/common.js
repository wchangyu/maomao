/**
 * Created by admin on 2018/1/12.
 */

//点击左侧下方选项卡
$('.left-tab-container .left-tab').on('click',function(){

    //删除之前选中的类
    for(var i=0; i< $('.left-tab-container .left-tab').length; i++){

        //获取当前的类名
        var className = 'left-tab-choose'+i;

        //删除对应的类名
        $('.left-tab-container .left-tab').eq(i).removeClass(className);
    }

    //获取当前点击的index
    var onIndex = $(this).index();

    //当前选中后对应的类名
    var onClassName = 'left-tab-choose'+onIndex;

    //给当前选中元素添加选中类名
    $(this).addClass(onClassName);

});

//点击左侧日月年切换
$('.left-tab-container .right-tab').on('click',function(){

    //删除之前选中的类
    $('.left-tab-container .right-tab').removeClass('right-tab-choose');

    //给当前选中元素添加选中类名
    $(this).addClass('right-tab-choose');

});


//左侧下方柱状图
var leftBottomChart = echarts.init(document.getElementById('echarts-left-bottom'));

var option = {
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
        top:'2%',
        containLabel: true,
        borderColor:'#A8A8A8',
        borderWidth:2
    },
    xAxis : [
        {
            type : 'category',
            data : ['1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12'],
            axisTick: {
                alignWithLabel: true
            },
            nameTextStyle:{
                color:'#DCF1FF'
            },
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
            axisLine:{
                lineStyle:{
                    color:'#DCF1FF'
                }
            }
        }
    ],
    series : [
        {
            name:'直接访问',
            type:'bar',
            barWidth: '60%',
            data:[810, 952, 900, 934, 890, 730, 1020, 952, 900, 934, 890, 730]
        }
    ]
};

var option1 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'访问来源',
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

//获取全部楼宇ID列表
var pointerIdArr = getPointersId();

//获取全部分户ID列表
var officeIdArr = getOfficesId();


//重绘chart图
leftBottomChart.setOption(option);

//点击右侧上方选项卡
$('.right-tab-container .right-tab').on('click',function(){

    //获取选项卡的长度
    var tabLength = $('.right-tab-container .right-tab').length;

    //删除之前选中的类
    for(var i=0; i< tabLength; i++){

        //获取当前的类名
        var className;

        //中间的选项卡
        if( i>0 && i<tabLength -1 ){

            className = 'right-tab-choose1';
        //第一个选项卡
        }else if(i == 0){

            className = 'right-tab-choose0';
        //最后一个选项卡
        }else{

            className = 'right-tab-choose2';
        }

        //删除对应的类名
        $('.right-tab-container .right-tab').eq(i).removeClass(className);
    }

    //获取当前点击的index
    var onIndex = $(this).index();

    //当前选中后对应的类名
    var onClassName;
    //中间的选项卡
    if(onIndex > 0 && onIndex < tabLength - 1){

        onClassName = 'right-tab-choose1';
    //第一个选项卡
    }else if(onIndex == 0){

         onClassName = 'right-tab-choose0';
        //最后一个选项卡
    }else{

         onClassName = 'right-tab-choose2';
    }


    //给当前选中元素添加选中类名
    $(this).addClass(onClassName);

});


//点击右侧主体内容中的选项卡
$('.right-bottom-tab-container .right-bottom-tab').on('click',function(){

    //删除之前选中的类
    $('.right-bottom-tab-container .right-bottom-tab').removeClass('right-bottom-tab-choose');

    //给当前选中元素添加选中类名
    $(this).addClass('right-bottom-tab-choose');

});

//点击右上角切换选项卡
$('.right-bottom-top-tab span').on('click',function(){

    $('.right-bottom-top-tab span').removeClass('onChoose');

    $(this).addClass('onChoose');

    //获取当前index
    var index = $(this).index();

    //显示选项卡对应的内容
    $('.right-bottom-container').hide();

    $('.right-bottom-container').eq(index).show();

});

//页面右上角时间刷新
getNowTime();

//获取温度湿度
getWeatherParam();


//关闭弹窗中的流程图
$('#right-container').on('click','.close1',function(){

    //获取到要删除的元素
    var dom = $(this).parents('.content-child-show');

    dom.remove();
});

//------------------------------------页面右上角时间温度-----------------------------------//

//获取实时时间
function getNowTime(){


    var time1 = moment().format('HH:mm:ss');

    var time2 = moment().format('YYYY-MM-DD');

    $('.right-top-message-container .top-message').eq(0).html(time1);

    $('.right-top-message-container .bottom-message').eq(0).html(time2);

    setTimeout(function(){

        getNowTime();

    },1000)
};

//获取当年气象参数
function getWeatherParam(){

    //传递给后台的数据
    var ecParams = {
        pointerID : pointerIdArr[0]
    };
    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetWeatherByPointer',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result){

            //console.log(result);
            //无数据
            if(result == null || result.length == 0){
                //隐藏温度 和湿度
                $('.right-top-message-container .top-message').eq(1).html(18 + '℃');

                //湿度
                $('.right-top-message-container .top-message').eq(2).html(56 + "%");

                return false;
            }
            //给页面中赋值
            //温度
            $('.right-top-message-container .top-message').eq(1).html(result.temperatureData + '℃');

            //湿度
            $('.right-top-message-container .top-message').eq(2).html(result.humidityData + "%");

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

//从本地存储中获取楼宇ID列表
function getPointersId(){

    //存放楼宇ID列表
    var pointerIdArr = [];

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));


    $(pointerArr).each(function(i,o){

        pointerIdArr.push(o.pointerID);
    });

    return pointerIdArr;
};

//从本地存储中获取分户ID列表
function getOfficesId(){

    //存放分户ID列表
    var officeIdArr = [];

    var officeArr = $.parseJSON(sessionStorage.getItem('offices'));


    $(officeArr).each(function(i,o){

        officeIdArr.push(o.f_OfficeID);
    });

    return officeIdArr;
};




