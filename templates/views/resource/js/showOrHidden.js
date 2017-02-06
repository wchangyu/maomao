$(function(){
    //点击箭头移动
    $('.showOrHidden').click(function(){
        var o1 = $(".content-main-left").css("display");
        if(o1 == 'block'){
            $('.content-main-left').hide()
            $('.content-main-right').removeClass('col-lg-9 col-md-8').addClass('col-lg-12 col-md-12');
            $('.showOrHidden').css({
                'background':'url("./work_parts/img/show.png")no-repeat',
                'background-size':'20px',
                'background-position':'center'
            })
        }else if(o1 == 'none'){
            $('.content-main-left').show();
            $('.content-main-right').removeClass('col-lg-12 col-md-12').addClass('col-lg-9 col-md-8');
            $('.showOrHidden').css({
                'background':'url("./work_parts/img/hidden.png")no-repeat',
                'background-size':'20px',
                'background-position':'center'
            })
        }
    })
})