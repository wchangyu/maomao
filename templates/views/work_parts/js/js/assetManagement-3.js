$(function(){
    //资产报废表格
    $('#information-datatables').DataTable({
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
        'ajax':'./work_parts/data/assetsbrow.json',
        "columns": [
            {
                title:'编号',
                data:'number',
            },
            {
                title:'资产编号',
                data:'assetNumber',
            },
            {
                title:'资产名称',
                data:'assetName',
            },
            {
                title:'规格型号',
                data:'specifications',
            },
            {
                title:'资产类型',
                data:'assetType',
            },
            {
                title:'购置日期',
                data:'purchaseDate',
            },
            {
                title:'使用年限',
                data:'durableYears',
            },
            {
                title:'状态',
                data:'state',
            },
            {
                title:'使用部门',
                data:'userDepartment',
            },
            {
                title:'所属系统',
                data:'itsSystem',
            },
            {
                title:'存放位置',
                data:'itsSystem',
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent":'<button class="btn btn-success">详情</button><button class="btn btn-success btn2">下载</button>'
            }
        ]
    });
})