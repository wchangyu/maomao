$(function(){
    //点击箭头移动
    $('.showOrHidden').click(function(){
        var o1 = $(".content-main-left").css("display");
        console.log(o1);
        if(o1 == 'block'){
            $('.content-main-left').css({
                display:'none'
            })
            $('.content-main-right').animate({
                'margin-left':'0px'
            },100)
            $('.showOrHidden').css({
                'background':'url("./work_parts/img/show.png")no-repeat',
                'background-size':'20px',
                'background-position':'center'
            })
        }else if(o1 == 'none'){

            $('.content-main-right').animate({
                'margin-left':'300px'
            },100,function(){
                $('.content-main-left').css({
                    display:'block'
                })
                $('.showOrHidden').css({
                    'background':'url("./work_parts/img/hidden.png")no-repeat',
                    'background-size':'20px',
                    'background-position':'center'
                })
            })
        }
    })
})