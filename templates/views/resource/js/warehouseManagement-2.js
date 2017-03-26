$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //设置初始时间
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().add(1,'day').format('YYYY/MM/DD');
    //var initStart = '2017/02/28';
    //var initEnd = '2017/03/01';
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    /*-------------------------------------表格初始化------------------------------*/
    $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
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
                text: '保存为excel格式',
                className:'saveAs'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'入库单号',
            },
            {
                title:'入库类型'
            },
            {
                title:'供应商'
            },
            {
                title:'关联单号'
            },
            {
                title:'货品总数'
            },
            {
                title:'总金额'
            },
            {
                title:'状态'
            },
            {
                title:'制单人'
            },
            {
                title:'操作方式'
            },
            {
                title:'创建时间'
            },
            {
                title:'操作'
            }
        ],
    });
    //新增弹框内的表格
    $('#personTable1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
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
                text: '保存为excel格式',
                className:'saveAs'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'产品名称',
            },
            {
                title:'产品条码'
            },
            {
                title:'规格'
            },
            {
                title:'批次'
            },
            {
                title:'单价'
            },
            {
                title:'入库数'
            },
            {
                title:'总价'
            },
            {
                title:'库位'
            },
            {
                title:'操作'
            },
            {
                title:'创建时间'
            },
            {
                title:'操作'
            }
        ],
    });
    /*-------------------------------------按钮事件-------------------------------*/
    //新增按钮
    $('.creatButton').on('click',function(){
        //禁止模态框主动触发事件
        $('#myModal').modal({
            show:false,
            backdrop:'static'
        })
        $('#myModal').modal('show');
        moTaiKuang();
    })
    //重置按钮
    //点击重置按钮的时候，所有input框清空，时间还原成今天的
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })
    //新增产品
    $('.zhiXingRenYuanButton').on('click',function(){
        //禁止模态框主动触发事件
        $('#myModal').modal({
            show:false,
            backdrop:'static'
        })
        $('#myModal1').modal('show');
        moTaiKuang();
    })
    /*------------------------------------其他方法-------------------------------*/
    //确定新增弹出框的位置
    function moTaiKuang(){
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = $('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        //console.log(markBlockHeight);
        $('.modal-dialog').css({'margin-top':markBlockTop});
    }
})