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
                title:'所属系统',
                data:'itsSystem',
            },
            {
                title:'存放位置',
                data:'itsSystem',
            }
        ]
    });
    //thead添加复选框
    var creatCheckBox = '<input type="checkbox">';
    $('.checkeds').prepend(creatCheckBox);
    //tbody中的复选框添加事件
    $('#information-datatables tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            $(this).parents('tr').css({'background':'#FBEC88'})
        }else{
            $(this).parent($('span')).removeClass('checked');
            $(this).parents('tr').css({'background':'#ffffff'})
        }
    } )
        //双击改变背景颜色
    .on('dblclick','tr',function(){
        var e = event || window.event;
        if(e.target.nodeName.toLowerCase() != 'input'){
            //当前行变色
            $('#scrap-datatables tbody').children('tr').css({'background':'#ffffff'});
            $(this).css({'background':'#FBEC88'});
            markSize ();
            $('.gongdanMarkBlock').hide();
            $('.workDone').show();
        }
    })
    /*窗口改变遮罩也改变*/
    window.onresize = function(){
        var display =  $('.gongdanMark')[0].style.display;
        if(display == 'block'){
            markSize ();
        }
    }
    //遮罩大小改变
    function markSize (){
        var markWidth = document.documentElement.clientWidth;
        var markHeight = document.documentElement.clientHeight;
        var markBlockWidth = $('.gongdanMarkBlock').width();
        var markBlockHeight = $('.gongdanMarkBlock').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        var markBlockLeft = (markWidth - markBlockWidth)/2;
        $('.gongdanMark').css({'width':markWidth,'height':markHeight});
        $('.gongdanMark').show();
        $('.gongdanMarkBlock').css({'top':markBlockTop,'left':markBlockLeft});
    }
    //关闭按钮
    $('.closes').click(function(){
        $('.gongdanMark').hide();
    })
    $('.closee').click(function(){
        $('.gongdanMark').hide();
    })
    //点击thead复选框tbody的复选框全选中
    $('#information-datatables thead').find('input').click(function(){
        //$('#information-datatables tbody').find('input')
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            $('#information-datatables tbody').find('input').parents('.checker').children('span').addClass('checked');
            //所有行的背景颜色置为黄色
            $('#information-datatables tbody').find('tr').css({'background':'#fbec88'})
        }else{
            $('#information-datatables tbody').find('input').parents('.checker').children('span').removeClass('checked');
            $('#information-datatables tbody').find('tr').css({'background':'#ffffff'})
        }
    })
})