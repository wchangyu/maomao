/**
 * Created by admin on 2018/10/16.
 */
$(function(){

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

    //点击控制图触发事件
    $('.control-container div').on('click',function(){

        //添加选中类名
        $(this).parent().find('div').removeClass('onChoose');

        $(this).addClass('onChoose');

        //点击切换冷站控制中不同的图标
        switchIcon($('.control-container'));

    });

    //切换左上角冷站或者空调时
    $('.left-title1 .userMonitor-name').on('click',function(){

        //获取当前是冷站还是机房 0冷站 1机房
        var type = $(this).attr('data-type');

        if(type == 0){

            $('.cold-control-container').show();

            $('.machine-control-container').hide();

            $('.right-alarm').show();

        }else{

            $('.cold-control-container').hide();

            $('.machine-control-container').show();

            $('.right-alarm').hide();
        }

        //获取当前流程图ID
        var userMonitorID = $(this).attr('data-monitor');

        sessionStorage.menuArg = '1,' + userMonitorID;

        //获取对应流程图
        userMonitor.init(false,false,1,$('.left-diagram'));
    });

    $('.left-title1 .userMonitor-name').eq(0).click();

    //当窗口大小变化时，使图表大小跟着改变
    window.onresize = function () {

        if(efficiencyChart ){

            efficiencyChart.resize();
        }
    };

});


//点击切换冷站控制中不同的图标
function switchIcon(dom){

    //获取子项长度
    var domLength = dom.find('.control-patch').length;

    for(var i=0; i<domLength; i++){

        var thisDom = dom.find('.control-patch').eq(i);

        //获取当前图片名称
        var imgName = thisDom.find('img').attr('data-img');

        //如果是ai控制
        if(imgName == 'ai'){

            window.location.href = '../ESCS/controlStrategy.html';

        }

        //定义当前展示图片
        var imgUrl = 'img/';

        //如果选中
        if(thisDom.hasClass('onChoose')){

            imgUrl += imgName + '2.png';

        }else{

            imgUrl += imgName + '1.png';

        }

        thisDom.find('img').attr('src',imgUrl);

    }
}


//-----------------------------------实时能效-------------------------------------//

var efficiencyChart = echarts.init(document.getElementById('efficiency-echart'));

var efficiencyOption ={
    title: {
        text: 'kwh',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal',
            lineHeight:'14',
            color:'#757575'
        },
        itemGap:1,
        textBaseline:'middle',
        subtext:'供冷量',
        subtextStyle:{
            color:'#333',
            lineHeight:'16'
        },
        x:'center',
        bottom:'4'
    },
    tooltip : {
        formatter: "{a} {b} : {c}"
    },
    series: [
        {
            name: 'RTI',
            type: 'gauge',
            radius: '92%',
            min: 0,
            max:9,
            splitNumber: 15,
            axisTick: {            // 坐标轴小标记
                length: 8,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 11,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                show:true,
                padding: [0, 0, 0, -4],
                formatter: function (value) {
                    // return value.toFixed(1);
                    return value;
                }
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式

                    color: [[0.2, '#E93C94'], [0.4, '#E1C649'],[0.55, '#31BEA4'], [1, '#4B85E5']],
                    width: 6
                }
            },
            data: [{value:4.5}]
        }
    ]
};

//页面赋值
efficiencyChart.setOption(efficiencyOption,true);



