$(function(){
    $('#scrap-datatables').DataTable({
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
        'ajax':'./work_parts/data/inspectionManagement.json',
        "columns": [
            {
                title:'编号',
                data:'number',
            },
            {
                title:'设备类型',
                data:'deviceType',
            },
            {
                title:'巡检内容',
                data:'content',
            },
            {
                title:'是否详检',
                data:'detailed',
            },
            {
                title:'报警关系',
                data:'relationship',
            },
            {
                title:'报警值',
                data:'value',
            },
            {
                title:'排序',
                data:'sort',
            },
            {
                title:'备注',
                data:'note',
            }
        ]
    });
    $('.btn22').click(function(){
        $('.content-main-contentss').toggle();
        $('.aaa').toggle();
    })
    $('.save').click(function(){
        alert('保存成功！');
        $('.content-main-contentss').hide();
        $('.aaa').show();
    })
    $('.cancel').click(function(){
        $('.content-main-contentss').hide();
        $('.aaa').show();
    })
})