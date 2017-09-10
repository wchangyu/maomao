$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //设置初始时间
     var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    var realityStart = '';
    var realityEnd = '';
    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
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
    //新增入库物品的vue对象
    var workDone = new Vue({
        'el':'#workDone',
        'data':{
            'itemBarCode':'',
            'batchNum':'',
            'num':'',
            'inPrice':'',
            'amount':'',
            'bianhao':'',
            'mingcheng':''
        },
        'methods':{
            'wuPinList':function(){
                setTimeout(function(){
                    //选择物品列表
                    $('#wuPinListTable').DataTable({
                        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
                        "paging": false,   //是否分页
                        "destroy": true,//还原初始化了的datatable
                        "searching": true,
                        "ordering": false,
                        "scrollY": 200,
                        "scrollX": true,
                        "iDisplayLength":50,//默认每页显示的条数
                        'language': {
                            'emptyTable': '没有数据',
                            'loadingRecords': '加载中...',
                            'processing': '查询中...',
                            'lengthMenu': '每页 _MENU_ 条',
                            'zeroRecords': '没有数据',
                            'sSearch':'搜索',
                            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
                                className:'saveAs hidding'
                            }
                        ],
                        "dom":'B<"clear">lfrtip',
                        "columns": [
                            {
                                title:'物品编码',
                                className:'bianma',
                                data:'itemNum'
                            },
                            {
                                title:'物品名称',
                                className:'mingcheng',
                                data:'itemName'
                            },
                            {
                                title:'分类编码',
                                data:'cateNum'
                            },
                            {
                                title:'分类名称',
                                data:'cateName'
                            },
                            {
                                title:'主要供货商',
                                data:'cusName'
                            }
                        ],
                    });
                },200);
                setTimeout(function(){
                    var prm = {
                        'ItemNum':'',
                        'itemName':'',
                        'cateName':'',
                        'userID':_userIdName
                    }

                    $.ajax({
                        type:'post',
                        url:_urls + 'YWCK/ywCKGetItems',
                        async:false,
                        data:prm,
                        success:function(result){
                            _wpListArr = result;
                            datasTable($('#wuPinListTable'),result);
                        }
                    })
                },300);
                moTaiKuang($('#myModal4'));
            }
        }
    });
    //存放入库物品的数组
    var _rukuArr = [];
    //存放当前条件下的所有数据
    var _allData = [];
    //存放入库单当前删除行的坐标
    var _$thisRemoveRowXiao = '';
    //存放删除入库单
    var _$thisRemoveRowDa = '';
    //存放物品列表
    var _wpListArr = [];
    //当前选中的一条物品列表
    var _$thisWP = '';
    //表格定位当前页
    //定位当前页
    var currentPages = 0;
    //定位当前表格的分页（一个页面多个表格）
    var $thisTbale;
    //当前页在分页的span页中的index值
    var currentTable;
    /*-------------------------------------表格初始化------------------------------*/
    var _tables = $('.main-contents-table .table').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'sSearch':'查询',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t<"F"lip>',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success'
            }
        ],
        'columns':[
            {
                title:'移库单编号',
                data:'orderNum',
                className:'orderNum'
            },
            {
                title:'移库类型',
                data:'inType',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '出错'
                    }
                    if(data == 1){
                        return '采购入库'
                    }if(data == 2){
                        return '借出退还入库'
                    }if(data == 3){
                        return '借用入库'
                    }
                },
                className:'inType'

            },
            {
                title:'移库数量',
                data:'supNum'
            },
            {
                title:'状态',
                data:'supName'
            },
            {
                title:'移库人',
                data:'contactName'
            },
            {
                title:'创建时间',
                data:'createTime'
            },
            {
                title:'制单人',
                data:'createUser'
            },
            {
                title:'操作',
                data:'status',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                            "<span class='data-option option-confirmed btn default btn-xs green-stripe'>已确认</span>" +
                            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                    }if(data == 0){
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                            "<span class='data-option option-confirm btn default btn-xs green-stripe'>待确认</span>" +
                            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                    }
                }

            }
        ]
    });
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    //加载页面的时候，隐藏其他两个导出按钮
    for( var i=1;i<$('.excelButton').children().length;i++ ){
        $('.excelButton').children().eq(i).addClass('hidding');
    };
    //新增弹框内的表格
    $('#personTable1').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'sSearch':'查询',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'dom':'B<"clear">lfrtip',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success hidding'
            }
        ],
        'columns':[
            {
                title:'物品编号',
                data:'itemNum',
                className:'bianma'
            },
            {
                title:'物品名称',
                data:'itemName'
            },
            {
                title:'物品条形码',
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
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"
            }
        ]
    });
    /*------------------------------------表格数据--------------------------------*/
    conditionSelect();
    /*-------------------------------------按钮事件-------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //验证时间
        if( $('.min').val() == '' || $('.max').val() == '' ){
            var myModal = $('#myModal2')
            myModal.find('.modal-body').html('起止时间不能为空');
            moTaiKuang(myModal);
        }else{
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                var myModal = $('#myModal2');
                //提示框
                myModal.find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang(myModal);
            }else{
                conditionSelect();
            }
        }
    })
    //新增按钮
    $('.creatButton').on('click',function(){
        //可编辑状态
        var lis = $('#myApp33').children();
        for(var i=0;i<lis.length;i++){
            lis.eq(i).children().eq(1).children().attr('disabled',false);
        }
        //新增物品按钮隐藏
        $('.zhiXingRenYuanButton').show();
        //入库产品删除按钮不可操作
        $('#personTable1 tbody').find('.option-shanchu').attr('disabled',false);
        //确定按钮显示
        $('#myModal').find('.confirm').show();
        //动态添加类名dengji删除bianji类
        $('#myModal').find('.confirm').removeClass('bianji').addClass('dengji');
        //新增物品按钮
        $('.tableHovers').children('.condition-query').show();
        //初始化登记框
            myApp33.bianhao = '';
            myApp33.rkleixing = '1';
            myApp33.gysbianhao = '';
            myApp33.gysmingcheng = '';
            myApp33.gyslianxiren = '';
            myApp33.gysdizhi = '';
            myApp33.zhidanren = '';
            myApp33.remarks = '';
            myApp33.gysphone = ''
        //物品登记表格清空；
        _rukuArr = [];
        datasTable($('#personTable1'),_rukuArr);
        moTaiKuang($('#myModal'));
    })
    //重置按钮(点击重置按钮的时候，所有input框清空，时间还原成今天的)
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })
    //新增物品按钮(出现模态框)
    $('.zhiXingRenYuanButton').on('click',function(){
        //初始化入库物品
        workDone.itemNum = '';
        workDone.mingcheng = '';
        workDone.itemBarCode = '';
        workDone.batchNum = '';
        workDone.num = '';
        workDone.inPrice = '';
        workDone.amount = '';
        moTaiKuang($('#myModal1'));
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
    //新增确定按钮（点击确定按钮，与数据库发生交互）
    $('#myModal').on('click','.dengji',function(){
        var inStoreDetails1 = [];
        //入库单的信息
        for(var i=0;i<_rukuArr.length;i++){
            var obj = {};
            obj.itemNum = _rukuArr[i].itemNum;
            obj.itemName = _rukuArr[i].itemName;
            obj.itemBarCode = _rukuArr[i].itemBarCode;
            obj.batchNum = _rukuArr[i].batchNum;
            obj.num = _rukuArr[i].num;
            obj.inPrice = _rukuArr[i].inPrice;
            obj.amount = _rukuArr[i].amount;
            obj.userID=_userIdName;
            inStoreDetails1.push(obj);
        }
        //获取填写的入库信息
        var prm = {
            'inType':myApp33.rkleixing,
            'supNum':myApp33.gysbianhao,
            'supName':myApp33.gysmingcheng,
            'contactName':myApp33.gyslianxiren,
            'phone':myApp33.gysphone,
            'address':myApp33.gysdizhi,
            'remark':myApp33.remarks,
            'inStoreDetails':inStoreDetails1,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWCK/ywCKAddInStorage',
            data:prm,
            success:function(result){
                if(result == 99){
                    $('#myModal2').find('.btn-primary').removeClass('daShanchu');
                    $('#myModal2').find('.btn-primary').removeClass('xiaoShanchu');
                    $('#myModal2').find('.modal-body').html('添加成功');
                    moTaiKuang($('#myModal2'));
                    conditionSelect();
                }

            }
        })
    });
    //弹窗关闭按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    $('.main-contents-table .table tbody')
        //表格查看
        .on('click','.option-see',function(){
            //新增按钮置为不可操作
            $('.tableHovers').children('.condition-query').hide();
            //动态删除类名dengji
            $('#myModal').find('.confirm').removeClass('dengji').removeClass('bianji');
            //样式
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').html();
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    myApp33.rkleixing = $.trim($('#myApp33').find('select').find('option').eq(_allData[i].inType-1).val());
                    myApp33.bianhao = _allData[i].orderNum;
                    myApp33.gysbianhao = _allData[i].supNum;
                    myApp33.gysmingcheng = _allData[i].supName;
                    myApp33.gyslianxiren = _allData[i].contactName;
                    myApp33.gysdizhi = _allData[i].address;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.gysphone = _allData[i].phone;
                    myApp33.zhidanren = _allData[i].createUser;
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
                url:_urls + 'YWCK/ywCKGetInStorageDetail',
                data:prm,
                async:false,
                success:function(result){
                    datasTable($('#personTable1'),result)
                }
            })
            //所有操作框均为只读
            var lis = $('#myApp33').children();
            for(var i=0;i<lis.length;i++){
                lis.eq(i).children().eq(1).children().attr('disabled',true);
            }
            //新增物品按钮隐藏
            $('.zhiXingRenYuanButton').hide();
            //入库产品删除按钮不可操作
            $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
        })
        //表格编辑
        .on('click','.option-edit',function(){
            $('.tableHovers').children('.condition-query').show();
            //动态删除类名dengji
            $('#myModal').find('.confirm').removeClass('dengji').addClass('bianji');
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').html();
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    myApp33.rkleixing = $.trim($('#myApp33').find('select').find('option').eq(_allData[i].inType-1).val());
                    myApp33.bianhao = _allData[i].orderNum;
                    myApp33.gysbianhao = _allData[i].supNum;
                    myApp33.gysmingcheng = _allData[i].supName;
                    myApp33.gyslianxiren = _allData[i].contactName;
                    myApp33.gysdizhi = _allData[i].address;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.gysphone = _allData[i].phone;
                    myApp33.zhidanren = _allData[i].createUser;
                    myApp33.shijian = _allData[i].createTime;
                }
            }
            //获取当前入库单号的
            //判断如果是编辑功能的话，确认按钮出现
            $('#myModal').find('.confirm').show();
            moTaiKuang($('#myModal'));
            //获取入库信息的详细物品信息
            var prm = {
                'orderNum':$thisDanhao,
                'userID':_userIdName
            }
            //获得当前的页数，
            $thisTbale = $(this).parents('.table');
            currentTable = $thisTbale.next().next();
            currentPages = parseInt(currentTable.children('span').children('.paginate_button.current').index());
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKGetInStorageDetail',
                data:prm,
                async:false,
                success:function(result){
                    _rukuArr = [];
                    for(var i=0;i<result.length;i++){
                        _rukuArr.push(result[i]);
                    }
                    datasTable($('#personTable1'),result)
                }
            })
            //判断状态是已确认还是待确定
            if( $(this).next().html() == '已确认' ){
                //所有操作框均为只读
                var lis = $('#myApp33').children();
                for(var i=0;i<lis.length;i++){
                    lis.eq(i).children().eq(1).children().attr('disabled',true);
                }
                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').hide();
                //入库产品删除按钮不可操作
                $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
            }else if( $(this).next().html() == '待确认' ){
                //可编辑状态
                var lis = $('#myApp33').children();
                for(var i=0;i<lis.length;i++){
                    lis.eq(i).children().eq(1).children().attr('disabled',false);
                }
                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').show();
                //入库产品删除按钮不可操作
                $('#personTable1 tbody').find('.option-shanchu').attr('disabled',false);
            }
        })
        //删除入库单
        .on('click','.option-delete',function(){
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').html();
            _$thisRemoveRowDa = $thisDanhao;
            //提示框，确定要删除吗？
            var $myModal = $('#myModal3');
            //绑定信息
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    $('#rkabh').val(_allData[i].orderNum);
                    var aa = $.trim($('#myApp33').find('select').find('option').eq(_allData[i].inType-1).val());
                    if(aa == 1){
                        $('#rklx').val('采购入库');
                    }else if(aa == 2){
                        $('#rklx').val('借出退还入库');
                    }else{
                        $('#rklx').val('借用入库');
                    }
                }
            }
            moTaiKuang($myModal);
            //获得当前的页数，
            $thisTbale = $(this).parents('.table');
            currentTable = $thisTbale.next().next();
            currentPages = parseInt(currentTable.children('span').children('.paginate_button.current').index());
        })
        //入库单确认操作
        .on('click','.option-confirm',function(){
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').html();
            var prm = {
                'OrderNum':$thisDanhao,
                'userID':_userIdName
            }
            //获得当前的页数，
            $thisTbale = $(this).parents('.table');
            currentTable = $thisTbale.next().next();
            currentPages = parseInt(currentTable.children('span').children('.paginate_button.current').index());
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKConfirmInStorage',
                data:prm,
                success:function(result){
                    if(result == 99){
                        var $myModal = $('#myModal2');
                        $myModal.find('.modal-body').html('确认成功');
                        $myModal.find('.btn-primary').removeClass('.xiaoShanchu').removeClass('daShanchu');
                        moTaiKuang($myModal);
                        conditionSelect();
                        //点击一下当前的数字，自动指向当前页
                        currentTable.children('span').children('.paginate_button').eq(currentPages).click();
                    }
                }
            })
        })
        //入库已确认操作
        .on('click','.option-confirmed',function(){
            $('#myModal2').find('.modal-body').html('已确认，不能进行该操作');
            $('#myModal2').find('.btn-primary').removeClass('.xiaoShanchu').removeClass('daShanchu');
            moTaiKuang($('#myModal2'))
        })
    //表格编辑确认按钮
    $('#myModal').on('click','.bianji',function(){
        var inStoreDetails1 = [];
        //入库单的信息
        for(var i=0;i<_rukuArr.length;i++){
            var obj = {};
            obj.itemNum = _rukuArr[i].itemNum;
            obj.itemName = _rukuArr[i].itemName;
            obj.itemBarCode = _rukuArr[i].itemBarCode;
            obj.batchNum = _rukuArr[i].batchNum;
            obj.num = _rukuArr[i].num;
            obj.inPrice = _rukuArr[i].inPrice;
            obj.amount = _rukuArr[i].amount;
            obj.userID=_userIdName;
            inStoreDetails1.push(obj);
        }
        var prm = {
            'orderNum':myApp33.bianhao,
            'inType':myApp33.rkleixing,
            'supNum':myApp33.gysbianhao,
            'supName':myApp33.gysmingcheng,
            'contactName':myApp33.gyslianxiren,
            'phone':myApp33.gysphone,
            'address':myApp33.gysdizhi,
            'remark':myApp33.remarks,
            'inStoreDetails':inStoreDetails1,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWCK/ywCKEditInStorage',
            data:prm,
            success:function(result){
                var $myModal = $('#myModal2');
                $myModal.find('.btn-primary').removeClass('.daShanchu');
                $myModal.find('.btn-primary').removeClass('.xiaoShanchu');
                $myModal.find('.modal-body').html('修改成功');
                moTaiKuang($myModal);
                conditionSelect();
                //点击一下当前的数字，自动指向当前页
                currentTable.children('span').children('.paginate_button').eq(currentPages).click();

            }
        })
    })
    //增加入库单操作(仅仅是全端静态操作，没有涉及数据库)
    $('#myModal1').on('click','.ruku',function(){
        //验证必填项
        if( workDone.bianhao == '' || workDone.mingcheng == '' || workDone.num == '' ){
            var myModal = $('#myModal2');
            //提示框
            myModal.find('.modal-body').html('请填写红色必填项');
            moTaiKuang(myModal);
        }else{
            //获取入库单信息创建对象，存入_rukuArr数组
            var rukuDan = {};
            rukuDan.itemNum = workDone.bianhao;
            rukuDan.itemName = workDone.mingcheng;
            rukuDan.itemBarCode = workDone.itemBarCode;
            rukuDan.batchNum = workDone.batchNum;
            rukuDan.num = workDone.num;
            rukuDan.inPrice = workDone.inPrice;
            rukuDan.amount = workDone.amount;
            _rukuArr.push(rukuDan);
            datasTable($('#personTable1'),_rukuArr);
            $('#myModal1').modal('hide');
        }
    })
    //删除入库物品操作
    $('#personTable1 tbody').on('click','.option-shanchu',function(){
        _$thisRemoveRowXiao = $(this);
        $('#myModal2').find('.modal-body').html('确定要删除吗？');
        moTaiKuang($('#myModal2'));
        //新添加类名，实现入库单操作；
        $('#myModal2').find('.btn-primary').removeClass('daShanchu').addClass('xiaoShanchu');
        $('#myModal2').find('.btn-primary').addClass('xiaoShanchu');
    });
    //入库物品删除操作按钮
    $('#myModal2').on('click','.xiaoShanchu',function(){
        //首先获取当前删除的表格的编码
        var $this = _$thisRemoveRowXiao.parents('tr').children('.bianma').html();
        _rukuArr.removeByValue($this);
        datasTable($('#personTable1'),_rukuArr);
        $(this).removeClass('xiaoShanchu');
    })
    //入库单确认删除操作
    $('.modal').on('click','.daShanchu',function(){
        var prm = {
            'orderNum':_$thisRemoveRowDa,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKDelInStorage',
            data:prm,
            success:function(result){
                if(result == 99){
                    moTaiKuang($('#myModal5'));
                    conditionSelect();
                    $('#myModal3').modal('hide');
                    //点击一下当前的数字，自动指向当前页
                    var tablePageLength = currentTable.children('span').children('.paginate_button').length-1
                    if(currentPages <= tablePageLength){
                        currentTable.children('span').children('.paginate_button').eq(currentPages).click();
                    }else{
                        currentPages = currentPages -1;
                        currentTable.children('span').children('.paginate_button').eq(currentPages).click();
                    }
                }
            }
        })
    })
    //选择物品列表
    $('#wuPinListTable tbody').on('click','tr',function(){
        $('#wuPinListTable tbody').children('tr').removeClass('tables-hover');
        $(this).addClass('tables-hover');
        _$thisWP = $(this).children('.bianma').html();
    })
    //物品选中列表的确定按钮
    $('#myModal4').find('.btn-primary').on('click',function(){
        for(var i=0;i<_wpListArr.length;i++){
            if(_wpListArr[i].itemNum == _$thisWP){
                //赋值
                workDone.bianhao = _wpListArr[i].itemNum;
                workDone.mingcheng = _wpListArr[i].itemName;
                workDone.itemBarCode = _wpListArr[i].itemBarCode;
            }
        }
    });
    /*------------------------------------其他方法-------------------------------*/
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
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[1] + ' 00:00:00';
        realityEnd = moment(filterInput[2]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            'st':realityStart,
            'et':realityEnd,
            'orderNum':filterInput[0],
            'inType':$('.tiaojian').val(),
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetInStorage',
            async:false,
            data:prm,
            success:function(result){
                //状态为待确认的数组
                var confirm = [];
                var confirmed = [];
                _allData = [];
               for(var i=0;i<result.length;i++){
                   _allData.push(result[i]);
               }
                for(var i=0;i<result.length;i++){
                        if(result[i].status == 0){
                            confirm.push(result[i])
                        }else if(result[i].status == 1){
                            confirmed.push(result[i])
                        }
                    }
                datasTable($('#scrap-datatables1'),confirm);
                datasTable($('#scrap-datatables2'),confirmed);
                datasTable($('#scrap-datatables'),result);

            }
        })
    }
    //根据value删除数组
    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i].itemNum == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
})