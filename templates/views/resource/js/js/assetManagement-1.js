$(function(){
    //资产数
    assets();
    var ztreeSettings = {
        check: {
            enable: false,
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
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'saveAs'
            }
        ],
        'ajax':'../resource/data/assetsbrow.json',
        "columns": [
            {
                title:'编号',
                data:'number',
            },
            {
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
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
                title:'安装区域',
                data:'installationArea',
            },
            {
                title:'安装时间',
                data:'installationDate',
            },
            {
                title:'所属系统',
                data:'itsSystem',
            }
        ]
    });
    //编辑按钮
    $('#browse-datatables tbody').on('click','.btn2',function(){
        $('.new-form').toggle();
    })
    //新增资产功能
    //取消按钮
    $('.cancel').click(function(){
        if($('.new-form')){
            $('.new-form').hide();
        }
    })
    //保存按钮
    $('.save').click(function(){
        alert('保存成功！');
        if($('.new-form')){
            $('.new-form').hide();
        }
    })
    $('.close').live('click',function(){
        $(this).parents('#main').hide();
    });

    //thead添加复选框
    var creatCheckBox = '<input type="checkbox">';
    $('.checkeds').prepend(creatCheckBox);

    //tbody中的复选框添加事件
    $('#browse-datatables tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            $(this).parents('tr').css({'background':'#FBEC88'})
        }else{
            $(this).parent($('span')).removeClass('checked');
            $(this).parents('tr').css({'background':'#ffffff'})
        }
    } )
        .on('dblclick','tr',function(){
            var e = event || window.event;
            if(e.target.nodeName.toLowerCase() != 'input'){
                console.log(e.target.nodeName.toLowerCase())
                //当前行变色
                $('#browse-datatables tbody').children('tr').css({'background':'#ffffff'});
                $(this).css({'background':'#FBEC88'});
            }
        })

    //点击thead复选框tbody的复选框全选中
    $('#browse-datatables thead').find('input').click(function(){
        //$('#information-datatables tbody').find('input')
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            $('#browse-datatables tbody').find('input').parents('.checker').children('span').addClass('checked');
            //所有行的背景颜色置为黄色
            $('#browse-datatables tbody').find('tr').css({'background':'#fbec88'})
        }else{
            $('#browse-datatables tbody').find('input').parents('.checker').children('span').removeClass('checked');
            $('#browse-datatables tbody').find('tr').css({'background':'#ffffff'})
        }
    })
})
var zNodes = [];
function assets(){
    $.ajax(
        {
            'type':'post',
            'url':'../resource/data/assets.json',
            'async':false,
            'success':function(result){
                var obj = {};
                obj.name = '资产信息';
                obj.id = '0';
                obj.open = true;
                zNodes.push(obj);
                for(i=1;i<result.data.length;i++){
                    var checked;
                    if(i==1){
                        checked = true;
                    }else{
                        checked = false;
                    }
                    zNodes.push({'name':result.data[i].name,'id':result.data[i].id,'pId':obj.id,'checked':checked})
                }
            }
        }
    )
}
//详情弹出框
function CreateTable(){
    $('#main').show();
    var table=$("<table class='tables' border=\"1\">");
    table.css({background:"#ffffff",position:"absolute",left:"50%",top:"50%",marginLeft:"-400px",marginTop:"-100px"});
    table.appendTo($("#main"));
    var header = $("<caption class='biaoti'>资产详细信息<span class='close'></span></caption>");
    header.appendTo(table);
    $.getJSON('../resource/data/assetsbrow.json',function(data){
        var bodyer = $(
            "<tr>" +
            "<td class='blues'>资产类型：</td>" +
            "<td>"+data.data[0].assetType+"</td>" +
            "<td class='blues'>资产编号：</td>" +
            "<td colspan='3'>"+data.data[0].assetNumber+"</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='blues'>资产名称：</td>" +
            "<td>"+data.data[0].assetName+"</td>" +
            "<td class='blues'>拼音简码：</td>" +
            "<td></td><td class='blues'>状态：</td>" +
            "<td>"+data.data[0].state+"</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='blues'>所属区域：</td>" +
            "<td >"+data.data[0].installationArea+"</td>" +
            "<td class='blues'>所属系统：</td>" +
            "<td>"+data.data[0].itsSystem+"</td>" +
            "<td class='blues'>所属部门：</td>" +
            "<td>"+data.data[0].userDepartment+"</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='blues'>品牌：</td>" +
            "<td >"+data.data[0].brand+"</td>" +
            "<td class='blues'>规格型号：</td>" +
            "<td>"+data.data[0].specifications+"</td>" +
            " <td class='blues'>供应商：</td>" +
            "<td></td>" +
            "</tr>" +
            "<tr>" +
            "<td class='blues'>生产商：</td>" +
            "<td></td>" +
            "<td class='blues' class='blues'>使用年限：</td>" +
            "<td>"+data.data[0].durableYears+"</td>" +
            "<td class='blues'>保修期：</td>" +
            "<td>"+data.data[0].warrantyPeriod+"</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='blues'>购置日期：</td>" +
            "<td>"+data.data[0].installationDate+"</td>" +
            "<td class='blues'>安装日期：</td>" +
            "<td>"+data.data[0].purchaseDate+"</td>" +
            "<td class='blues'>安装位置：</td>" +
            "<td>"+data.data[0].option+"</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='blues'>设备描述：</td>" +
            "<td colspan='7'>" +
            "</tr>" +
            "<tr>" +
            "<td class='blues'>技术资料：</td>" +
            "<td colspan='7'>" +
            "</tr>")
        bodyer.appendTo(table);

    })
}