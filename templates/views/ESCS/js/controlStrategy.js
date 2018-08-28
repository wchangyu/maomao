$(function(){

    $('.control-cell').hover(function(){


        $(this).css({

            color:'#75a6f8'

        })

        var background = $(this).css('background');

        var strSplit = background.split('.')

        var newBackground = strSplit[0].replace('rgb(250, 249, 249)','rgb(198, 215, 238)') + '_hover.' + strSplit[1];

        $(this).css('background',newBackground);

        var index = $(this).attr('data-attr');

        $('.control-right-cell').eq(index).css('color','#75a6f8');


    },function(){

        $(this).css({

            color:'#3c3c3c'

        })

        var background = $(this).css('background');

        var strSplit = background.split('_hover');

        var newBackground = strSplit[0].replace('rgb(198, 215, 238)','rgb(250, 249, 249)')  + strSplit[1];

        $(this).css('background',newBackground);

        $('.control-right-cell').css('color','#3c3c3c');

    })

    $('.control-cell').click(function(){

        var prm = $(this).attr('data-arg');

        //将值传到session中
        sessionStorage.arg1 = prm;

        window.location.href = '../yongnengjiance/energyMonitor_ESCS.html?a=9'


    })


})