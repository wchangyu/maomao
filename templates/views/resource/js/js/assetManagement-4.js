$(function(){
    //资料类型
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
                text:'增加'
            },
            {
                text: '修改'
            },
            {
                text: '删除'
            }
        ],
        'ajax':'../resource/data/productionType.json',
        "columns": [
            {
                title:'编号',
                data:'bianhao',
            },
            {
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'资产类型编码',
                data:'number',
            },
            {
                title:'资产类型名称',
                data:'name',
            },
            {
                title:'所属资产类型编码',
                data:'twoNumber',
            },
            {
                title:'拼音简码',
                data:'pinyin',
            }
        ]
    });
    $('#scrap-datatables tbody').on( 'click', 'input', function () {
        console.log($(this).parents('.checker').children('.checked').length);
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //console.log($(this).parents('.checker').children('ckecked').length);
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    } );
    //所属区域
    $('#area-datatables').DataTable({
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
            }
        ],
        'ajax':'../resource/data/area.json',
        "columns": [
            {
                title:'编号',
                data:'bianhao',
            },
            {
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'区域编码',
                data:'number',
            },
            {
                title:'区域名称',
                data:'name',
            },
            {
                title:'拼音简码',
                data:'twoNumber',
            }
        ]
    });
    //所属系统
    $('#system-datatables').DataTable({
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
            }
        ],
        'ajax':'../resource/data/system.json',
        "columns": [
            {
                title:'编号',
                data:'bianhao',
            },
            {
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'系统编码',
                data:'number',
            },
            {
                title:'系统名称',
                data:'name',
            },
            {
                title:'拼音简码',
                data:'twoNumber',
            }
        ]
    });
    //部门
    $('#department-datatables').DataTable({
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
            }
        ],
        'ajax':'../resource/data/department.json',
        "columns": [
            {
                title:'编号',
                data:'bianhao',
            },
            {
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'部门编码',
                data:'number',
            },
            {
                title:'部门名称',
                data:'name',
            },
            {
                title:'父部门编码',
                data:'twoNumber'
            },
            {
                title:'拼音简码',
                data:'pinyin',
            }
        ]
    });
    var creatCheckBox = '<input type="checkbox">';
    $('.checkeds').prepend(creatCheckBox);
    //tab切换
    $('.tab').children('li').click(function(){
        $('.tab').children('li').css({'background':'#808080','color':'#ffffff'});
        $(this).css({'background':'#ffffff','color':'#333333'});
        $('.table-block-list').hide();
        $('.table-block-list').eq($(this).index()).show();
    })
})