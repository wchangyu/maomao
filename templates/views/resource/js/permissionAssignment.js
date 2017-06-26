$(function(){
    /*--------------------------------按钮事件-------------------------------------*/
    //状态选项卡
    $('.table-title').children('span').click(function(){
        $('.table-title').children('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        var mainContentsTable = $('.main-contents-table');
        mainContentsTable.addClass('hide-block');
        mainContentsTable.eq($(this).index()).removeClass('hide-block');
        for(var i=0;i<$('.excelButton').children().length;i++){
            $('.excelButton').children().eq(i).addClass('hidding');
        }
        $('.excelButton').children().eq($(this).index()).removeClass('hidding');
    })
})