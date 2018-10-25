/**
 * Created by admin on 2018/10/22.
 */

$(function(){

    //页面下方统计信息
    drawSpaceData();

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

    //切换左上角冷站或者空调时
    $('.left-title1 .userMonitor-name').on('click',function(){


        //获取当前流程图ID
        var userMonitorID = $(this).attr('data-monitor');

        sessionStorage.menuArg = '1,' + userMonitorID;

        //获取对应流程图
        userMonitor.init(false,false,1,$('.left-diagram'));

    });



});

//-----------------------------------极早烟雾报警-------------------------------------//


//定义数组长度
var spaceDataLength = 12;

//页面绘制下方统计信息
function drawSpaceData(){

    //定义存放页面中的字符串
    var dataHtml = '';

    for(var i=1; i<spaceDataLength; i++){

        var thisName = 'M'+i +' 门';

        var num1 = (Math.random() * 10).toFixed(0);

        var num2 = (Math.random() * 15).toFixed(0);

        dataHtml +=
            '<p>' +
                '<span class="name">'+thisName+'</span>' +
                '<span class="door-num">'+num1+'</span>' +
                '<span class="door-num1">'+num2+'</span>' +
            '</p>';

    }

    //页面赋值
    $('.right-alarm .bottom-specific-data ').html(dataHtml);

}






