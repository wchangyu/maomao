/**
 * Created by admin on 2018/10/25.
 */

$(function(){

    //点击切换上方按钮
    $('.top-title .userMonitor-name').on('click',function(){

        $('.top-title .userMonitor-name').removeClass('onChoose');

        $(this).addClass('onChoose');
    });

});