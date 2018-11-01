/**
 * Created by admin on 2018/10/24.
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


});

//-----------------------------------UPS监控参数-------------------------------------//


//定义数组长度
var spaceDataLength = 2;


//页面绘制右侧数据
function drawSpaceData(){

    //定义存放页面中的字符串
    var dataHtml = '';

    for(var i=1; i<spaceDataLength; i++){

        var thisName = 'K'+i;

        dataHtml +=

            '<div class="data-container">' +
            '<p>' +
            '<span class="data">' +
            '<select name="" id="">' +
            '<option value="0">UPS1</option>' +
            '<option value="1">UPS2</option>' +
            '<option value="0">UPS1</option>' +
            '<option value="1">UPS2</option>' +
            '</select>' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输入Ua(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="220">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输入Ub(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="223">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输入Uc(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="225">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输出Ua(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="220">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输出Ub(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="220">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输出Uc(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="220">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输入La(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="50">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输入Lb(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="50">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输入Lc(A)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="50">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输入频率</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="50">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">输出频率</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="50">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">电度(KW)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="1750">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">旁路电压</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">旁路电流</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">整流器故障</span>' +
            '<span class="data">' +
            '<span class="green-ball imaginary"><font></font></span>' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">逆变器故障</span>' +
            '<span class="data">' +
            '<span class="green-ball imaginary"><font></font></span>' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">旁路故障</span>' +
            '<span class="data">' +
            '<span class="green-ball imaginary"><font></font></span>' +
            '</span>' +
            '</p>' +


            '</div>';


    }

    //页面赋值
    $('.right-navigation .bottom-data-container ').html(dataHtml);

}






