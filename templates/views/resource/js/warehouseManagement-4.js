$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //获得用户id
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //仓库
    warehouse();
    /*-------------------------------------表格初始化------------------------------*/
    var _tables = $('.main-contents-table .table').DataTable({
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
                text: '导出',
                className:'saveAs'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'物品编号',
                data:'itemNum'
            },
            {
                title:'物品名称',
                data:'itemName'
            },
            {
                title:'类别',
                data:'cateName'
            },
            {
                title:'规格',
                data:'size'
            },
            {
                title:'是否耐用',
                data:'isSpare',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '否'
                    }if(data == 1){
                        return '是'
                    }
                }
            },
            {
                title:'品质',
                data:'batchNum'
            },
            {
                title:'仓库',
                data:'storageName'
            },
            {
                title:'预警下限',
                data:'minNum'
            },
            {
                title:'预警上限',
                data:'maxNum'
            },
            {
                title:'库存数',
                data:'num'
            }
        ],
    });
    //自定义按钮位置
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    //加载页面的时候，隐藏其他两个导出按钮
    for( var i=1;i<$('.excelButton').children().length;i++ ){
        $('.excelButton').children().eq(i).addClass('hidding');
    };
    /*------------------------------------表格数据--------------------------------*/
    conditionSelect();
    /*------------------------------------表格按钮-------------------------------*/
    $('#selected').click(function(){
        conditionSelect();
    })
    //状态选项卡（选择确定/待确定状态）
    $('.table-title').children('span').click(function(){
        $('.table-title').children('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.main-contents-table').addClass('hide-block');
        $('.main-contents-table').eq($(this).index()).removeClass('hide-block');
        //导出按钮显示
        for( var i=0;i<$('.excelButton').children().length;i++ ){
            $('.excelButton').children().eq(i).addClass('hidding');
        };
        $('.excelButton').children().eq($(this).index()).removeClass('hidding');
    })
    /*------------------------------------其他方法-------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            'itemNum':filterInput[0],
            'itemName':filterInput[1],
            'userID':_userIdNum,
            'userName':_userIdName,
            'storageNum':$('#ckSelect').val()

        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptItemStock',
            data:prm,
            success:function(result){
                console.log(result);
                var downState = [];
                var upState = [];
                var nomalState = [];
                for(var i=0;i<result.length;i++){
                    if(result[i].alarmState == 0){
                        nomalState.push(result[i])
                    }else if(result[i].alarmState == 1){
                        downState.push(result[i])
                    }else if(result[i].alarmState == 2){
                        upState.push(result[i]);
                    }
                }
                datasTable($('#scrap-datatables'),result);
                datasTable($('#scrap-datatables1'),downState);
                datasTable($('#scrap-datatables2'),upState);
                datasTable($('#scrap-datatables3'),nomalState);
            }
        })
    }
    //dataTables表格填数据
    function datasTable(tableId,arr){
        var table = tableId.dataTable();
        if(arr.length == 0){
            table.fnClearTable();
            table.fnDraw();
        }else{
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }
    //仓库选择
    function warehouse(){
        var prm = {
            "userID": _userIdNum,
            "userName": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){
                console.log(result);
                var str = '<option value="">请选择</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';
                }
                $('#ckSelect').append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})