$(function(){

    //协同联动是否启用
    $('.button-control').click(function(){

        //看是否包含button-on类

        if($(this).hasClass('button-on')){

            $(this).removeClass('button-on').addClass('button-off');

        }else{

            $(this).removeClass('button-off').addClass('button-on');

        }


    })

})