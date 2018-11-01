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
            '<option value="0">1#柴发</option>' +
            '<option value="1">2#柴发</option>' +
            '<option value="2">3#柴发</option>' +
            '<option value="3">4#柴发</option>' +
            '</select>' +
            '</span>' +
            '</p>' +


            '<p>' +
            '<span class="name">Ua(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="red-data" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">Ub(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="red-data" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">Uc(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="red-data" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">La(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="red-data" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">Lb(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="red-data" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">Lc(A)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">PF</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">P(KW)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">转速(RPM)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">油压(MPA)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">水温(℃）</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="25">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">电池电压(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="26">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">励磁电压(V)</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="26">' +
            '</span>' +
            '</p>' +

            '<p>' +
            '<span class="name">启动次数</span>' +
            '<span class="data">' +
            '<input type="text" class="imaginary" value="0">' +
            '</span>' +
            '</p>' +


            '</div>';


    }

    //页面赋值
    $('.right-navigation .bottom-data-container ').html(dataHtml);

}






