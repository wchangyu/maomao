$(function (){
    /*-------------------------全局变量----------------------------*/
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().add(1,'day').format('YYYY/MM/DD');
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    /*-------------------------表格初始化--------------------------*/
    //页面表格
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
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
                className:'saveAs',
                header:true
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'报修部门',
                data:'bxKeshi'
            },
            {
                title:'报修量',
                data:'gdNum'
            },
            {
                title:'完工量',
                data:'gdWgNum'
            },
            {
                title:'未完工量',
                data:'gdWwgNum'
            },
            {
                title:'耗时总计'
            }
        ]
    });
    $('#scrap-datatables1').DataTable({
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
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
                className:'saveAs',
                header:true
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'报修部门',
                data:'bxKeshi'
            },
            {
                title:'报修量',
                data:'gdNum'
            },
            {
                title:'完工量',
                data:'gdWgNum'
            },
            {
                title:'未完工量',
                data:'gdWwgNum'
            },
            {
                title:'维修部门',
                data:'wxKeshi'
            },
            {
                title:'维修耗时',
                data:'wxShij'
            },
            {
                title:'耗时总计'
            }
        ]
    });
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //给表格的标题赋时间
    $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + _initStart + ' 00:00:00' + '——' + _initEnd + ' 00:00:00');
    $('#scrap-datatables1').find('caption').children('p').children('span').html(' ' + _initStart + ' 00:00:00' + '——' + _initEnd + ' 00:00:00');
    /*-------------------------获取表格数据-----------------------*/
    conditionSelect();
    function conditionSelect(){
        //获取所有input框的值
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        console.log(filterInput);
        var prm = {
            'gdSt':filterInput[0],
            'gdEt':filterInput[1],
            'wxKeshi':filterInput[3],
            'bxKeshi':filterInput[2],
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:'http://192.168.1.196/BEEWebAPI/api/YWGD/ywGDRptBxKeshi',
            data:prm,
            success:function(result){
                //给表格赋值
                if(result.bxGd.length == 0){
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                }else{
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                    table.fnAddData(result.bxGd);
                    table.fnDraw();
                }
                if(result.bxwxGD.length == 0){
                    var table = $("#scrap-datatables1").dataTable();
                    table.fnClearTable();
                }else{
                    var table = $("#scrap-datatables1").dataTable();
                    table.fnClearTable();
                    table.fnAddData(result.bxwxGD);
                    table.fnDraw();
                }
            }
        })
    }
    /*--------------------------按钮功能------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    })
    //重置按钮
    $('.resites').click(function(){
        //时间选为当天，其他输入框置为空
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})