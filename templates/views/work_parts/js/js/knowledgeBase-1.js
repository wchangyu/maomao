$(function(){
    //资产数
    assets();
    var ztreeSettings = {
        check: {
            enable: true,
            chkStyle: "radio",
            chkboxType: { "Y": "ps", "N": "ps" },
            radioType: 'all'

        },
        data: {
            key: {
                title: "title"
            },
            simpleData: {
                enable: true
            }
        },
        view: {
            showIcon: false
        },
        callback: {
            onClick:function (event,treeId,treeNode){
                treeObjs.checkNode(treeNode,!treeNode.checked,true)
            }
        }
    };
    var treeObjs = $.fn.zTree.init($("#allPointer"), ztreeSettings, zNodes);
    //时间插件
    $('.startsTime').datepicker(
        {
            language:  'zh-CN',
            todayBtn: 1,
            todayHighlight: 1,
            format: 'yyyy-mm-dd'
        }
    )
    //input-select组合功能
    //点击出现ul列表
    $('.input-select').children('select').click(function(){
        $(this).next('ul').toggle();
    })
    //点击li添加内容
    $('.brands').delegate('li','click',function(){
        $(this).parents('.input-select').children('input').val($(this).html());
        $(this).parent().hide();
    });
    //新增资产
    $('.btn2').click(function(){
        $('.new-form').toggle();
    });
    //资产浏览表格
    $('#browse-datatables').DataTable({
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
        //'ajax':'./work_parts/data/assetsbrow.json',
        "columns": [
            {
                title:'知识编号',
            },
            {
                title:'知识分类',
            },
            {
                title:'摘要',
            },
            {
                title:'主题词',
            },
            {
                title:'录入时间',
            },
            {
                title:'录入人',
            },
            {
                title:'操作',
            }
        ]
    });
    //编辑按钮
    $('#browse-datatables tbody').on('click','.btn2',function(){
        $('.new-form').toggle();
    })
    //新增日志
    $('.btn22').click(function(){
        $('.bianjirizhi').toggle();
        $('.content-main-contents-header-1').toggle();
        $('.content-main-contents-1').toggle();
    });
    //保存日志
    //取消按钮
    $('.cancel').click(function(){
        if($('.bianjirizhi')){
            $('.bianjirizhi').hide();
            $('.content-main-contents-header').show();
            $('.content-main-contents').show();
        }
    })
    //保存按钮
    $('.save').click(function(){
        alert('保存成功！');
        if($('.bianjirizhi')){
            $('.bianjirizhi').hide();
            $('.content-main-contents-header').show();
            $('.content-main-contents').show();
        }
    })
})
var zNodes = [];
function assets(){
    var obj = {};
    obj.name = '知识点';
    obj.id = '0';
    obj.open = true;
    zNodes.push(obj);
}