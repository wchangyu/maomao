/**
 * Created by admin on 2017/12/5.
 */
$(function(){

    //点击选中某个报表时
    $('.statement').on('click','.statement-contain',function(){

        $(".statement-contain").removeClass('curClick');

        $(this).addClass('curClick');
    });

});