$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //获得用户id
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //获取角色权限
    var  _userRole = sessionStorage.getItem("userRole");
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });
    //设置初始时间
    var _initStart = moment().startOf('month').format('YYYY/MM/DD');
    var _initEnd = moment().endOf('month').format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    var realityStart = '';
    var realityEnd = '';
    //存放物品管理列表
    var _allData = [];
    //新增入库单的vue对象
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            'bianhao':'',
            'rkleixing':'',
            'zhidanren':'',
            'remarks':'',
            'shijian':'',
            'ckselect':'',
            'gdCode':'',
            'clymc':'',
            'clydh':''
        }
    });
    warehouse();
    rkLX();
    /*-------------------------------------表格初始化------------------------------*/
    var _tables = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "iDisplayLength":50,//默认每页显示的条数
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
                title:'出库单号',
                data:'orderNum',
                className:'orderNum'
            },
            {
                title:'仓库',
                data:'storageName'
            },
            {
                title:'创建日期',
                data:'createTime'
            },
            {
                title:'物品条目数',
                data:'num'
            },
            {
                title:'总数',
                data:'count'
            },
            {
                title:'总价',
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
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
            }
        ],
    });
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    //新增弹框内的表格
    $('#personTable1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "iDisplayLength":50,//默认每页显示的条数
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
                className:'saveAs hidding'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'物料编号',
                data:'itemNum',
                className:'bianma'
            },
            {
                title:'物料名称',
                data:'itemName'
            },
            {
                title:'物料条形码',
                data:'itemBarCode'
            },
            {
                title:'批次',
                data:'batchNum'
            },
            {
                title:'数量',
                data:'num',
            },
            {
                title:'入库价格',
                data:'outPrice',
                render:function(data, type, full, meta){
                    if(data){
                        return data.toFixed(2)
                    }else{
                        return ''
                    }

                }
            },
            {
                title:'总金额',
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
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"
            }
        ],
    });
    /*------------------------------------表格数据--------------------------------*/
    conditionSelect();
    /*-------------------------------------按钮方法-------------------------------*/
    $('#selected').click(function(){
        if( $('.min').val() == '' || $('.max').val() == '' ){
            var myModal = $('#myModal2')
            myModal.find('.modal-body').html('起止时间不能为空');
            moTaiKuang(myModal);
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                var myModal = $('#myModal2');
                //提示框
                myModal.find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang(myModal);
            }else {
                conditionSelect();
            }
        }
    })
    //重置按钮
    $('.resites').click(function(){
        //时间置为当前月的第一天和最后一天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })
    $('#scrap-datatables tbody').on('click','.option-see',function(){
        var $this = $(this).parents('tr');
        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        var $thisDanhao = $(this).parents('tr').find('.orderNum').html();
        //获取数据
        for(var i=0;i<_allData.length;i++){
            if(_allData[i].orderNum == $thisDanhao){
                //绑定数据
                myApp33.rkleixing = _allData[i].outType;
                myApp33.bianhao = _allData[i].orderNum;
                myApp33.remarks = _allData[i].remark;
                myApp33.zhidanren = _allData[i].createUser;
                myApp33.shijian = _allData[i].createTime;
                myApp33.gdCode =_allData[i].contractOrder;
                myApp33.clymc = _allData[i].cusName;
                myApp33.clydh = _allData[i].phone;
                myApp33.ckselect = _allData[i].storageNum;
            }
        }
        //判断如果是查看功能的话，确认按钮消失
        $('#myModal').find('.confirm').hide();
        //获取当前入库单号的
        moTaiKuang($('#myModal'))
        //获取入库信息的详细物品信息
        var prm = {
            'orderNum':$thisDanhao,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorageDetail',
            data:prm,
            success:function(result){
                datasTable($('#personTable1'),result)
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
        realityStart = filterInput[0] + ' 00:00:00';
        realityEnd = moment(filterInput[1]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            'st':realityStart,
            'et':realityEnd,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptOutStorage',
            data:prm,
            success:function(result){
                datasTable($('#scrap-datatables'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
        //符合当前条件的出库管理列表
        var prms = {
            'st':realityStart,
            'et':realityEnd,
            'orderNum':'',
            'inType':'',
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorage',
            data:prms,
            success:function(result){
                //状态为待确认的数组
                if(result.length>0){
                    _allData = result;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //确定新增弹出框的位置
    function moTaiKuang(who){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
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
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){
                var str = '<option value="">请选择</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';
                }
                $('#ckselect').append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //入库类型
    function rkLX(flag){
        var prm = {
            "catType": 2,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetInOutCate',
            data:prm,
            success:function(result){
                if(flag){
                    var str = '<option value="">全部</option>';
                    for(var i=0;i<result.length;i++){
                        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                    }
                    $('.tiaojian').append(str);
                }else{
                    var str = '<option value="">请选择</option>';
                    for(var i=0;i<result.length;i++){
                        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                    }
                    $('#rkleixing').append(str);
                }

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