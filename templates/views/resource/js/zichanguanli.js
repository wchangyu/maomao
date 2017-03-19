$(function(){
    /*新增资产*/
    $('.btn2').click(function(){
        markSize();
        $('.gongdanMark').show();
    })
    //遮罩大小改变
    function markSize (){
        var markWidth = document.documentElement.clientWidth;
        var markHeight = document.documentElement.clientHeight;
        var markBlockWidth = $('.gongdanMarkBlock').width();
        var markBlockHeight = $('.gongdanMarkBlock').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        var markBlockLeft = (markWidth - markBlockWidth)/2;
        $('.gongdanMark').css({'width':markWidth,'height':markHeight});
        $('.gongdanMark').show();
        $('.gongdanMarkBlock').css({'top':markBlockTop,'left':markBlockLeft});
    }
    //关闭按钮
    $('.closes').click(function(){
        $('.gongdanMark').hide();
    })
    $('.closee').click(function(){
        $('.gongdanMark').hide();
    })
    /*窗口改变遮罩也改变*/
    window.onresize = function(){
        var display =  $('.gongdanMark')[0].style.display;
        if(display == 'block'){
            markSize ();
        }
    }
})