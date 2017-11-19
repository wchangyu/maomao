$(function(){
    /*--------------------------------判断是否跳转-----------------------------*/

    var local = window.location.search;

    if(local){

        var itemNumq = local.split('?')[1].split('&')[0].split('=')[1];

        var itemNameq = decodeURI(local.split('?')[1].split('&')[1].split('=')[1]);

        $('.condition-query').eq(0).find('.filterInput').eq(0).val(itemNumq);

        $('.condition-query').eq(0).find('.filterInput').eq(1).val(itemNameq);

    }

    /*--------------------------------全局变量---------------------------------*/
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });

    //获得用户名
    var _userIdNum = sessionStorage.getItem('userName');

    var _userIdName = sessionStorage.getItem('realUserName');

    //获取角色权限
    var  _userRole = sessionStorage.getItem("userRole");

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //设置初始时间
     var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');

    //标识仓库是否加载完毕
    var _isWarehouse = false;

    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);

    var realityStart = '';
    var realityEnd = '';

    var _ckArr = [];
    /*-------------------------------------表格初始化------------------------------*/
    var _tables = $('.main-contents-table .table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "iDisplayLength":50,//默认每页显示的条数
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
                title:'物品序列号',
                data:'sn'
            },
            {
                name: 'second',
                title:'物品编号',
                data:'itemNum'
            },
            {
                title:'物品名称',
                data:'itemName'
            },
            {
                title:'规格型号',
                data:'size'
            },
            {
                title:'数量',
                data:'num'
            },
            {
                title:'单价',
                data:'price',
                render:function(data, type, full, meta){
                    if(data){
                        return data.toFixed(2)
                    }else{
                        return ''
                    }

                }
            },
            {
                title:'金额',
                data:'amount',
                render:function(data, type, full, meta){
                    if(data){
                        return data.toFixed(2)
                    }else{
                        return ''
                    }
                }
            },
            {
                title:'仓库',
                data:'storageName'
            },
            {
                title:'库区',
                data:'localName'
            },
            {
                title:'台账类型',
                data:'ivtType'
            },
            {
                title:'关联单号',
                data:'orderNum',
                render:function(data, type, full, meta){
                    if(full.ivtType == '入库'){
                        return '<a href="godownEntry.html?orderNum=' + full.orderNum +
                            '" target="_blank">' + full.orderNum + '</a>'
                    }else if(full.ivtType == '出库'){
                        return '<a href="outboundOrder.html?orderNum=' + full.orderNum +
                            '" target="_blank">' + full.orderNum + '</a>'
                    }
                }
            },
            {
                title:'创建时间',
                data:'createTime'
            },
            {
                title:'操作人',
                data:'createUserName'
            }
        ],
        "rowsGroup": [
            'second:name',
            0,
            1,
        ],
    });
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());

    //表格赋值
    warehouse();
    /*-------------------------------------按钮事件-------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    });

    //重置
    $('.resites').click(function(){
        //input清空
        $('.condition-query').find('input').val('');
        //select
        $('.condition-query').find('select').val('');
        //时间
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
        //是否
        $('#greaterThan').val(1);
    });

    //仓库选择
    $('#ck').on('change',function(){
        //根据仓库，联动库区
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetLocations',
            data:{
                storageNum:$('#ck').val(),
                userID:_userIdNum,
                userName:_userIdName,
                b_UserRole:_userRole
            },
            success:function(result){
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].localNum + '">' + result[i].localName + '</option>';
                }
                $('#kqSelect').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
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
        realityStart = filterInput[2] + ' 00:00:00';
        realityEnd = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var ckArr = [];
        var ckNum = '';
        if($('#ck').val() == ''){
            for(var i=0;i<_ckArr.length;i++){
                ckArr.push(_ckArr[i].storageNum);
            }
            ckNum = '';
        }else{

            ckNum = $('#ck').val();
            ckArr = [];
        }
        var prm = {
            'st':realityStart,
            'et':realityEnd,
            'itemNum':filterInput[0],
            'itemName':filterInput[1],
            'inoutType':$('.tiaojian').val(),
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'storageNums':ckArr,
            'storageNum':ckNum,
            'localNum':$('#kqSelect').val(),
            'hasNum':$('#greaterThan').val()
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptInventory',
            data:prm,
            timeout:30000,
            success:function(result){
                datasTable($('#scrap-datatables'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //dataTables表格填数据
    function datasTable(tableId,arr){
        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }

    //仓库选择
    function warehouse(){
        var prm = {
            "userID": _userIdNum,
            "userName": _userIdName,
            "b_UserRole":_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){
                _isWarehouse = true;
                _ckArr.length = 0;
                var str = '<option value="">请选择</option>'
                for(var i=0;i<result.length;i++){
                    _ckArr.push(result[i]);
                    str += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';
                }
                $('#ck').empty().append(str);
                //myApp33.ckselect = result[0].storageNum;
                //console.log(_isWarehouse);
                if(_isWarehouse){
                    conditionSelect();
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //仓库是否加载完成


    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})