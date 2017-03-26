$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
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
                title:'产品名称',
            },
            {
                title:'产品条码'
            },
            {
                title:'产品编号'
            },
            {
                title:'规格'
            },
            {
                title:'入库总数'
            },
            {
                title:'出库总数'
            },
            {
                title:'入库所占比例（%）'
            },
            {
                title:'出库所占比例（%）'
            }
        ],
    });
})