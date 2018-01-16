/**
 * Created by admin on 2017/12/5.
 */
$(function(){

    //点击选中某个报表时
    $('.statement').on('click','.statement-contain',function(){

        $(".statement-contain").removeClass('curClick');

        $(this).addClass('curClick');

        //获取路径
        var url = $(this).find('a').attr('href');

        //打开对应的报表导出页面
        window.open(url);

    });

});