$(function(){
    //点击箭头移动
    $('.showOrHidden').click(function(){
        if($('.content-main-left').width() >= 200){
            $('.content-main-left').animate({
                'width':'0px',
            },50,function (){
                $('.showOrHidden').css({
                    'background':'url("./work_parts/img/show.png")no-repeat',
                    'background-size':'20px',
                    'background-position':'center'
                })
                $('.content-main-left').css({
                    'border':'none'
                })
            })
            $('.content-main-right').animate({
                'margin-left':'0px'

            },50)
        }else{
            $('.content-main-left').animate({
                'width':'280px',
            },50,function (){
                $('.showOrHidden').css({
                    'background':'url("./work_parts/img/hidden.png")no-repeat',
                    'background-size':'20px',
                    'background-position':'center'
                })
                $('.content-main-left').css({
                    'border':'1px solid #ccc'
                })
            })
            $('.content-main-right').animate({
                'margin-left':'300px'
            },50)
        }
    })
})