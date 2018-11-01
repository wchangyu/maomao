$(function(){

    //默认时间
    //设置初始时间
    var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');

    var _initEnd = moment().format('YYYY/MM/DD');

    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);

    /*---------------------------表格初始化----------------------------*/

    var col = [
        {
            title:'单号',
            data:'orderNum',
            className:'orderNum'
        },
        {
            title:'发起人',
            data:'inType'

        },
        {
            title:'变更分类',
            data:'supName'
        },
        {
            title:'变更内容',
            data:'storageName'
        },
        {
            title:'影响',
            data:'createTime'
        },
        {
            title:'关键参数',
            data:'auditTime'
        },
        {
            title:'计划实施时间',
            data:'createUserName'
        },
        {
            title:'实施负责人',
            data:'createUser'
        },
        {
            title:'审批结果',
            data:'result'
        },
        {
            title:'第一级审批人',
            data:'first'
        },
        {
            title:'第二级审批人',
            data:'second'
        },
        {
            title:'操作',
            data:'option'
        }
    ];

    _tableInit($('.rukuTable'),col,'1','flag','','');

    var data = [

        {
            "orderNum":"20180930",
            "inType":"张明",
            "supName":"环境变更",
            "storageName":"机房1冷通道温度提高至23",
            "createTime":"常规变更",
            "auditTime":"冷通道温度23",
            "createUserName":"2018年10月31",
            "createUser":"张明",
            "result":"未完成",
            "first":"裴勇",
            "second":"杜斐",
            "option":'同意/拒绝'
        }

    ]

    _datasTable($('.rukuTable'),data);

    //加载页面的时候，隐藏其他两个导出按钮

    for( var i=1;i<$('.excelButton').children().length;i++ ){

        $('.excelButton').children().eq(i).addClass('hidding');

    };

    //状态选项卡（选择确定/待确定状态）
    $('.table-title').children('span').click(function(){

        $('.table-title').children('span').removeClass('spanhover');

        $(this).addClass('spanhover');

        $('.main-contents-table').addClass('hide-block');

        $('.main-contents-table').eq($(this).index()).removeClass('hide-block');

        //导出按钮显示
        for( var i=0;i<$('.excelButton').children().length;i++ ){

            $('.excelButton').children().eq(i).addClass('hidding');

        };

        $('.excelButton').children().eq($(this).index()).removeClass('hidding');
    });

})