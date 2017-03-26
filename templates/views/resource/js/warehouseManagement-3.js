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
                title:'	出库类型'
            },
            {
                title:'客户名称'
            },
            {
                title:'关联订单'
            },
            {
                title:'总数量'
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
})