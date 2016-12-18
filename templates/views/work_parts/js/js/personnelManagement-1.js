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
                text:'新增巡检人员',
                className:'addPerson'
            }
        ],
        "ajax":"./work_parts/data/personal.json",
        "columns": [
            {
                title:'类型',
                data:'number',
            },
            {
                title:'团队',
                data:'team'
            },
            {
                title:'巡检人员',
                data:'Staff'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent":"<button class='btn btn-success'>删除</button>"
            }
        ]
    });
    //点击添加人员
    $('.addPerson').click(function(){
        $('.hideTable').toggle();
        if($('.hideTable')){
            $('#scrapp-datatables').DataTable({
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
                //"ajax":"./work_parts/data/personal.json",
                'buttons': [
                    {
                        text:'添加',
                        className:'nones'
                    }
                ],
                "columns": [
                    {
                        class:'checkeds',
                        "targets": -1,
                        "data": null,
                        "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
                    },
                    {
                        title:'团队',
                    },
                    {
                        title:'巡检人员',
                    }
                ]
            });
        }
        $('.nones').hide();
        var creatCheckBox = "<div class='checker'><span><input type='checkbox'></span></div>";
        $('.checkeds').prepend(creatCheckBox);
    });
    //复选框
    $('input').live('click',function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //console.log($(this).parents('.checker').children('ckecked').length);
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    })
    $('.close').live('click',function(){
        $('.hideTable').hide();
    });
    $('.cancel').live('click',function(){
        $('.hideTable').hide();
    })
    $('.save').live('click',function(){
        alert('保存成功！');
        $('.hideTable').hide();
    })
})