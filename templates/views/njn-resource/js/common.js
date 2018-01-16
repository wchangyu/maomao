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


//右侧表格中的下方柱状图
var rightTableChart = echarts.init(document.getElementById('right-bottom-echart1'));


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



//给table中echart循环赋值
echartAssignment();

function echartAssignment(){

    //获取需要赋值的数量
    var length = $('.right-bottom-table .right-bottom-echart').length;

    for(var i=0; i<length; i++){

        //获取当前ID
        var id = $('.right-bottom-table .right-bottom-echart').eq(i).attr('id');

        var rightTableChart = echarts.init(document.getElementById(id));

        rightTableChart.setOption(option1);
    }
}


