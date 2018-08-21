$(function(){

    //根据屏幕大小，尽量正好放下
    var h = document.documentElement.clientHeight || document.body.clientHeight;

    //可见高度-46（title）-35（padding）-32（操作台div）-36-50-41-33

    var cellH = (h - 293)/2;

    $('.portlet-body').children().height(cellH);

    //方法后
    $('.tools').on('click','.fullscreen',function(){

        var h1 = document.documentElement.clientHeight || document.body.clientHeight;

        var hs = (h1-41-20)*0.5;

        $(this).parents('.portlet').find('img').css({'height':hs,'display':'block'});

    })

    //缩小后
    $('.tools').on('click','.on',function(){

        $('.portlet-body').children().css('height',cellH);

        $(this).parents('.portlet').find('img').css({'height':cellH*0.9,'display':'block'});

    })

})