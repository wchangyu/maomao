$(function(){
    $('.btn22').click(function(){
        $('.hiddenTable').toggle();
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
            "columns": [
                {
                    title:'工单号'
                },
                {
                    title:'资产编号',
                },
                {
                    title:'资产名称',
                },
                {
                    title:'资产类型',
                },
                {
                    title:'区域',
                },
                {
                    title:'部门',
                },
                {
                    title:'位置',
                }
            ]
        });
    })
    $('.close').click(function(){
        $('.hiddenTable').hide();
    })
    $('.cancel').click(function(){
        $('.hiddenTable').hide();
    })
    $('.save').click(function(){
        alert('保存成功！');
        $('.hiddenTable').hide();
    })
})