$(function(){
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    /*------------------------------------表格初始化------------------------------------------*/
    var failureReportingCol = [
        {
            title:'用户名',
            data:'userName'

        },
        {
            title:'工号',
            data:'userNum',
            className:'userNum'
        },
        {
            title:'部门',
            data:'departName'
        },
        {
            title:'角色',
            data:'roleName'
        },
        {
            title:'邮箱',
            data:'email'
        },
        {
            title:'手机',
            data:'mobile'
        },
        {
            title:'固定电话',
            data:'mobile'
        },
        {
            title:'备注',
            data:'remark'
        },
        {
            title:'排序',
            data:'sort'
        }
    ];

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
        $('.second').attr('colspan',5).html('11111111');
        if( firstTr.children('.second').length == 0 ){
            firstTr.append(secondTh);
        }
        //添加第三个
        var thirdTh = '<th class="third"></th>';
        $('.third').attr('colspan',3).html('2222222222222');
        if( firstTr.children('.third').length == 0 ){
            firstTr.append(thirdTh);
        }
    }

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
        $(tfoot).parents('.table').find('tfoot').find(tr).eq(1).children('th').eq(0).html('故障发生率');
    }

    initTable($('#failure-reporting'),failureReportingCol,headerFn,footerFn);

    var failureToRepairCol = [
        {
            title:'站（段）名',
            data:''
        },
        {
            title:'故障报修时间',
            data:''
        },
        {
            title:'故障设备及类别',
            data:''
        },
        {
            title:'报修至截止本日12:00已累计故障（时、分）',
            data:''
        },
        {
            title:'处置过程',
            data:''
        },
        {
            title:'预计完成时限',
            data:''
        },
        {
            title:'督察督办责任人',
            data:''
        },
        {
            title:'故障未处理原因分析',
            data:''
        },
        {
            title:'备注',
            data:''
        }
    ];

    initTable($('#failure-to-repair'),failureToRepairCol);

    var failureInfoCol = [
        {
            title:'站（段）名',
            data:''
        },
        {
            title:'故障报修或发现时间',
            data:''
        },{
            title:'故障类别',
            data:''
        },{
            title:'处置情况',
            data:''
        },{
            title:'原因分析',
            data:''
        },{
            title:'整改措施',
            data:''
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

    conditionSelect();

    function conditionSelect(){
        //获取条件
        var prm = {
            "userName":'',
            "userNum":'',
            "departNum":'',
            "roleNum":'',
            "userID": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            success:function(result){
                //console.log(result);
                datasTable($('#failure-reporting'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //表格赋值
    function datasTable(tableId,arr){
        var table = tableId.dataTable();
        if(arr.length == 0){
            table.fnClearTable();
            table.fnDraw();
        }else{
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }

    //表格初始化
    function initTable(table,arr,headerCallBack,footerCallBack){
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
            "footerCallback": footerCallBack
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