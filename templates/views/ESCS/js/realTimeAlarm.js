$(function(){

    /*----------------------------------------------时间插件------------------------------------------*/

    _timeYMDComponentsFun($('.time-tool'));

    /*----------------------------------------------表格初始化-----------------------------------------*/

    //已处理
    var col = [

        {
            "title":"日期",
            "data":""
        },
        {
            "title":"时间",
            "data":""
        },
        {
            "title": "报警级别",
            "class":"",
            "data":""
        },
        {
            "title": "报警名称",
            "data":""
        },
        {
            "title": "设备类型",
            "data":""
        },
        {
            "title": "设备",
            "data":""
        },
        {
            "title": "区域",
            "data":""
        },
        {
            "title": "位置",
            "data":""
        }

    ]

    _tableInit($('#alarm-datatables'),col,2,true,'','','','',10);

    //未处理
    var notCol = [

        {
            "title":"日期",
            "data":""
        },
        {
            "title":"时间",
            "data":""
        },
        {
            "title": "报警级别",
            "class":"",
            "data":""
        },
        {
            "title": "报警名称",
            "data":""
        },
        {
            "title": "当前数据",
            "data":""
        },
        {
            "title": "报警表达式",
            "data":""
        }

    ]

    _tableInit($('#alarm-datatables1'),notCol,2,true,'','','','',10);

    /*------------------------------------------------按钮事件----------------------------------------*/

    //已处理/未处理
    $('h3').on('click','.dispose',function(){

        //样式
        $('.dispose').removeClass('choose-dispose');

        $(this).addClass('choose-dispose');

        //对应表格
        $('.table-block').hide();

        $('.table-block').eq($(this).index()).show();

    })


})