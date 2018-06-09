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

    })

    //不同控制模式显示不同的设置内容

    //夏季站房照明
    $('#light-one').change(function(){

        $('.light-one').hide();

        if($('#light-one').val() == 0){

            //时控
            $('#light-one-SK').show();

        }else{

            //手动
            $('#light-one-SD').show();
        }

    })

    //冬季站房照明
    $('#light-two').change(function(){

        $('.light-two').hide();

        if($('#light-two').val() == 0){

            //时控
            $('#light-two-SK').show();

        }else{

            //手动
            $('#light-two-SD').show();
        }

    })

})