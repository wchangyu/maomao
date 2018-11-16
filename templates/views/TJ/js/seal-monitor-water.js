/**
 * Created by admin on 2018/10/22.
 */

$(function(){

    //页面绘制水浸状态
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

//-----------------------------------水浸状态-------------------------------------//


//定义数组长度
var spaceDataLength = 12;

//定义内容
var contentArr = ['通讯状态','断裂报警','漏水报警'];

//存放状态值 0为全部正常
var stateArr = [0,2,0,0,0,2,1,2,0,3,0];

//当前索引
var thisIndex = 0;

//页面绘制水浸状态
function drawSpaceData(){

    //定义存放页面中的字符串
    var dataHtml = '';

    for(var i=1; i<spaceDataLength; i++){

        var thisName = 'S'+i;

        //定义内容字符串
        var contentHtml = '';

        var stateValue = stateArr[thisIndex];

        //定义报警位置
        var alarmLocation = '--';

        if(stateValue != 0){

            alarmLocation = i +'.0米';
        }

        $(contentArr).each(function(k,j){

            var num = stateValue - 1;

            if(num != k){

                contentHtml += '<p>'+j+'</p>';

            }else{

                contentHtml += '<p class="alarm-data">'+j+'</p>';

            }
        });

        thisIndex ++;


        dataHtml +=
            '<div class="data-container">' +
                '<h3>'+thisName+' 漏水状态</h3>' + contentHtml +
                '<p class="location">在第<span class="">'+alarmLocation+'</span>的位置有报警</p>'+
            '</div>';


    }

    //页面赋值
    $('.right-navigation .bottom-data-container ').html(dataHtml);

}






