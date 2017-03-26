$(function(){
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
                title:'编号',
            },
            {
                title:'显示名'
            },
            {
                title:'上限'
            },
            {
                title:'下限'
            },
            {
                title:'价格'
            },
            {
                title:'规格'
            },
            {
                title:'类别'
            },
            {
                title:'单位'
            },
            {
                title:'备注'
            },
            {
                title:'操作'
            }
        ],
    });
    /*-------------------------------------按钮事件-------------------------------*/
    //登记按钮
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
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
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