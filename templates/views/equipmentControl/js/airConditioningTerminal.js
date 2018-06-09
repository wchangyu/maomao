$(function(){

    /*------------------------------时间选择-------------------------------*/

    _monthDay($('.datetime'));

    //夏季默认
    $('.summer-min').val('05-15');

    $('.summer-max').val('09-20');

    //冬季默认
    $('.winter-min').val('12-15');

    $('.winter-max').val('03-15');

    //标签与显示不同的表
    $('.local-tap').click(function(){

        $('.local-tap').removeClass('local-tap-checked');

        $(this).addClass('local-tap-checked');

        $('.differentSetUp').hide();

        $('.differentSetUp').eq($(this).index()).show();

    })


})