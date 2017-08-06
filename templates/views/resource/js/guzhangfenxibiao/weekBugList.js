$(function(){
    //全局变量
    /*
    * 用户名 _userIdName 本地地址 _url*/
    //日历插件初始化
    _timeComponentsFun($('.datatimeblock'));

    //开始时间
    var _date = moment().format('YYYY/MM/DD');

    var _dataWeekStart = moment(_date).startOf('week').add(1,'d').format('YYYY/MM/DD');

    var _dataWeekEnd = moment(_date).endOf('week').add(1,'d').format('YYYY/MM/DD');

    //设置初始时间
    $('.datatimeblock').eq(0).val(_dataWeekStart);

    $('.datatimeblock').eq(1).val(_dataWeekEnd);

    var _dataEndFact = moment($('.datatimeblock').eq(1).val(_dataWeekEnd)).endOf('week').add(2,'d').format('YYYY/MM/DD');

    //存放合计的数组
    var _totalNum = [];

    //存放数据属性名的数组
    var _totalAttr = [];

    /*--------------------------------------按钮事件---------------------------------*/
    $('#selected').click(function(){
        //本周客服设备故障上报及处理情况
        conditionSelect('YWGD/ywGDRptGDs',$('#failure-reporting'),'flag');

        //本周发现或反馈的客服设备惯性、典型（重点）故障情况
        conditionSelect('YWGD/ywGDRptTypic',$('#failure-info'));

        //未修复
        conditionSelect('YWGD/ywGDRptWaiting',$('#failure-to-repair'));
    })
    /*------------------------------------表格初始化------------------------------------------*/
    var failureReportingCol = [
        {
            title:'站（段）名',
            data:'departName',
            render: function (data, type, row, meta){
                return '<span num="' + row.departNum +
                    '">' + data + '</span>'
            }
        },
        {
            title:'月报修故障累计（件）',
            data:'gdCountM'
        },
        {
            title:'本周报修故障累计（件）',
            data:'gdCountW'
        },
        {
            title:'任务完成',
            data:'tkComplete'
        },
        {
            title:'非维保范围',
            data:'tkCancel'
        },
        {
            title:'待完成',
            data:'tkWait'
        },
        {
            title:'自动售（取）票机',
            data:'shoupiaoji'
        },
        {
            title:'闸机',
            data:'zhaji'
        },
        {
            title:'引导系统',
            data:'yindao'
        },
        {
            title:'系统监控系统',
            data:'shipin'
        },
        {
            title:'广播系统',
            data:'guangbo'
        },
        {
            title:'旅服机房设备',
            data:'lvfujifang'
        },
        {
            title:'空调系统',
            data:'kongtiao'
        },
        {
            title:'其他',
            data:'qita'
        }
    ];

    //重绘表头
    function headerFn(thead, data, start, end, display){
        //在第一个的后边添加一个标签
        if( $(thead).parent('thead').children('tr').length <2 ){
            $(thead).parent('thead').children('tr').before('<tr>');
        };
        //向第一个tr中添加第一列的表头
        var firstTr = $(thead).parent('thead').children('tr').eq(0);
        var secondTr = $(thead).parent('thead').children('tr').eq(1);
        var firstTh = secondTr.children('th').eq(0);
        firstTh.addClass('first').attr('rowspan',2);
        firstTr.attr('role','row');
        //添加
        if( firstTr.children('.first').length == 0 ){
            firstTr.append(firstTh);
        }
        //添加第二个
        var secondTh = '<th class="second"></th>';
        $('.second').attr('colspan',5).html('其中本周：故障处置情况（件）');
        if( firstTr.children('.second').length == 0 ){
            firstTr.append(secondTh);
        }
        //添加第三个
        var thirdTh = '<th class="third"></th>';
        $('.third').attr('colspan',3).html('其中：累计故障类别');
        if( firstTr.children('.third').length == 0 ){
            firstTr.append(thirdTh);
        }
    }

    //重绘脚部
    function footerFn(tfoot, data, start, end, display){
        var lengths = $(tfoot).parents('.table').find('thead').find('.sorting_disabled').length;
        var tr = $(tfoot).parents('table').children('tfoot').children('tr');
        var th = $(tfoot).parents('table').children('tfoot').children('tr').children('th');
        var str = '';
        if($(tfoot).parents('.table').find('tfoot').find('th').length == 0){
            for(var i=0;i<lengths;i++){
                str += '<th></th>';
            }
            $('tfoot').find('tr').append(str);
        }
        $(tfoot).parents('.table').find('tfoot').find(tr).eq(0).children('th').eq(0).html('合计');
    }

    //合计计算
    function totalFn(nRow, aData, iDisplayIndex, iDisplayIndexFull){
        var lengths = _totalAttr.length;
        //首先遍历aData的属性名称
        for(var i=2;i<lengths;i++){
            _totalNum[i] += aData[_totalAttr[i]];
        };
    }

    //重绘合计数据
    function drawFn(){
        var ths = $('#failure-reporting').find('tfoot').children('tr').eq(0).children('th');
        for(var i=1;i<ths.length;i++){
            ths.eq(i).html(_totalNum[i+1]);
        }
        for(var i=0;i<_totalNum.length;i++){
            _totalNum[i] = 0;
        }
    }

    initTable($('#failure-reporting'),failureReportingCol,headerFn,footerFn,totalFn,drawFn);

    var failureToRepairCol = [
        {
            title:'站（段）名',
            data:'wxKeshi'
        },
        {
            title:'故障报修时间',
            data:'gdShij'
        },
        {
            title:'故障设备及类别',
            data:'bxBeizhu'
        },
        {
            title:'报修至截止本日12:00已累计故障（时、分）',
            data:'timeSpan'
        },
        {
            title:'处置过程',
            data:'wxBeizhu'
        },
        {
            title:'预计完成时限',
            data:'yjShij'
        },
        {
            title:'督察督办责任人',
            data:'wxUserNames'
        },
        {
            title:'故障未处理原因分析',
            data:'dengMemo'
        }
    ];

    initTable($('#failure-to-repair'),failureToRepairCol);

    var failureInfoCol = [
        {
            title:'站（段）名',
            data:'bxkeshi'
        },
        {
            title:'故障报修或发现时间',
            data:'gdShij'
        },{
            title:'故障类别',
            data:'bxBeizhu'
        },{
            title:'处置情况',
            data:'lastUpdateInfo'
        },{
            title:'原因分析',
            data:'reason'
        },{
            title:'整改措施',
            data:'method'
        },
    ];

    initTable($('#failure-info'),failureInfoCol);

    var workProgressCol = [
        {
            title:'站（段）名',
            data:''
        },
        {
            title:'故障报修或发现时间',
            data:''
        },
        {
            title:'故障类别',
            data:''
        },
        {
            title:'处置情况',
            data:''
        },
        {
            title:'加班人员',
            data:''
        },
        {
            title:'整改措施',
            data:''
        },
    ];

    initTable($('#work-progress'),workProgressCol);

    //按钮显示/隐藏
    //默认第一个按钮显示
    $('.dt-buttons').hide();

    $('.dt-buttons').eq(0).show();

    //本周客服设备故障上报及处理情况
    conditionSelect('YWGD/ywGDRptGDs',$('#failure-reporting'),'flag');

    //本周发现或反馈的客服设备惯性、典型（重点）故障情况
    conditionSelect('YWGD/ywGDRptTypic',$('#failure-info'));

    //未修复
    conditionSelect('YWGD/ywGDRptWaiting',$('#failure-to-repair'));

    //条件查询
    function conditionSelect(url,tableId,flag){
        //获取条件
        var prm = {
            "gdSt":$('.datatimeblock').eq(0).val(),
            "gdEt":_dataEndFact,
            "userID":_userIdNum,
            "userName ":_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                console.log(result);
                if(flag){
                    for(var key in result[0]){
                        _totalAttr.push(key);
                    }
                }

                _datasTable(tableId,result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //表格初始化
    function initTable(table,arr,headerCallBack,footerCallBack,fnRowCallback,drawCallback){
        var table =  table.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": true,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": true,
            "ordering": false,
            "pagingType":"full_numbers",
            "bStateSave":true,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '没有数据',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            'buttons': [
                {
                    extend: 'excelHtml5',
                    text: '导出',
                    className:'saveAs'
                }
            ],
            "dom":'t<"F"lip>',
            "columns": arr,
            "headerCallback":headerCallBack,
            "footerCallback": footerCallBack,
            "fnRowCallback": fnRowCallback,
            "drawCallback":drawCallback
        });
        table.buttons().container().appendTo($('.excelButton'),table.table().container());
    }

    /*-----------------------------------------按钮--------------------------------------*/
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
        $('.dt-buttons').hide();
        $('.dt-buttons').eq($(this).index()).show();
    });
})