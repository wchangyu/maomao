$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
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
            options: [
                { text: '采购入库', value: '1' },
                { text: '借出退还入库', value: '2' },
                { text: '借用入库', value: '3' }
            ],
            'gysbianhao':'',
            'gysmingcheng':'',
            'gyslianxiren':'',
            'gysdizhi':'',
            'zhidanren':'',
            'remarks':'',
            'gysphone':'',
            'shijian':'',
        }
    });
    /*-------------------------------------表格初始化------------------------------*/
    var _tables = $('#scrap-datatables').DataTable({
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
                title:'出库单号',
                data:'orderNum',
                className:'orderNum'
            },
            {
                title:'日期',
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
                data:'amount'
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
                data:'num'
            },
            {
                title:'入库价格',
                data:'outPrice'
            },
            {
                title:'总金额',
                data:'amount'
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
                myApp33.rkleixing = $.trim($('#myApp33').find('select').find('option').eq(_allData[i].outType-1).val());
                myApp33.bianhao = _allData[i].orderNum;
                myApp33.gysbianhao = _allData[i].supNum;
                myApp33.gysmingcheng = _allData[i].supName;
                myApp33.gyslianxiren = _allData[i].contactName;
                myApp33.gysdizhi = _allData[i].address;
                myApp33.remarks = _allData[i].remark;
                myApp33.gysphone = _allData[i].phone;
                myApp33.zhidanren = _allData[i].contactName;
                myApp33.shijian = _allData[i].createTime;
            }
        }
        //判断如果是查看功能的话，确认按钮消失
        $('#myModal').find('.confirm').hide();
        //获取当前入库单号的
        moTaiKuang($('#myModal'))
        //获取入库信息的详细物品信息
        var prm = {
            'orderNum':$thisDanhao,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorageDetail',
            data:prm,
            success:function(result){
                datasTable($('#personTable1'),result)
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
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptOutStorage',
            data:prm,
            success:function(result){
                datasTable($('#scrap-datatables'),result)

            }
        })
        //符合当前条件的出库管理列表
        var prms = {
            'st':realityStart,
            'et':realityEnd,
            'orderNum':'',
            'inType':'',
            'userID':_userIdName
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
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})