$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //获得用户id
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //设置初始时间
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //
    var _num = -1;
    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    })
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
            'clydh':'',
            shRemarks:''
        }
    });
    //新增入库产品的vue对象
    var workDone = new Vue({
        'el':'#workDone',
        'data':{
            'bianhao':'',
            'mingcheng':'',
            'itemBarCode':'',
            'batchNum':'',
            'num':'',
            'outPrice':'',
            'amount':''
        },
        methods:{
            addFun1:function(){
                var mny = /^[0-9]*[1-9][0-9]*$/;
                if(workDone.num != ''){
                    if(mny.test(workDone.num)){
                        $('.format-error').hide();
                    }else{
                        $('.format-error').show();
                    }
                }else{
                    $('.format-error').hide();
                }
                workDone.amount = Number(workDone.inPrice) * Number(workDone.num);
            },
            searchbm:function(e){
                var e = e || window.event;
                //下键40 上键38
                if(e.keyCode == 40){
                    //按下键的时候，
                    //获得所有li
                    var lis = $('.accord-with-list').eq(0).children('li');
                    if(_num<lis.length-1){
                        _num ++;
                    }else{
                        _num = lis.length-1;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_num).addClass('li-color');
                    //首先获取ul的高度
                    var ulHeight = $('.accord-with-list').eq(0).height();
                    var num = parseInt(ulHeight/30);
                    //判断放了几个ul
                    if(_num > num){
                        var height = (_num - num) * 30;
                        $('.accord-with-list').eq(0).scrollTop(height);
                    }
                }else if(e.keyCode == 38){
                    var lis = $('.accord-with-list').eq(0).children('li');
                    if(_num<1){
                        _num =0;
                    }else{
                        _num--;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_num).addClass('li-color');
                    //首先获取ul的高度
                    var ulHeight = $('.accord-with-list').eq(0).height();
                    var num = parseInt(ulHeight/30);
                    if(_num < lis.length -num){
                        var height = (_num-num) * 30;
                        $('.accord-with-list').eq(0).scrollTop(height);
                    }

                }else if(e.keyCode == 13){
                    var lis = $('.accord-with-list').eq(0).children('li');
                    for(var i=0;i<lis.length;i++){
                        if(lis.eq(i).attr('class') == 'li-color'){
                            workDone.bianhao = lis.eq(i).children('.dataNum').html();
                            workDone.mingcheng = lis.eq(i).children('.dataName').html();
                            workDone.itemBarCode = lis.eq(i).attr('data-bar');
                            //选择完之后，关闭
                            $('.accord-with-list').hide();
                        }
                    }
                }else{
                    if(e.keyCode != 9){
                        $('.accord-with-list').eq(0).empty();
                        //将符合输入的项列出来
                        var searchValue = $.trim(workDone.bianhao);
                        var includeArr = [];
                        var str = '';
                        for(var i=0;i<_wpListArr.length;i++){
                            if(_wpListArr[i].itemNum.indexOf(searchValue)>=0 || _wpListArr[i].itemName.indexOf(searchValue)>=0 ){
                                includeArr.push(_wpListArr[i]);
                                str += '<li data-bar="' + _wpListArr[i].itemBarCode + '">' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                                    '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span></li>'
                            }
                        }
                        if(includeArr.length>0){
                            $('.accord-with-list').eq(0).show();
                        }
                        $('.accord-with-list').eq(0).append(str);
                    }
                }
            },
            searchmc:function(e){
                var e = e || window.event;
                //下键40 上键38
                if(e.keyCode == 40){
                    //按下键的时候，
                    //获得所有li
                    var lis = $('.accord-with-list').eq(1).children('li');
                    if(_num<lis.length-1){
                        _num ++;
                    }else{
                        _num = lis.length-1;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_num).addClass('li-color');
                }else if(e.keyCode == 38){
                    var lis = $('.accord-with-list').eq(1).children('li');
                    if(_num<1){
                        _num =0;
                    }else{
                        _num--;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_num).addClass('li-color');
                }else if(e.keyCode == 13){
                    var lis = $('.accord-with-list').eq(1).children('li');
                    for(var i=0;i<lis.length;i++){
                        if(lis.eq(i).attr('class') == 'li-color'){
                            workDone.bianhao = lis.eq(i).children('.dataNum').html();
                            workDone.mingcheng = lis.eq(i).children('.dataName').html();
                            workDone.itemBarCode = lis.eq(i).attr('data-bar');
                            //选择完之后，关闭
                            $('.accord-with-list').hide();
                        }
                    }
                }else{
                    if(e.keyCode != 9){
                        $('.accord-with-list').eq(1).empty();
                        //将符合输入的项列出来
                        var searchValue = $.trim(workDone.bianhao);
                        var includeArr = [];
                        var str = '';
                        for(var i=0;i<_wpListArr.length;i++){
                            if(_wpListArr[i].itemNum.indexOf(searchValue)>=0 || _wpListArr[i].itemName.indexOf(searchValue)>=0 ){
                                includeArr.push(_wpListArr[i]);
                                str += '<li data-bar="' + _wpListArr[i].itemBarCode + '">' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                                    '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span></li>'
                            }
                        }
                        if(includeArr.length>0){
                            $('.accord-with-list').eq(1).show();
                        }
                        $('.accord-with-list').eq(1).append(str);
                    }
                }
            },
        }
    });
    //存放入库产品的数组
    var _rukuArr = [];
    //存放当前条件下的所有数据
    var _allData = [];
    //存放删除入库单
    var _$thisRemoveRowDa = '';
    //存放入库单当前删除行的坐标
    var _$thisRemoveRowXiao = '';
    //存放物品列表
    var _wpListArr = [];
    //当前选中的一条物品列表
    var _$thisWP = '';
    //仓库选择
    warehouse($('#ckselect'));
    warehouse($('#ckSelect1'));
    //出库类型
    rkLX();
    rkLX('flag');

    /*-------------------------------------表格初始化------------------------------*/
    var _tables = $('.main-contents-table .table').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
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
                title:'出库单号',
                data:'orderNum',
                className:'orderNum'
            },
            {
                title:'出库类型',
                data:'outType',
                render:function(data, type, full, meta){
                    if(data == 9){
                        return '其他'
                    }if(data == 1){
                        return '领用出库'
                    }if(data == 2){
                        return '借货出库'
                    }if(data == 3){
                        return '借用还出'
                    }
                },
                className:'outType'

            },
            {
                title:'工单号',
                data:'contractOrder'
            },
            {
                title:'材料员名称',
                data:'cusName'
            },
            {
                title:'材料员电话',
                data:'phone'
            },
            {
                title:'仓库',
                data:'storageName'
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
                            "<span class='data-option option-confirmed btn default btn-xs green-stripe'>已审核</span>" +
                            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                    }if(data == 0){
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                            "<span class='data-option option-confirm btn default btn-xs green-stripe'>待审核</span>" +
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
    $('.wptable').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
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
                text: '保存为excel格式',
                className:'saveAs hidding'
            }
        ],
        'columns':[
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
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"
            }
        ]
    });

    $('#wuPinListTable').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        "scrollX": true,
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
                title:'仓库',
                data:'storageName'
            },
            {
                title:'分类名称',
                data:'cateName'
            },
            {
                title:'剩余数量',
                data:'num'
            }
        ],
    });
    wlList();
    /*-------------------------------------按钮事件-------------------------------*/
    //状态选项卡
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
    });
    //查询按钮
    $('#selected').click(function(){
        //时间验证
        if( $('.min').val() == '' || $('.max').val() == '' ){
            var myModal = $('#myModal2');
            myModal.find('.modal-body').html('起止时间不能为空');
            moTaiKuang(myModal,'提示','flag');
        }else{
            if( $('.min').val() > $('.max').val() ){
                var myModal = $('#myModal2');
                //提示框
                myModal.find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang(myModal,'提示','flag');
            }else{
                conditionSelect();
            }
        }
    })
    //重置按钮
    //点击重置按钮的时候，所有input框清空，时间还原成今天的
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })
    //新增按钮(出现模态框)
    $('.creatButton').on('click',function(){
        //审核备注不显示
        $('.shRemarks').hide();
        //所有输入框不可操作；
        $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');
        $('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');
        $('#myApp33').find('textarea').attr('disabled',false);
        //新增物品按钮隐藏
        $('.zhiXingRenYuanButton').show();
        //入库产品删除按钮不可操作
        $('#personTable1 tbody').find('.option-shanchu').attr('disabled',false);
        //新增按钮置为不可操作
        $('.tableHovers').children('.condition-query').show();
        moTaiKuang($('#myModal'),'添加');
        //确定按钮显示
        $('#myModal').find('.confirm').show();
        //动态添加类名dengji删除bianji类
        $('#myModal').find('.confirm').removeClass('bianji').addClass('dengji');
        //初始化登记框
        myApp33.bianhao='';
        myApp33.rkleixing='';
        myApp33.zhidanren='';
        myApp33.remarks='';
        myApp33.shijian='';
        myApp33.ckselect='';
        myApp33.gdCode='';
        myApp33.clymc='';
        myApp33.clydh='';
        //产品登记表格清空；
        _rukuArr = [];
        datasTable($('#personTable1'),_rukuArr);
        moTaiKuang($('#myModal'),'添加');
    })
    //新增确认按钮
    $('#myModal').on('click','.dengji',function(){
        //先判断 必填项
        if(myApp33.rkleixing == ''){
            var myModal = $('#myModal2');
            //提示框
            myModal.find('.modal-body').html('请填写红色必填项');
            moTaiKuang(myModal,'提示','flag');
        }else{
            var outStoreDetails1 = [];
            //入库单的信息
            for(var i=0;i<_rukuArr.length;i++){
                var obj = {};
                obj.itemNum = _rukuArr[i].itemNum;
                obj.itemName = _rukuArr[i].itemName;
                obj.itemBarCode = _rukuArr[i].itemBarCode;
                obj.batchNum = _rukuArr[i].batchNum;
                obj.num = _rukuArr[i].num;
                obj.outPrice = _rukuArr[i].outPrice;
                obj.amount = _rukuArr[i].amount;
                obj.userID=_userIdNum;
                obj.userName = _userIdName;
                obj.storageName = _rukuArr[i].storageName;
                obj.storageNum = _rukuArr[i].storageNum;
                outStoreDetails1.push(obj);
            }
            //获取填写的入库信息
            var ckName = '';
            if($('#ckselect').val() == ''){
                ckName = ''
            }else{
                ckName = $('#ckselect').children('option:selected').html();
            }
            var prm = {
                'outType':myApp33.rkleixing,
                'remark':myApp33.remarks,
                'outStoreDetails':outStoreDetails1,
                'userID':_userIdNum,
                'storageName':ckName,
                'storageNum':$('#ckselect').val(),
                'contractOrder':myApp33.gdCode,
                'cusName':myApp33.clymc,
                'phone':myApp33.clydh
            }
            $.ajax({
                type:'post',
                url: _urls + 'YWCK/ywCKAddOutStorage',
                data:prm,
                success:function(result){
                    if(result == 99){
                        $('#myModal2').find('.modal-body').html('添加成功');
                        moTaiKuang($('#myModal2'),'提示','flag');
                        conditionSelect();
                        $('#myModal').modal('hide');
                    }else{
                        $('#myModal2').find('.modal-body').html('添加失败');
                        moTaiKuang($('#myModal2'),'提示','flag');
                    }

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    });
    //新增产品按钮(出现模态框)
    $('.zhiXingRenYuanButton').on('click',function(){
        //编辑的时候，编码和名称，条形码不能修改。
        $('.not-editable').attr('disabled',false).removeClass('disabled-block');
        //产品登记框清空；
        workDone.bianhao = '';
        workDone.mingcheng = '';
        workDone.itemBarCode = '';
        workDone.batchNum = '';
        workDone.num = '';
        moTaiKuang($('#myModal1'),'出库物品管理');
        //首先要获得原本的物品
        datasTable($('#wuPinListTable1'),_rukuArr);
        $('#myModal1').on('shown.bs.modal', function () {
            //自动聚焦
            $('.not-editable').eq(0).focus();
        })
    })
    //增加入库单操作(仅仅是全端静态操作，没有涉及数据库)
    $('#myModal1').on('click','.ruku',function(){
        $('#myModal1').modal('hide');
        datasTable($('#personTable1'),_rukuArr);
    })
    $('.main-contents-table .table tbody')
        .on('click','.option-see',function(){
            //审核备注不显示
            $('.shRemarks').hide();
            //新增按钮置为不可操作
            $('.tableHovers').children('.condition-query').hide();
            //动态删除类名dengji
            $('#myModal').find('.confirm').removeClass('dengji').removeClass('bianji');
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').html();
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    myApp33.rkleixing = _allData[i].outType;
                    myApp33.bianhao = _allData[i].orderNum;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.gysphone = _allData[i].phone;
                    myApp33.zhidanren = _allData[i].createUser;
                    myApp33.shijian = _allData[i].createTime;
                    myApp33.gdCode = _allData[i].contractOrder;
                    myApp33.clymc = _allData[i].cusName;
                    myApp33.clydh = _allData[i].phone;
                }
            }
            //获取当前入库单号的
            moTaiKuang($('#myModal'),'查看','flag')
            //获取入库信息的详细物品信息
            var prm = {
                'orderNum':$thisDanhao,
                'userID':_userIdNum
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKGetOutStorageDetail',
                data:prm,
                async:false,
                success:function(result){
                    datasTable($('#personTable1'),result)
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
            //所有输入框不可操作；
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true);
            //新增物品按钮隐藏
            $('.zhiXingRenYuanButton').hide();
            //入库产品删除按钮不可操作
            $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
        })
        .on('click','.option-edit',function(){
            //审核备注不显示
            $('.shRemarks').hide();
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
                    myApp33.rkleixing = _allData[i].outType;
                    myApp33.bianhao = _allData[i].orderNum;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.gysphone = _allData[i].phone;
                    myApp33.zhidanren = _allData[i].createUser;
                    myApp33.shijian = _allData[i].createTime;
                    myApp33.gdCode = _allData[i].contractOrder;
                    myApp33.clymc = _allData[i].cusName;
                    myApp33.clydh = _allData[i].phone;
                }
            }
            //获取当前入库单号的
            moTaiKuang($('#myModal'),'编辑');
            //获取入库信息的详细物品信息
            var prm = {
                'orderNum':$thisDanhao,
                'userID':_userIdNum
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKGetOutStorageDetail',
                data:prm,
                async:false,
                success:function(result){
                    _rukuArr = result;
                    datasTable($('#personTable1'),result)
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            });
            //判断状态是已确认还是待确定
            if( $(this).next().html() == '已审核' ){
                //所有输入框不可操作；
                $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
                $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
                $('#myApp33').find('textarea').attr('disabled',true);
                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').hide();
                //入库产品删除按钮不可操作
                $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
            }else if( $(this).next().html() == '待审核' ){
                //所有输入框不可操作；
                $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');
                $('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');
                $('#myApp33').find('textarea').attr('disabled',false);
                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').show();
                //入库产品删除按钮不可操作
                $('#personTable1 tbody').find('.option-shanchu').attr('disabled',false);
            }
        })
        //删除入库单
        .on('click','.option-delete',function(){
            //审核备注不显示
            $('.shRemarks').hide();
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
                    $('#ckabh').val(_allData[i].orderNum);
                    var aa = $.trim($('#myApp33').find('select').find('option').eq(_allData[i].outType-1).val());
                    if(aa == 1){
                        $('#cklx').val('领用出库');
                    }else if(aa == 2){
                        $('#cklx').val('借货出库');
                    }else if(aa == 3){
                        $('#cklx').val('借用还出');
                    }else{
                        $('#cklx').val('其他');
                    }
                }
            }
            moTaiKuang($myModal,'确定要删除吗？');
        })
        //入库单确认操作
        .on('click','.option-confirm',function(){
            $('.shRemarks').show();
            //绑定信息
            //新增按钮置为不可操作
            $('.tableHovers').children('.condition-query').hide();
            //动态删除类名dengji
            $('#myModal').find('.confirm').removeClass('dengji').removeClass('bianji');
            //样式
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').html();
            _$thisRKnum = $thisDanhao;
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    myApp33.rkleixing = _allData[i].outType;
                    myApp33.gdCode = _allData[i].contractOrder;
                    myApp33.clymc = _allData[i].cusName;
                    myApp33.clydh = _allData[i].phone;
                    myApp33.ckselect = _allData[i].storageNum;
                    myApp33.zhidanren = _allData[i].createUser;
                    myApp33.shijian = _allData[i].createTime;
                    myApp33.remarks = _allData[i].remark;
                    //myApp33.shRemarks = _allData[i].

                }
            }
            //判断如果是查看功能的话，确认按钮消失
            $('#myModal').find('.confirm').addClass('shenhe');
            //获取当前入库单号的
            moTaiKuang($('#myModal'),'审核');
            //获取入库信息的详细物品信息
            var prm = {
                'orderNum':$thisDanhao,
                'userID':_userIdNum,
                'userName':_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKGetOutStorageDetail',
                data:prm,
                async:false,
                success:function(result){
                    datasTable($('#personTable1'),result)
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
            //所有操作框均为只读
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true);
            $('.shRemarks').find('textarea').attr('disabled',false);
            //新增物品按钮隐藏
            $('.zhiXingRenYuanButton').hide();
            //入库产品删除按钮不可操作
            $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
        })
        //入库已确认操作
        .on('click','.option-confirmed',function(){
            $('#myModal2').find('.modal-body').html('已确认，不能进行该操作');
            moTaiKuang($('#myModal2'),'提示','flag');
        })
    //表格编辑确认按钮
    $('#myModal')
        .on('click','.bianji',function(){
        var outStoreDetails1 = [];
        //入库单的信息
        for(var i=0;i<_rukuArr.length;i++){
            var obj = {};
            obj.itemNum = _rukuArr[i].itemNum;
            obj.itemName = _rukuArr[i].itemName;
            obj.itemBarCode = _rukuArr[i].itemBarCode;
            obj.batchNum = _rukuArr[i].batchNum;
            obj.num = _rukuArr[i].num;
            obj.outPrice = _rukuArr[i].outPrice;
            obj.amount = _rukuArr[i].amount;
            obj.userID=_userIdNum;
            obj.userName = _userIdName;
            obj.storageName = _rukuArr[i].storageName;
            obj.storageNum = _rukuArr[i].storageNum;
            outStoreDetails1.push(obj);
        }
        var ckName = '';
        if($('#ckselect').val() == ''){
            ckName = ''
        }else{
            ckName = $('#ckselect').children('option:selected').html();
        }
        var prm = {
            'orderNum':myApp33.bianhao,
            'outType':myApp33.rkleixing,
            'remark':myApp33.remarks,
            'outStoreDetails':outStoreDetails1,
            'userID':_userIdNum,
            'storageName':ckName,
            'storageNum':$('#ckselect').val(),
            'contractOrder':myApp33.gdCode,
            'cusName':myApp33.clymc,
            'phone':myApp33.clydh
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWCK/ywCKEditOutStorage',
            data:prm,
            success:function(result){
                if(result == 99){
                    $('#myModal2').find('.modal-body').html('修改成功');
                    moTaiKuang($('#myModal2'),'提示','flag');
                    $('#myModal').modal('hide');
                    conditionSelect();
                }else{
                    $('#myModal2').find('.modal-body').html('修改失败');
                    moTaiKuang($('#myModal2'),'提示','flag');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })
        .on('click','.shenhe',function(){
            var prm = {
                'OrderNum':_$thisRKnum,
                'userID':_userIdNum,
                'userName':_userIdName,
                'auditMemo':myApp33.shRemarks
            }
            //获得当前的页数，
            $thisTbale = $(this).parents('.table');
            currentTable = $thisTbale.next().next();
            currentPages = parseInt(currentTable.children('span').children('.paginate_button.current').index());
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKConfirmOutStorage',
                data:prm,
                success:function(result){
                    if(result == 99){
                        var $myModal = $('#myModal2');
                        $myModal.find('.modal-body').html('确认成功');
                        moTaiKuang($myModal,'提示','flag');
                        $('#myModal').modal('hide');
                        conditionSelect();
                        //点击一下当前的数字，自动指向当前页
                        currentTable.children('span').children('.paginate_button').eq(currentPages).click();
                        $(this).removeClass('shenhe');
                    }else{
                        var $myModal = $('#myModal2');
                        $myModal.find('.modal-body').html('确认失败，可能是库存不足的原因！');
                        moTaiKuang($myModal,'提示','flag');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        })
    //入库单确认删除操作
    $('.modal').on('click','.daShanchu',function(){
        var prm = {
            'orderNum':_$thisRemoveRowDa,
            'userID':_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKDelOutStorage',
            data:prm,
            success:function(result){
                if(result == 99){
                    moTaiKuang($('#myModal5'),'提示','flag');
                    $('#myModal5').find('.modal-body').html('删除成功！')
                    conditionSelect();
                    $('#myModal3').modal('hide');
                }else{
                    moTaiKuang($('#myModal5'),'提示','flag');
                    $('#myModal5').find('.modal-body').html('删除失败！')
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })
    //删除入库产品操作
    $('#personTable1 tbody').on('click','.option-shanchu',function(){
        _$thisRemoveRowXiao = $(this);
        $('#myModal2').find('.modal-body').html('确定要删除吗？');
        moTaiKuang($('#myModal2'),'提示');
        //新添加类名，实现入库单操作；
        $('#myModal2').find('.btn-primary').removeClass('removeButton').addClass('xiaoShanchu');
    });
    //入库产品删除操作按钮
    $('#myModal2').on('click','.xiaoShanchu',function(){
        //首先获取当前删除的表格的编码
        var $this = _$thisRemoveRowXiao.parents('tr').children('.bianma').html();
        _rukuArr.removeByValue($this);
        datasTable($('#personTable1'),_rukuArr);
        $('#myModal2').modal('hide');
        $(this).removeClass('xiaoShanchu');
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
    //选择物品列表
    $('.tianJiaruku').click(function(){
        moTaiKuang($('#myModal4'));
        wlList('flag');
    });
    //出库物品条件查询
    $('#selected1').click(function(){
        wlList('flag');
    });
    //选择物品编码或名称
    $('.accord-with-list')
        .on('click',function(){
            var flag = $(this).parents('.input-blockeds').children('ul').attr('data-num');
            workDone.bianhao = $(this).children('.dataNum').html();
            $(this).parents('.input-blockeds').children('ul').hide();
            if(flag == 1){
                workDone.mingcheng = $(this).children('.dataName').html();
            }else{
                workDone.bianhao = $(this).children('.dataNum').html();
            }
        })
        .on('mouseover','li',function(){
            $(this).parent('.accord-with-list').children('li').removeClass('li-color');
            $(this).addClass('li-color');
            _num = $('.li-color').index();
    });
    //第二层的添加入库产品按钮
    $('#addRK').click(function(){
        //验证必填项
        if( workDone.bianhao == '' || workDone.mingcheng == '' || workDone.num == '' ){
            var myModal = $('#myModal2');
            //提示框
            myModal.find('.modal-body').html('请填写红色必填项');
            moTaiKuang(myModal,'提示','flag');
        }else{
            var mny = /^[0-9]*[1-9][0-9]*$/;
            if(mny.test(workDone.num)){
                //首先判断输入过了没
                var existFlag = false;
                for(var i=0;i<_rukuArr.length;i++){
                    if(workDone.bianhao == _rukuArr[i].itemNum){
                        existFlag = true;
                    }
                }
                if(existFlag){
                    //有
                    var myModal = $('#myModal2');
                    myModal.find('.modal-body').html('已添加过');
                    moTaiKuang(myModal,'提示','flag');
                }else{
                    //无
                    //获取入库单信息创建对象，存入_rukuArr数组
                    //首先获取仓库的值
                    var rukuDan = {};
                    rukuDan.itemNum = workDone.bianhao;
                    rukuDan.itemName = workDone.mingcheng;
                    rukuDan.itemBarCode = workDone.itemBarCode;
                    rukuDan.batchNum = workDone.batchNum;
                    rukuDan.num = workDone.num;
                    var ckName = '';
                    if($('#ckselect').val() == ''){
                        ckName = ''
                    }else{
                        ckName = $('#ckselect').children('option:selected').html();
                    }
                    rukuDan.storageName = ckName;
                    rukuDan.storageNum = $('#ckselect').val();
                    _rukuArr.push(rukuDan);
                    datasTable($('#wuPinListTable1'),_rukuArr);
                }
            }else{
                $('#myModal2').find('.modal-body').html('请输入格式正确的数量');
                moTaiKuang($('#myModal2'),'提示','flag');
            }
        }
    });
    //添加入库产品之后，重置按钮
    //重置
    $('#addReset').click(function(){
        workDone.bianhao = '';
        workDone.mingcheng = '';
        workDone.itemBarCode = '';
        workDone.batchNum = '';
        workDone.num = '';
        workDone.inPrice = '';
        workDone.amount = 0;
        //自动聚焦
        $('.not-editable').eq(0).focus();
        //所有框可操作
        $('.not-editable').attr('disabled',false).removeClass('disabled-block');
        $('#wuPinListTable1 tbody').children('tr').css('background','#ffffff');
    });
    $('#wuPinListTable1 tbody')
        .on('click','.option-shanchu',function(){
        _$thisRemoveRowXiao = $(this).parents('table').children('tbody').find('.bianma').html();
        $('#myModal2').find('.modal-body').html('确定要删除吗？');
        moTaiKuang($('#myModal2'),'提示');
        //新添加类名，实现入库单操作；
        $('#myModal2').find('.btn-primary').removeClass('xiaoShanchu').addClass('removeButton');

            event.stopPropagation();
    })
        //点击表格中的数据，将内容赋值给onput，以便编辑
        .on('click','tr',function(){
            //编辑的时候，编码和名称，条形码不能修改。
            $('.not-editable').attr('disabled',true).addClass('disabled-block');
            //样式修改
            $('#wuPinListTable1 tbody').children('tr').css({'background':'#ffffff'});
            $(this).css({'background':'#FBEC88'});
            var bm = $(this).find('.bianma').html();
            for(var i=0;i<_rukuArr.length;i++){
                if(_rukuArr[i].itemNum == bm){
                    //赋值
                    workDone.bianhao = _rukuArr[i].itemNum;
                    workDone.mingcheng = _rukuArr[i].itemName;
                    workDone.itemBarCode = _rukuArr[i].itemBarCode;
                    workDone.num = _rukuArr[i].num;
                    workDone.inPrice = _rukuArr[i].inPrice;
                    workDone.amount = _rukuArr[i].amount;
                }
            }
        });
    $('#myModal2').on('click','.removeButton',function(){
        //静态删除
        _rukuArr.removeByValue(_$thisRemoveRowXiao);
        datasTable($('#wuPinListTable1'),_rukuArr);
        $('this').removeClass('removeButton');
        $('#myModal2').modal('hide');
    });
    //失去焦点的时候
    $('.not-editable').blur(function(){
        $('.accord-with-list').hide();
    });
    $('#editRK').click(function(){
        $('.not-editable').attr('disabled',false).removeClass('disabled-block');
        if(workDone.bianhao == '' || workDone.mingcheng == '' || workDone.num == ''){
            var myModal = $('#myModal2');
            //提示框
            myModal.find('.modal-body').html('请填写红色必填项');
            moTaiKuang(myModal,'提示','flag');
        }else{
            var bm = workDone.bianhao;
            for(var i=0;i<_rukuArr.length;i++){
                if(bm == _rukuArr[i].itemNum){
                    _rukuArr[i].num = workDone.num;
                    _rukuArr[i].inPrice = workDone.inPrice;
                    _rukuArr[i].amount = workDone.amount;
                }
            }
            datasTable($('#wuPinListTable1'),_rukuArr.reverse());
            //编辑之后清空
            workDone.bianhao = '';
            workDone.mingcheng = '';
            workDone.itemBarCode = '';
            workDone.batchNum = '';
            workDone.num = '';
            workDone.inPrice = '';
            workDone.amount = 0;
            //自动聚焦
            $('.not-editable').eq(0).focus();
        }
    });
    /*------------------------------------表格数据--------------------------------*/
    conditionSelect();
    /*------------------------------------其他方法-------------------------------*/
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
            'outType':$('.tiaojian').val(),
            'userID':_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorage',
            data:prm,
            success:function(result){
                _allData = [];
                var confirm = [];
                var confirmed = [];
                    allData = result;
                    for(var i=0;i<result.length;i++){
                        _allData.push(result[i]);
                        if(result[i].status == 0){
                            confirm.push(result[i])
                        }else if(result[i].status == 1){
                            confirmed.push(result[i])
                        }
                    }
                    datasTable($('#scrap-datatables1'),confirm);
                    datasTable($('#scrap-datatables2'),confirmed);
                    datasTable($('#scrap-datatables'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //确定新增弹出框的位置
    function moTaiKuang(who, title, flag) {
        who.modal({
            show: false,
            backdrop: 'static'
        })
        who.find('.modal-title').html(title);
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight) / 2;
        who.find('.modal-dialog').css({'margin-top': markBlockTop});
        if (flag) {
            who.find('.btn-primary').hide();
        } else {
            who.find('.btn-primary').show();
        }
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
    //根据value删除数组
    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i].itemNum == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    //仓库选择
    function warehouse(el){
        var prm = {
            "userID": _userIdNum,
            "userName": _userIdName
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
                el.append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //获取物品列表
    function wlList(flag){
        var prm = {
            'ItemNum':$('.filterInput1').eq(0).val(),
            'itemName':$('.filterInput1').eq(1).val(),
            'storageNum':$('#ckSelect1').val(),
            'userID':_userIdNum
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptItemStock',
            async:false,
            data:prm,
            success:function(result){

                _wpListArr = result;
                if(flag){
                    datasTable($('#wuPinListTable'),result);
                }
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
            "userID": _userIdNum,
            "userName": _userIdName
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
})