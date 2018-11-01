/**
 * Created by admin on 2018/10/22.
 */
$(function(){

    //页面绘制右侧数据
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


//页面绘制右侧数据
function drawSpaceData(){

    //定义存放页面中的字符串
    var dataHtml = '';

    for(var i=1; i<spaceDataLength; i++){

        var thisName = 'K'+i;

        dataHtml +=

            '<div class="data-container">' +
                '<h3>'+thisName+' 精密空调</h3>' +
                '<p>' +
                '<span class="name">控制</span>' +
                '<span class="data">' +
                '<select name="" id="">' +
                '<option value="0">超节能</option>' +
                '<option value="1">一般节能</option>' +
                '</select>' +
                '</span>' +
                '</p>' +
                '<p>' +
                '<span class="name">运行状态</span>' +
                '<span class="data">' +
                '<input type="text" class="state" value="ON">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">湿度设定值</span>' +
                '<span class="data">' +
                '<input type="text" class="" value="60%">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">送风温度设定</span>' +
                '<span class="data">' +
                '<input type="text" class="" value="18℃">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">送风温度</span>' +
                '<span class="data">' +
                '<input type="text" class="green-data" value="18℃">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">送风湿度</span>' +
                '<span class="data">' +
                '<input type="text" class="green-data" value="50%">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">回风温度</span>' +
                '<span class="data">' +
                '<input type="text" class="imaginary" value="22℃">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">风机频率</span>' +
                '<span class="data">' +
                '<input type="text" class="imaginary" value="45HZ">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">电动阀开度</span>' +
                '<span class="data">' +
                '<input type="text" class="imaginary" value="70%">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">加湿开度</span>' +
                '<span class="data">' +
                '<input type="text" class="imaginary" value="10%">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">风机报警</span>' +
                '<span class="data">' +
                '<span class="green-ball imaginary"><font></font></span>' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">滤网压差报警</span>' +
                '<span class="data">' +
                '<span class="green-ball imaginary"><font></font></span>' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">持续运行时间</span>' +
                '<span class="data">' +
                '<input type="text" class="imaginary" value="2500">' +
                '</span>' +
                '</p>' +

                '<p>' +
                '<span class="name">总运行时间</span>' +
                '<span class="data">' +
                '<input type="text" class="imaginary" value="87600">' +
                '</span>' +
                '</p>' +

            '</div>';


    }

    //页面赋值
    $('.right-navigation .bottom-data-container ').html(dataHtml);

}






