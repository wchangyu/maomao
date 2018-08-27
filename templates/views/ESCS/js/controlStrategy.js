$(function(){

    $('.control-cell').hover(function(){


        $(this).css({

            color:'#75a6f8'

        })

        var background = $(this).css('background');

        var strSplit = background.split('.')

        var newBackground = strSplit[0] + '_hover.' + strSplit[1];

        $(this).css('background',newBackground);

        var index = $(this).attr('data-attr');

        $('.control-right-cell').eq(index).css('color','#75a6f8');


    },function(){

        $(this).css({

            color:'#3c3c3c'

        })

        var background = $(this).css('background');

        var strSplit = background.split('_hover');

        var newBackground = strSplit[0]  + strSplit[1];

        $(this).css('background',newBackground);

        $('.control-right-cell').css('color','#3c3c3c');

    })

})