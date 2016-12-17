$(function(){
    $('#asset-type-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [
            {
                extend:'csvHtml5',
                text:'保存csv格式'
            },
            {
                extend: 'excelHtml5',
                text: '保存为excel格式'
            },
            {
                extend: 'pdfHtml5',
                text: '保存为pdf格式'
            }
        ],
        //'ajax':'./work_parts/data/productionType.json',
        "columns": [
            {
                title:'编号',
            },
            {
                title:'工单号'
            },
            {
                title:'资产信息',

            },
            {
                title:'故障描述',

            },
            {
                title:'状态',

            },
            {
                title:'上报时间',
            }
            ,
            {
                title:'负责人',

            },
            {
                title:'责任人',
            },
            {
                title:'计划开始时间',

            },
            {
                title:'计划工时',
            },
            {
                title:'附件',

            },
            {
                title:'操作',
            }
        ]
    });
})