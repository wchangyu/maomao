$(function(){

    var tableStr = '<table id="table" class="table table-striped table-bordered table-advance table-hover">' +
        '                                        <thead>' +

        '                                        </thead>' +
        '                                        <tbody>' +
        '                                        </tbody>' +
        '                                    </table>';

    /*----------------------------------表格初始化-------------------------------------*/

    //冷机
    var colCold = [

        {
            title:'时间',
            data:''
        },
        {
            title:'站房使用情况',
            data:''
        },
        {
            title:'设备',
            data:''
        },
        {
            title:'启停状态',
            data:''
        },
        {
            title:'纳入群控的冷机',
            data:''
        },
        {
            title:'最多开启冷机数',
            data:''
        },
        {
            title:'冷冻供水温度℃',
            data:''
        },
        {
            title:'冷冻供回水温差℃',
            data:''
        },
        {
            title:'冷冻供回水压差kPa',
            data:''
        },
        {
            title:'冷却回水温度℃',
            data:''
        },
        {
            title:'冷却供回水温差℃',
            data:''
        }

    ]

    //换热管
    var colHot = [

        {
            title:'时间',
            data:''
        },
        {
            title:'站房使用情况',
            data:''
        },
        {
            title:'设备',
            data:''
        },
        {
            title:'启停状态',
            data:''
        },
        {
            title:'纳入群控的换热罐',
            data:''
        },
        {
            title:'最多开启换热罐数',
            data:''
        },
        {
            title:'采暖供水温度℃',
            data:''
        },
        {
            title:'采暖供回水温差℃',
            data:''
        },
        {
            title:'采暖供回水压差kPa',
            data:''
        }

    ]

    _tableInitScroll($('.table'),colCold,2,false,'','','','','',true,500);

    /*----------------------------------按钮事件----------------------------------------*/

    //夏季模板选择
    $('.CH-summer').click(function(){

        $('.CH-list').removeClass('CH-summer-hover').removeClass('CH-winter-hover');

        $(this).addClass('CH-summer-hover');

        $('#table-area').empty().append(tableStr);

        _tableInitScroll($('.table'),colCold,2,false,'','','','','',true,500);

    })

    //冬季模板选择
    $('.CH-winner').click(function(){

        $('.CH-list').removeClass('CH-summer-hover').removeClass('CH-winter-hover');

        $(this).addClass('CH-winter-hover');

        //重新初始化表格
        $('#table-area').empty().append(tableStr);

        _tableInitScroll($('.table'),colHot,2,false,'','','','','',true,500);

    })

    //东西站房选择
    $('.local-tap').click(function(){

        $('.local-tap').removeClass('local-tap-checked');

        $(this).addClass('local-tap-checked');

    })


})