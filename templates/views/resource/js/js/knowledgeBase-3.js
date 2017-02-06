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
                text:'增加'
            },
            {
                text: '修改'
            },
            {
                text: '删除'
            },
            {
                text: '下发任务'
            }
        ],
        //'ajax':'./work_parts/data/assetsbrow.json',
        "columns": [
            {
                title:'编号类型',
                data:'number',
            },
            /*{
             class:'checkeds',
             "targets": -1,
             "data": null,
             "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
             },*/
            {
                title:'类型名称',
            },
            {
                title:'计划日期',
            },
            {
                title:'所属类型',
            },
            {
                title:'设备所属区域',
            },
            {
                title:'拼音简码',
            },
            {
                title:'操作',
            }
        ]
    });
    $('.close').live('click',function(){
        $('.classification').hide();
    })
    $('.btn22').click(function(){
        $('.classification').show();
    })
    $('.save').live('click',function(){
        alert('保存成功！');
        $('.classification').hide();
    })
    $('.cancel').live('click',function(){
        $('.classification').hide();
    })
})