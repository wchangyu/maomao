$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间
    //设置初始时间
    var _initStart = moment().subtract(7,'day').format('YYYY/MM/DD');

    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);


        //存放选中的物品编码
    var _thisBianhao,_thisMingcheng;

    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    })

    //存放当前列表的数据
    var _allData = [];

    //存放选中当前选中的物品分类
    var _$thisFL = '';

    //存放所有物品分类的数组
    var _elArr = [];

    //入库产品详情查看
    var rukuObject = new Vue({
        el:'#rukuObject',
        data:{
            bianhao:'',
            mingcheng:'',
            size:'',
            durable:0,
            goodsId:'',
            unit:'',
            quality:'',
            warranty:'',
            num:'',
            inPrice:'',
            amount:'',
            remark:''
        }
    });

    //新增入库单vue对象
    var putInList = new Vue({
        el:'#myApp3',
        data:{
            bianhao:'',
            rkleixing:'',
            suppliermc:'',
            suppliercontent:'',
            supplierphone:'',
            ckselect:'',
            zhidanren:'',
            shijian:'',
            remarks:'',
            shremarks:''
        },
        methods:{
            selectSupplier:function(){
                putInList.suppliercontent = $('#supplier').children('option:selected').attr('data-content');
                putInList.supplierphone = $('#supplier').children('option:selected').attr('data-phone');
            }
        }
    })

    //新增出库单的vue对象
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
            shRemarks:'',
            chezhan:''
        },
        methods:{

        }
    });

    //出库
    var chukuObject = new Vue({
        el:'#chukuObject',
        data:{
            ck:'',
            bianhao:'',
            mingcheng:'',
            size:'',
            picked:'',
            goodsId:'',
            unit:'',
            quality:'',
            warranty:'',
            shengyu:'',
            num:'',
            outPrice:'',
            amount:'',
            gdCode:'',
            chezhan:'',
            remark:'',
            cangkuNum:''
        }
    })


    /*-------------------------------------表格初始化------------------------------*/
    var col = [
        {
            title:'单号',
            className:'orderNum',
            data:'orderNum',
            render:function(data, type, row, meta){
                if(row.inoutType == 1){
                    return '<a href="godownEntry.html?orderNum=' + row.orderNum +
                        '" target="_blank">' + row.orderNum + '</a>'
                }if(row.inoutType == 2){
                    return '<a href="outboundOrder.html?orderNum=' + row.orderNum +
                        '" target="_blank">' + row.orderNum + '</a>'
                }
            }
        },
        {
            title:'类型',
            className:'mingcheng',
            data:'inoutType',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '入库单'
                }if(data == 2){
                    return '出库单'
                }
            }
        },
        {
            title:'出入库类型',
            data:'inoutCat'
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
            title:'审核时间',
            data:'auditTime'
        },
        {
            title:'审核人',
            data:'auditUser'
        },
        {
            title:'入库仓库',
            data:'storageName'
        },
        {
            title:'供货商',
            data:'supName'
        },
        {
            title:'出库材料员',
            data:'cusName'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-see btn default btn-xs purple'><i class='fa fa-edit'></i>查看</span><span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>撤销审核</span>"
        }
    ];
    _tableInit($('#scrap-datatables'),col,'1','flag','','');

    //选择入库产品表格
    var col1 = [
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
            title:'库区',
            data:'localName',
            className:'localName',
            render:function(data, type, full, meta){
                return '<span data-num="' + full.localNum +
                    '">'+ data + '</span>'
            }
        },
        {
            title:'物品序列号',
            data:'sn',
            className:'sn'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num',
            className:'right-justify'
        },
        {
            title:'入库单价',
            data:'inPrice',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = parseFloat(data).toFixed(2)
                return data
            }
        },
        {
            title:'总金额',
            data:'amount',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = parseFloat(data).toFixed(2)
                return data
            }
        },
        {
            title:'品质',
            data:'batchNum'
        },
        {
            title:'备注',
            data:'inMemo'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"
        }
    ];
    _tableInit($('#personTable1'),col1,'1','','','');

    //查看详情的表格
    var col3 = [
        {
            title:'仓库',
            data:'storageName'
        },
        {
            title:'库区',
            data:'localName'
        },
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
            title:'物品序列号',
            data:'sn'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num',
            className:'right-justify'
        },
        {
            title:'出库单价',
            data:'outPrice',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = parseFloat(data).toFixed(2)
                return data
            }
        },
        {
            title:'总金额',
            data:'amount',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = parseFloat(data).toFixed(2)
                return data
            }
        },
        {
            title:'品质',
            data:'batchNum'
        },
        {
            title:'备注',
            data:'outMemo'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){
                var html = "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span>";
                if(full.gdCode2 != ''){
                    html +=   "<span class='data-option option-materials btn default btn-xs green-stripe'><a href='materialOdd.html?gdCode=" + full.gdCode2 +
                        "&orderNum=" + full.orderNum +
                        "&itemNum=" + full.itemNum +
                        "&storageNum=" + full.storageNum +
                        "&sn=" + full.sn +
                        "' target=_blank>用料单</a></span>"
                }
                return html;
            }
            //"defaultContent": "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span><span class='data-option option-materials btn default btn-xs green-stripe'>用料单</span>"

        }
    ];

    _tableInit($('#personTable2'),col3,'1','','','');

    //表格数据加载
    conditionSelect();

    /*-------------------------------------按钮事件-------------------------------*/

    //重置按钮
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //类型重置
        $('.tiaojian').val('0');
    });

    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    });


    //查看功能
    $('#scrap-datatables  tbody')
        .on('click','.option-see',function(){

            if($(this).parents('tr').find('.mingcheng').html() == '入库单'){
                //初始化
                newButtonInit();

                //修改物品按钮消失
                $('.zhiXingRenYuanButton').hide();

                //导入入库单按钮消失
                $('.chukuDan').hide();

                //样式
                var $this = $(this).parents('tr');

                $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

                $this.addClass('tables-hover');

                var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();

                _ruCode = $thisDanhao;

                _moTaiKuang($('#myModal1'), '查看', 'flag', '' ,'', '');

                //绑定数据
                bindData($thisDanhao);

                //重新配置表格按钮
                var col1 = [
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
                        title:'库区',
                        data:'localName',
                        className:'localName',
                        render:function(data, type, full, meta){
                            return '<span data-num="' + full.localNum +
                                '">'+ data + '</span>'
                        }
                    },
                    {
                        title:'物品序列号',
                        data:'sn',
                        className:'sn'
                    },
                    {
                        title:'规格型号',
                        data:'size'
                    },
                    {
                        title:'单位',
                        data:'unitName'
                    },
                    {
                        title:'数量',
                        data:'num',
                        className:'right-justify'
                    },
                    {
                        title:'入库单价',
                        data:'inPrice',
                        className:'right-justify',
                        render:function(data, type, full, meta){
                            var data = parseFloat(data).toFixed(2)
                            return data
                        }
                    },
                    {
                        title:'总金额',
                        data:'amount',
                        className:'right-justify',
                        render:function(data, type, full, meta){
                            var data = parseFloat(data).toFixed(2)
                            return data
                        }
                    },
                    {
                        title:'品质',
                        data:'batchNum'
                    },
                    {
                        title:'备注',
                        data:'inMemo'
                    },
                    {
                        title:'操作',
                        "targets": -1,
                        "data": null,
                        "defaultContent": "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span>"
                    }
                ];

                _tableInit($('#personTable1'),col1,'1','','','');

                //入库产品详情
                function detailTable(data){

                    _datasTable($('#personTable1'),data);
                }

                detailInfo($thisDanhao,detailTable);

                //不可操作
                rudNotEdit();

                //审核备注消失
                $('.shRemarks').hide();
            }else{

                //审核备注不显示
                $('.shRemarks').hide();
                //新增按钮置为不可操作
                $('.tableHovers').children('.condition-query').hide();

                var $this = $(this).parents('tr');
                $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

                $this.addClass('tables-hover');

                var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();

                _$thisRKnum = $thisDanhao;

                for(var i=0;i<_allData.length;i++){
                    if(_allData[i].orderNum == $thisDanhao){
                        //绑定数据
                        myApp33.rkleixing = _allData[i].inoutCat;
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
                _moTaiKuang($('#myModal0'), '出库产品详情', 'flag', '' ,'', '');
                //获取入库信息的详细物品信息
                function sucFun1(result){
                    _datasTable($('#personTable2'),result)
                }
                detailInfo1($thisDanhao,sucFun1);

                //所有输入框不可编辑
                rudNotEdit1($('#myModal0'));
                rudNotEdit1($('#myModal00'));

                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').hide();
                //入库产品删除按钮不可操作
                $('#personTable2 tbody').find('.option-shanchu').attr('readonly','readonly');
            }

        })
        .on('click','.option-delete',function(){

            if($(this).parents('tr').find('.mingcheng').html() == '入库单'){
                //初始化
                newButtonInit();

                //修改物品按钮消失
                $('.zhiXingRenYuanButton').hide();

                //导入入库单按钮消失
                $('.chukuDan').hide();

                //样式
                var $this = $(this).parents('tr');

                $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

                $this.addClass('tables-hover');

                var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();

                _ruCode = $thisDanhao;

                _moTaiKuang($('#myModal1'), '撤销审核', '', '' ,'', '撤销审核');

                //绑定数据
                bindData($thisDanhao);

                //重新配置表格按钮
                var col1 = [
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
                        title:'库区',
                        data:'localName',
                        className:'localName',
                        render:function(data, type, full, meta){
                            return '<span data-num="' + full.localNum +
                                '">'+ data + '</span>'
                        }
                    },
                    {
                        title:'物品序列号',
                        data:'sn',
                        className:'sn'
                    },
                    {
                        title:'规格型号',
                        data:'size'
                    },
                    {
                        title:'单位',
                        data:'unitName'
                    },
                    {
                        title:'数量',
                        data:'num',
                        className:'right-justify'
                    },
                    {
                        title:'入库单价',
                        data:'inPrice',
                        className:'right-justify',
                        render:function(data, type, full, meta){
                            var data = parseFloat(data).toFixed(2)
                            return data
                        }
                    },
                    {
                        title:'总金额',
                        data:'amount',
                        className:'right-justify',
                        render:function(data, type, full, meta){
                            var data = parseFloat(data).toFixed(2)
                            return data
                        }
                    },
                    {
                        title:'品质',
                        data:'batchNum'
                    },
                    {
                        title:'备注',
                        data:'inMemo'
                    },
                    {
                        title:'操作',
                        "targets": -1,
                        "data": null,
                        "defaultContent": "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span>"
                    }
                ];

                _tableInit($('#personTable1'),col1,'1','','','');

                //入库产品详情
                function detailTable(data){

                    _datasTable($('#personTable1'),data);
                }

                detailInfo($thisDanhao,detailTable);

                //不可操作
                rudNotEdit();

                //审核备注消失
                $('.shRemarks').hide();
            }else{

                //审核备注不显示
                $('.shRemarks').hide();
                //新增按钮置为不可操作
                $('.tableHovers').children('.condition-query').hide();

                var $this = $(this).parents('tr');
                $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

                $this.addClass('tables-hover');

                var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();

                _$thisRKnum = $thisDanhao;

                for(var i=0;i<_allData.length;i++){
                    if(_allData[i].orderNum == $thisDanhao){
                        //绑定数据
                        myApp33.rkleixing = _allData[i].inoutCat;
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
                _moTaiKuang($('#myModal0'), '撤销审核', '', '' ,'', '撤销审核');
                //获取入库信息的详细物品信息
                function sucFun1(result){
                    _datasTable($('#personTable2'),result)
                }
                detailInfo1($thisDanhao,sucFun1);

                //所有输入框不可编辑
                rudNotEdit1($('#myModal0'));
                rudNotEdit1($('#myModal00'));

                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').hide();
                //入库产品删除按钮不可操作
                $('#personTable2 tbody').find('.option-shanchu').attr('readonly','readonly');
            }

        })
    //入库查看
    $('#personTable1')
        .on('click','.option-see1',function(){

                //所有输入框不可编辑
                rudNotEdit1($('#myModal11'));

                //模态框
                _moTaiKuang($('#myModal11'), '入库产品详情', 'flag', '' ,'', '');

                //初始化
                seeDetail();

                //赋值
                function secondView(data){

                    //物品编号
                    rukuObject.bianhao =  data[0].itemNum;
                    //物品名称
                    rukuObject.mingcheng =  data[0].itemName;
                    //规格型号
                    rukuObject.size = data[0].size;
                    //是否耐用
                    rukuObject.durable = data[0].isSpare;
                    //序列号
                    rukuObject.goodsId = data[0].sn;
                    //单位
                    rukuObject.unit = data[0].unitName;
                    //品质
                    rukuObject.quality = data[0].batchNum;
                    //质保期
                    rukuObject.warranty = data[0].maintainDate;
                    //数量
                    rukuObject.num = data[0].num;
                    //入库单价
                    rukuObject.inPrice = Number(data[0].inPrice).toFixed(2);
                    //金额
                    rukuObject.amount = Number(data[0].amount).toFixed(2);
                    //备注
                    rukuObject.remark = data[0].inMemo;
                    //单选按钮
                    if(rukuObject.durable == 0){

                        $('.durable').parent('span').removeClass('checked');

                        $('#second').parent('span').addClass('checked');

                    }else{

                        $('.durable').parent('span').removeClass('checked');

                        $('#first').parent('span').addClass('checked');
                    }

                }

                detailInfo(_ruCode,secondView);
        })

    //出库查看
    $('#personTable2')
        .on('click','.option-see1',function(){
            _moTaiKuang($('#myModal00'), '出库产品详情', 'flag', '' ,'', '');
            //获取详情赋值
            function sucFun3(result){
                chukuObject.ck = result[0].storageName;
                chukuObject.bianhao = result[0].itemNum;
                chukuObject.mingcheng = result[0].itemName;
                chukuObject.size = result[0].size;
                chukuObject.picked = result[0].isSpare;
                chukuObject.goodsId = result[0].sn;
                chukuObject.unit = result[0].unitName;
                chukuObject.quality = result[0].batchNum;
                chukuObject.warranty = result[0].maintainDate;
                chukuObject.num = result[0].num;
                chukuObject.outPrice = result[0].outPrice;
                chukuObject.amount = result[0].amount;
                chukuObject.gdCode = result[0].gdCode2;
                chukuObject.chezhan = result[0].bxKeshi;
                chukuObject.remark = result[0].outMemo;
                if(chukuObject.picked == 0){
                    $('.durable').parent('span').removeClass('checked');
                    $('.durable').parent('span').eq(1).addClass('checked');
                }else{
                    $('.durable').parent('span').removeClass('checked');
                    $('.durable').parent('span').eq(0).addClass('checked');
                }
            }
            //所有信息不可编辑
            $('#chukuObject').find('.gdList').children('.input-blockeds').addClass('disabled-block');
            $('#chukuObject').find('.gdList').children('.input-blockeds').children('input').addClass('disabled-block').attr('readonly','readonly');
            detailInfo1(_$thisRKnum,sucFun3);

        })

    //撤销审核
    $('#myModal1 .btn-primary').on('click',function(){

        //获取单号
        var orderNum = $('#myModal1 .order-num').val();

        meltAudit($('#myModal1'),orderNum,'YWCK/CancelInstorage');

    });

    $('#myModal0 .btn-primary').on('click',function(){

        //获取单号
        var orderNum = $('#myModal0 .order-num').val();

        meltAudit($('#myModal0'),orderNum,'YWCK/CancelOutstorage');

    });


    /*------------------------------------其他方法-------------------------------*/

    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        //获取类型
        var type = $('.condition-query .tiaojian').val();
        console.log(filterInput[0]);
        var prm = {
            'orderNum':filterInput[0],
            'st':filterInput[1],
            'et':filterInput[2],
            'inoutType':type,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetConfirmedOrders',
            data:prm,
            success:function(result){
                console.log(result);
                _allData = [];
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i])
                }
                _datasTable($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //新增按钮初始化
    function newButtonInit(){
        putInList.bianhao = '';

        putInList.rkleixing = '';

        putInList.suppliermc = '';

        putInList.suppliercontent = '';

        putInList.supplierphone = '';

        putInList.ckselect = '';

        putInList.zhidanren = '';

        putInList.shijian = '';

        putInList.remarks = '';

        putInList.shremarks = '';

        //表格数据初始化
        var arr = [];

        _datasTable($('#personTable1'),arr);

    }

    //入库单赋值
    function bindData(num){

        for(var i=0;i<_allData.length;i++){
            //绑定数据
            if(_allData[i].orderNum == num){
                //入库单号
                putInList.bianhao = _allData[i].orderNum;
                //入库单类型
                putInList.rkleixing = _allData[i].inoutCat;
                //供货方名称
                putInList.suppliermc = _allData[i].supName;
                //供货方联系人
                putInList.suppliercontent = '';
                //供货方联系电话
                putInList.supplierphone = _allData[i].phone;
                //仓库
                putInList.ckselect = _allData[i].storageName;
                //制单人
                putInList.zhidanren = _allData[i].createUser;
                //制单时间
                putInList.shijian = _allData[i].createTime;
                //备注
                putInList.remarks = '';
                //审核备注
                putInList.shremarks = '';
                //入库产品赋值
                //console.log(_allData[i]);
            }
        }

    }

    //入库产品详情
    function detailInfo(num,seccessFun){

        var prm = {
            'orderNum':num,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetInStorageDetail',
            data:prm,
            success:function(result){

                seccessFun(result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //根据工单号，获得备件详细信息
    function detailInfo1(num,seccessFun){
        var prm = {
            'orderNum':num,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorageDetail',
            data:prm,
            async:false,
            success:function(result){
                seccessFun(result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //入库单不可编辑
    function rudNotEdit(){

        //所有input框不可操作，并且置灰
        $('#myApp3').find('input').attr('readonly','readonly').addClass('disabled-block');

        $('#myApp3').find('input').parents('.input-blockeds').addClass('disabled-block');

        //所有select框不可操作，并且置灰
        $('#myApp3').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myApp3').find('select').parents('.input-blockeds').addClass('disabled-block');

        //所有textarea框不可操作，并且置灰
        $('#myApp3').find('textarea').attr('readonly','readonly').addClass('disabled-block');

    }

    function rudNotEdit1(dom){

        //所有input框不可操作，并且置灰
        dom.find('input').attr('readonly','readonly').addClass('disabled-block');

        dom.find('input').parents('.input-blockeds').addClass('disabled-block');

        //所有select框不可操作，并且置灰
        dom.find('select').attr('diasbled',true).addClass('disabled-block');

        dom.find('select').parents('.input-blockeds').addClass('disabled-block');

        //所有textarea框不可操作，并且置灰
        dom.find('textarea').attr('readonly','readonly').addClass('disabled-block');

    }

    //入库产品详情初始化
    function seeDetail(){

        //物品编号
        rukuObject.bianhao =  '';
        //物品名称
        rukuObject.mingcheng =  '';
        //规格型号
        rukuObject.size = '';
        //是否耐用
        rukuObject.durable = 0;
        //序列号
        rukuObject.goodsId = '';
        //单位
        rukuObject.unit = '';
        //品质
        rukuObject.quality = '';
        //质保期
        rukuObject.warranty = '';
        //数量
        rukuObject.num = 0;
        //入库单价
        rukuObject.inPrice = 0.00;
        //金额
        rukuObject.amount = 0.00;
        //备注
        rukuObject.remark = '';

    }

    //撤销审核
    function meltAudit(dom,orderNum,url){
        var prm = {
            'orderNum':orderNum,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole
        }

        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                console.log(result);
                dom.modal('hide');
                if(result == 99){
                    conditionSelect()
                }else if(result == 3){
                    _moTaiKuang($('#myModal3'), '提示', '', '撤销失败' ,'', '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})