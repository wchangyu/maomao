$(function(){
    //日历插件
    $('.time').datepicker(
        {
            language:  'zh-CN',
            todayBtn: 1,
            todayHighlight: 1,
            format: 'yyyy-mm-dd'
        }
    )
    //表格
    //资产报废表格
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
            },
            {
                text: '下发任务'
            }
        ],
        //'ajax':'./work_parts/data/assetsbrow.json',
        "columns": [
            {
                title:'工单号'
            },
            /*{
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },*/
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
            },
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
    var creatCheckBox = '<input type="checkbox">';
    $('.checkeds').prepend(creatCheckBox);
    $('#scrap-datatables tbody').on( 'click', 'input', function () {
        console.log($(this).parents('.checker').children('.checked').length);
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //console.log($(this).parents('.checker').children('ckecked').length);
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    } );
})