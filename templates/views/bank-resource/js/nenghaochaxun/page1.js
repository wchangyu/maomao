/**
 * Created by admin on 2017/5/22.
 */

$(document).ready(function() {

    // 基于准备好的dom，初始化echarts实例
    console.log('ok');
    var myChart = echarts.init(document.getElementById('energy-demand'));

    // 指定图表的配置项和数据
    var option = {
        title : {
            text: '未来一周气温变化',
            subtext: '纯属虚构'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['最高气温','最低气温']
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value} °C'
                }
            }
        ],
        series : [
            {
                name:'最高气温',
                type:'line',
                smooth:true,
                data:[11, 11, 15, 13, 12, 13, 10],
                itemStyle : {
                    normal : {
                        color:'#53f4db',
                        lineStyle:{
                            color:'#53f4db',
                            width:3
                        }
                    }
                },

                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'最低气温',
                type:'line',
                smooth:true,
                data:[1, -2, 2, 5, 3, 2, 0],
                itemStyle : {
                    normal : {
                        color:'#f07bc5',
                        lineStyle:{
                            color:'#f07bc5',
                            width:3
                        }
                    }
                },
                markPoint : {
                    data : [
                        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name : '平均值'}
                    ]
                }
            }
        ]
    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = function () {
        if(myChart ){
            myChart.resize();

        }
    };




    //点击查询按钮时，获取后台数据
    $('.condition-query .top-refer').on('click',function(){
        //获取查询条件
        var type = $('.condition-query li').eq(0).find('select').val();
        var time = $('.condition-query li').eq(1).find('select').val();
        var theArea = $('.condition-query li').eq(2).find('select').val();

        $('.show-title1').html(theArea);
        $('.show-title2').html(type);
        $('.show-title3').html(time);

        $('#choose-date').modal('show');

    })

});
//获取页面初始数据
function getStartData(){

    $.ajax({
        type: 'get',
        url: IP + "/UnitMeter/IsRelevanceData",
        async: false,
        timeout: theTimes,
        data:id,
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);
            postData = data;
            console.log(postData);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        }
    });

}

//自定义时间时
$('.custom-time').on('click',function(){

    $('#choose-date').modal('show');
});
