$(function(){
    /*---------------------------------------------时间-----------------------------------------------------*/
    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间
    //设置初始时间
    var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');

    var _initEnd = moment().format('YYYY/MM/DD');

    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);

    //出库单条件搜索默认时间
    var _chuTime =  moment().format('YYYY/MM/DD');

    var _chuStartTime = moment().subtract(6,'months').format('YYYY/MM/DD');

    $('.chukumin').val(_chuStartTime);

    $('.chukumax').val(_chuTime);

    /*--------------------------------------------变量-----------------------------------------------------*/
    //存放当前所有入库单的数组
    var _allData = [];

    //入库类型方法
    rkLX(1);

    //出库类型方法
    rkLX(2);

    //存放所有仓库
    var _ckArr = [];

    //新增入库单vue对象
    var putInList = new Vue({
        el:'#myApp33',
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

    //入库产品vue对象
    var putInGoods = new Vue({
        el:'#workDone',
        data:{
            kuwei:'',
            bianhao:'',
            mingcheng:'',
            size:'',
            picked:'',
            goodsId:'',
            unit:'',
            quality:'',
            warranty:'',
            num:'',
            inprice:'',
            amount:'',
            remark:''
        },
        methods:{
            //验证方法：
            //数量正则
            addFun1:function(){
                var mny = /^[0-9]*[1-9][0-9]*$/;
                if(putInGoods.num != ''){
                    if(mny.test(putInGoods.num)){
                        $('.format-error').hide();
                    }else{
                        $('.format-error').show();
                    }
                }else{
                    $('.format-error').hide();
                }

                if( putInGoods.inprice != '' ){

                    var price = putInGoods.inprice;

                    putInGoods.inprice = Number(price).toFixed(2);
                }

                var amount = Number(putInGoods.inprice) * Number(putInGoods.num);

                putInGoods.amount = Number(amount).toFixed(2);
            },
            //物品序列号是否重复
            isequal:function(){
                if(putInGoods.picked == 0){
                    if(putInGoods.bianhao == putInGoods.goodsId){
                        $('.isEqual').hide();
                    }else{
                        $('.isEqual').show();
                    }
                }else{
                    //获取数据，用于去重
                    getWPid();
                }
            },
            //入库单价格式是否正确
            addFun2:function(){
                var mny = /^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/;
                if(putInGoods.inprice != ''){
                    if(mny.test(putInGoods.inprice)){
                        $('.format-error1').hide();
                    }else{
                        $('.format-error1').show();
                    }
                }else{
                    $('.format-error1').hide();
                }
                var amount = Number(putInGoods.inprice) * Number(putInGoods.num);
                putInGoods.amount = amount.toFixed(2);
            },
            //输入总金额，自动推单价
            addFun3:function(){
                var mny = /^([1-9][0-9]*(\.[0-9]{1,2})?|0\.(?!0+$)[0-9]{1,4})$/;

                if(mny.test(putInGoods.amount)){

                    $('.format-error3').hide();

                    //根据总金额得出单价
                    var danjia =  Number(putInGoods.amount)/Number(putInGoods.num);

                    putInGoods.inprice = danjia.toFixed(2);
                }else{

                    $('.format-error3').show();

                }
            },
            //总金额回车
            addFun5:function(){
                //总金额保留两位小时
                var amount = putInGoods.amount;

                putInGoods.amount = Number(amount).toFixed(2);

            },
            //单选按钮
            radios:function(){
                $('.inpus').click(function(){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            },
            //质保期聚焦日历插件显示
            focusFun:function(e){
                $('.pinzhixx').show();
            },
            //质保期失去焦点
            selectFun:function(e){
                upDown(e,$('.pinzhixx'),enterQualityName,inputQualityName);
            },
            //质保期选择
            time:function(){
                $('.datatimeblock').eq(2).datepicker({
                    language:  'zh-CN',
                    todayBtn: 1,
                    todayHighlight: 1,
                    format: 'yyyy/mm/dd',
                });
            },
            //质保期失去焦点事件
            timeblur:function(){
                setTimeout(function(){
                    $('.datepicker').hide();
                },200)
            },
            //库区输入事件
            kuweiFun:function(e){
                upDown(e,$('.kuqu-list'),enterFQName,inputFQName);
            },
            //物品编码输入事件
            searchbm:function(e){
                upDown(e,$('.accord-with-list').eq(0),enterBMName,inputBMName);
            }

        }
    });

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
    })

    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //供货方名称
    getSupplier();

    //供货商旋转
    var _rotate;

    //记录是不是点击了新增物品按钮
    var _addGoods = false;

    //记录初始值
    var _numIndex = -1;

    //根据仓库，获得对应的库区
    var _kuquArr = [];

    //存放物品数组
    var _wpListArr = [];

    //存放入库物品的数组(点击选择之后)
    var _rukuArr = [];

    //暂时存放已选择的数组
    var _tempRukuArr = [];

    //入库产品要删除的物品id

    var _$thisRemoveRowXiao = '';

    //当前选中的入库单号
    var _ruCode = '';

    //当前选中的出库单号
    var _chukuD = '';

    //判断制单人和审核人是不是一样
    var _examineRen = false;

    //是否可以自己审核
    var _isShenHe = sessionStorage.getItem('ckAuditType');

    //当前选中的物品编码
    var _$thisWP = '';

    //物品编码分类
    wpClass();

    /*--------------------------------------------表格初始化------------------------------------------------*/
    //入库单表格初始化（所有、待审核、已审核）
    var col = [
        {
            title:'入库单号',
            data:'orderNum',
            className:'orderNum',
            render:function(data, type, row, meta){
                return '<a href="godownEntry.html?orderNum=' + row.orderNum +
                    '" target="_blank">' + row.orderNum + '</a>'
            }
        },
        {
            title:'入库类型',
            data:'inType',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '出错'
                }
                if(data == 1){
                    return '采购入库'
                }if(data == 2){
                    return '暂估价入库'
                }if(data == 3){
                    return '调拨入库'
                }
            },
            className:'inType'

        },
        {
            title:'供货方名称',
            data:'supName'
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
            title:'审核时间',
            data:'auditTime'
        },
        {
            title:'制单人',
            data:'createUserName'
        },
        {
            title:'操作',
            data:'status',
            className:'noprint',
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
    ];
    _tableInit($('.rukuTable'),col,'1','flag','','');

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

    //添加入库产品的表格
    var col2 = [
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
            data:'sn',
            className:'sn'
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
            "defaultContent": "<span class='data-option option-bianji btn default btn-xs green-stripe' data-flag=1>编辑</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"
        }
    ];
    _tableInit($('#wuPinListTable1'),col2,'1','','','');

    //出库单表格
    var col4 = [
        {
            title:'出库单号',
            data:'orderNum',
            className:'orderNum',
            render:function(data, type, row, meta){
                return '<a href="outboundOrder.html?orderNum=' + row.orderNum +
                    '" target="_blank">' + row.orderNum + '</a>'
            }
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
            title:'材料员名称',
            data:'cusName'
        },
        {
            title:'材料员电话',
            data:'phone'
        },
        {
            title:'创建时间',
            data:'createTime'
        },
        {
            title:'审核时间',
            data:'auditTime'
        },
        {
            title:'制单人',
            data:'createUserName'
        },
        {
            title:'备注',
            data:'remark'
        },
    ];
    _tableInit($('#scrap-datatables3'),col4,'','','','');

    //选择物品列表
    var col3 = [
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
            title:'分类名称',
            data:'cateName'
        },
        {
            title:'规格型号',
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
            title:'单位',
            data:'unitName'
        }
    ];
    _tableInit($('#wuPinListTable'),col3,'','','','');

    //表格数据
    warehouse();

    //获取所有物品列表
    wlList();

    //加载页面的时候，隐藏其他两个导出按钮
    for( var i=1;i<$('.excelButton').children().length;i++ ){

        $('.excelButton').children().eq(i).addClass('hidding');

    };

    /*-----------------------------------------------按钮事件-----------------------------------------------*/
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
    });

    //获取供应商
    //点击刷新
    $('.refresh').click(function(){
        getSupplier();
    })

    //条件查询--------------------------------------------------------------------------------------------

    //条件查询【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //条件查询【重置】
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');

        var inputs = parents.find('input');

        inputs.val('');

        //时间置为今天
        $('.min').val(_initStart);

        $('.max').val(_initEnd);

        //入库类型重置为全部
        $('.tiaojian').val('');

    });

    //条件查询【新增】
    $('.creatButton').click(function(){

        //模态框显示
        _moTaiKuang($('#myModal'), '新增入库单', '', '' ,'', '新增');

        //初始化
        newButtonInit();

        //表格重新初始化
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
                "defaultContent": "<span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"
            }
        ];
        _tableInit($('#personTable1'),col1,'1','','','');

        //选择物品按钮名称
        $('.zhiXingRenYuanButton').html('新增物品').show();

        //选择出库单按钮名称
        $('.chukuDan').show();

        //添加登记类
        $('#myModal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //审核备注消失
        $('.shRemarks').hide();

    });

    //入库单操作-------------------------------------------------------------------------------------------

    //入库单【查看】
    $('.main-contents-table .table tbody')
        .on('click','.option-see',function(){

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

            _moTaiKuang($('#myModal'), '查看', 'flag', '' ,'', '');

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
            $('.shRemarks').show();

        })
        //入库单【编辑】(首先判断是已审核还是未审核的入库单，已审核之后，就不能编辑，未审核的情况下可以编辑)；
        .on('click','.option-edit',function(){

            //初始化
            newButtonInit();

            //新增物品显示-->修改物品
            $('.zhiXingRenYuanButton').show().html('修改物品');

            //导入入库单按钮显示
            $('.chukuDan').show();

            //样式
            var $this = $(this).parents('tr');

            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

            $this.addClass('tables-hover');

            var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();

            _ruCode = $thisDanhao;

            //绑定数据
            bindData(_ruCode);

            //入库产品详情
            function detailTable1(data){

                _rukuArr.length = 0;

                for(var i=0;i<data.length;i++){

                    _rukuArr.push(data[i]);

                }

                _datasTable($('#personTable1'),data);
            }

            //获取入库产品信息
            detailInfo($thisDanhao,detailTable1);

            //编辑按钮可以查看，可以删除，初始化表格
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

            //添加编辑类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shenhe').removeClass('shanchu').addClass('bianji');

            //所有项可编辑
            rudEdit();

            //审核备注消失
            $('.shRemarks').show();

            //判断状态是已确认还是待确定
            if( $(this).next().html() == '已审核' ){

                //所有输入框不可操作；
                $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');

                $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');

                $('#myApp33').find('select').attr('readonly','readonly').addClass('disabled-block');

                $('#myApp33').find('textarea').attr('readonly','readonly');

                //入库单号、审核人、审核时间態修改
                $('.automatic').attr('readonly','readonly').addClass('disabled-block');

                //入库产品删除按钮不可操作(重新初始化表格)
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

                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').hide();

                //导入出库单按钮也要隐藏
                $('.chukuDan').hide();

                //模态框
                _moTaiKuang($('#myModal'), '编辑', 'flag', '' ,'', '');


            }else if( $(this).next().html() == '待审核' ){

                //所有输入框不可操作；
                $('#myApp33').find('input').removeAttr('readonly').removeClass('disabled-block');

                $('#myApp33').find('input').parent('.input-blockeds').removeClass('disabled-block');

                $('#myApp33').find('select').removeAttr('readonly').removeClass('disabled-block');

                $('#myApp33').find('textarea').removeAttr('readonly');

                //入库单号、审核人、审核时间態修改
                $('.automatic').attr('readonly','readonly').addClass('disabled-block');

                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').html('修改物品').show();

                //倒入出库单按钮显示
                $('.chukuDan').show();

                //入库产品删除按钮可操作(重新初始化表格)
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

                //模态框
                _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');

            }

            //审核备注无法修改，只可查看
            $('.shRemarks').find('textarea').attr('readonly','readonly').addClass('disabled-block');

        })
        //入库单【审核】
        .on('click','.option-confirm',function(){

            //初始化
            newButtonInit()

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

            _moTaiKuang($('#myModal'), '审核', '', '' ,'', '审核');

            //绑定数据
            bindData(_ruCode);

            //入库产品详情
            function detailTable2(data){

                _rukuArr.length = 0;

                for(var i=0;i<data.length;i++){

                    _rukuArr.push(data[i]);

                }

                _datasTable($('#personTable1'),data);
            }

            //获取入库产品信息
            detailInfo($thisDanhao,detailTable2);

            //编辑按钮可以查看，可以删除，初始化表格
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

            //不可操作
            rudNotEdit();

            //审核备注显示
            $('.shRemarks').show();

            $('.shRemarks').find('textarea').removeAttr('readonly').removeClass('disabled-block');

            //添加审核类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').removeClass('bianji').addClass('shenhe');

        })
        //入库单【删除】
        .on('click','.option-delete',function(){

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

            _moTaiKuang($('#myModal'), '确定要删除吗？', '', '' ,'', '删除');

            //添加删除类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shenhe').removeClass('bianji').addClass('shanchu');

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
            $('.shRemarks').show();

        })

    //入库单【登记】【编辑】【删除】确定按钮
    $('#myModal')
        .on('click','.dengji',function(){

            djOrBj('YWCK/ywCKAddInStorage',false,'添加成功！','添加失败！')

        })
        .on('click','.bianji',function(){

            djOrBj('YWCK/ywCKEditInStorage',true,'编辑成功！','编辑失败！');

        })
        .on('click','.shanchu',function(){

            ShOrSc('YWCK/ywCKDelInStorage',false,'删除成功！','删除失败！');

        })
        .on('click','.shenhe',function(){

            if(_isShenHe == 1){

                _examineRen = false;

            }else if(_isShenHe == 0){

                _examineRen = true;

            }
            if(!_examineRen){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'不能审核自己创建的入库单！', '');

            }else{

                ShOrSc('YWCK/ywCKConfirmInStorage',true,'确认成功！','确认失败！');

            }


        })


    //第一层弹窗-------------------------------------------------------------------------------------------

    //【删除】'shanchu'删除入库单.'xiaoShanchu'删除入库产品（第一层）.'removeButton'删除入库产品（第二层）；

    //入库单【新增物品】
    $('.zhiXingRenYuanButton').click(function(){

        //是否已选中仓库
        if(putInList.ckselect == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择仓库！', '');

        }else{
            //模态框显示
            _moTaiKuang($('#myModal1'), '新增入库产品', '', '' ,'', '选择');

            //初始化
            newGoodsInit();

            _addGoods = true;

            getKQ(putInList.ckselect);

            _tempRukuArr.length = 0;

            for(var i=0;i<_rukuArr.length;i++){

                _tempRukuArr.push(_rukuArr[i]);

            }

            //将已选中的入库产品填入表格中
            _datasTable($('#wuPinListTable1'),_tempRukuArr);

        }



    })

    //点击【新增物品】模态框出现后执行的方法
    $('#myModal1').on('shown.bs.modal',function(){

        if(_addGoods){

            $('.warranty').focus();

            if($('.datepicker:visible')){

                $('.datepicker').hide();

            }

            //自动聚焦
            newGoodsInit();

            _addGoods = false;
        }

    })

    //第一层【查看】【删除】
    $('#personTable1')
        .on('click','.option-see1',function(){

            var $thisBM = $(this).parents('tr').children('.bianma').html();

            var $thisKQ= $(this).parents('tr').children('.localName').children().attr('data-num');

            var $thisSN = $(this).parents('tr').children('.sn').html();

            //模态框
            _moTaiKuang($('#myModal6'), '入库产品详情', 'flag', '' ,'', '');

            //初始化
            seeDetail();

            //赋值
            function secondView(data) {

                for (var i = 0; i < data.length; i++) {

                    if ($thisBM == data[i].itemNum && $thisKQ == data[i].localNum && $thisSN == data[i].sn) {

                        //物品编号
                        rukuObject.bianhao = data[i].itemNum;
                        //物品名称
                        rukuObject.mingcheng = data[i].itemName;
                        //规格型号
                        rukuObject.size = data[i].size;
                        //是否耐用
                        rukuObject.durable = data[i].isSpare;
                        //序列号
                        rukuObject.goodsId = data[i].sn;
                        //单位
                        rukuObject.unit = data[i].unitName;
                        //品质
                        rukuObject.quality = data[i].batchNum;
                        //质保期
                        rukuObject.warranty = data[i].maintainDate;
                        //数量
                        rukuObject.num = data[i].num;
                        //入库单价
                        rukuObject.inPrice = Number(data[i].inPrice).toFixed(2);
                        //金额
                        rukuObject.amount = Number(data[i].amount).toFixed(2);
                        //备注
                        rukuObject.remark = data[i].inMemo;


                    }

                }

                //单选按钮
                if (rukuObject.durable == 0) {

                    $('.durable').parent('span').removeClass('checked');

                    $('#second').parent('span').addClass('checked');

                } else {

                    $('.durable').parent('span').removeClass('checked');

                    $('#first').parent('span').addClass('checked');
                }

            }

            detailInfo(_ruCode,secondView);

        })
        .on('click','.option-shanchu',function(){

            removeRK($(this));

            //修改类名
            $('#myModal2').find('.btn-primary').removeClass('daShanchu').removeClass('removeButton').addClass('xiaoShanchu');

        })

    //倒入出库单-------------------------------------------------------------------------------------------

    $('.chukuDan').click(function(){

        _moTaiKuang($('#myModal7'), '出库单', '', '' ,'', '确定');

        chuInit();

    })

    //查询出库单
    $('#selected1').click(function(){

        chukuList();

    })

    //选中入库单，写入表格
    $('#scrap-datatables3 tbody').on('click','tr',function(){

        //样式改变
        $('#scrap-datatables3 tbody').find('tr').css({'background':'#ffffff'});

        $(this).css({'background':'#FBEC88'});

        _chukuD = $(this).children('.orderNum').children('a').html();
    })

    //选中出库单确定按钮
    $('#myModal7').on('click','.btn-primary',function(){

        $('#myModal7').modal('hide');
        //出去出库单的详情
        var prm = {
            orderNum:_chukuD,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorageDetail',
            data:prm,
            success:function(result){
                //_rukuArr = [];
                for(var i=0;i<result.length;i++){
                    var obj = {};
                    obj.sn = result[i].sn;
                    obj.itemNum = result[i].itemNum;
                    obj.itemName = result[i].itemName;
                    obj.size = result[i].size;
                    obj.isSpare = result[i].isSpare;
                    obj.unitName = result[i].unitName;
                    obj.batchNum = result[i].batchNum;
                    obj.maintainDate = result[i].maintainDate;
                    obj.num = result[i].num;
                    obj.inPrice = result[i].outPrice;
                    obj.amount = result[i].amount;
                    obj.inMemo = result[i].outMemo;
                    obj.userID=_userIdNum;
                    obj.userName = _userIdName;
                    obj.storageName = result[i].storageName;
                    obj.storageNum = result[i].storageNum;
                    obj.localName = result[i].localName;
                    obj.localNum = result[i].localNum;
                    _rukuArr.push(obj);
                }

                _datasTable($('#personTable1'),_rukuArr);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })


    //第二层弹窗-------------------------------------------------------------------------------------------

    //添加入库产品【添加】
    $('#addRK').click(function(){

        rukuTable(true);

    });

    //添加入库产品【重置】
    $('#addReset').click(function(){

        //初始化
        newGoodsInit();

    });

    //添加入库产品【编辑】
    $('#wuPinListTable1')
        .on('click','.option-bianji',function(){

            //本身表格样式修改
            $('#wuPinListTable1 tbody').children('tr').removeClass('tables-hover');

            $(this).parents('tr').addClass('tables-hover');

            //按钮本身改为'保存'
            $(this).html('保存').removeClass('option-bianji').addClass('option-save');

            //编辑的时候，编码和名称，条形码不能修改。
            $('#workDone').find('.not-editable').attr('readonly','readonly').addClass('disabled-block');

            $('#workDone').find('.not-editable').parents('.input-blockeds').addClass('disabled-block');

            //获取当前的物品编码，库位编码，还有物品序列号来判断选中的是哪一项
            var wpNum = $(this).parents('tr').children('.bianma').html();

            var kwNum = $(this).parents('tr').children('.localName').children('span').attr('data-num');

            var snNum = $(this).parents('tr').children('.sn').html();

            //遍历已选中的数组，来确定当前行选中的信息
            for(var i=0;i<_rukuArr.length;i++){
                if( _rukuArr[i].itemNum == wpNum && _rukuArr[i].localNum == kwNum && _rukuArr[i].sn == snNum ){
                    //赋值
                    //库位名称
                    putInGoods.kuwei = _rukuArr[i].localName;
                    //库位编号
                    $('.kuwei').attr('data-num',_rukuArr[i].localNum);
                    //物品编号
                    putInGoods.bianhao = _rukuArr[i].itemNum;
                    //物品名称
                    putInGoods.mingcheng = _rukuArr[i].itemName;
                    //规格型号
                    putInGoods.size = _rukuArr[i].size;
                    //是否耐用
                    putInGoods.picked = _rukuArr[i].isSpare;
                    //物品序列号
                    putInGoods.goodsId = _rukuArr[i].sn;
                    //单位
                    putInGoods.unit = _rukuArr[i].unitName;
                    //品质
                    putInGoods.quality = _rukuArr[i].batchNum;
                    //质保期
                    putInGoods.warranty = _rukuArr[i].maintainDate;
                    //数量
                    putInGoods.num = _rukuArr[i].num;
                    //入库单价
                    putInGoods.inprice = _rukuArr[i].inPrice;
                    //总金额
                    putInGoods.amount = _rukuArr[i].amount;
                    //备注
                    putInGoods.remark = _rukuArr[i].inMemo;
                    //单选设置(消耗品的时候，序列号可以改变，耐用品的时候，序列号不可以改变)
                    if( putInGoods.picked == 0 ){

                        $('.inpus').eq(1).parent('span').addClass('checked');

                        $('#workDone').find('.goodsId').attr('readonly','readonly').addClass('disabled-block');

                        $('#workDone').find('.goodsId').parents('.input-blockeds').addClass('disabled-block');

                    }else if( putInGoods.picked == 1 ){

                        $('.inpus').eq(0).parent('span').addClass('checked');

                        $('#workDone').find('.goodsId').removeAttr('readonly','readonly').removeClass('disabled-block');

                        $('#workDone').find('.goodsId').parents('.input-blockeds').removeClass('disabled-block');

                    }
                }
            }

        })
        .on('click','.option-save',function(){

            //将input中的内容填写到表格中
            rukuTable(false);

        })
        .on('click','.option-shanchu',function(){

            removeRK($(this));

            //修改类名
            $('#myModal2').find('.btn-primary').removeClass('daShanchu').removeClass('xiaoShanchu').addClass('removeButton');

            //var wpNum = $(this).parents('tr').children('.bianma').html();
            //
            //var kwNum = $(this).parents('tr').children('.localName').children('span').attr('data-num');
            //
            //var snNum = $(this).parents('tr').children('.sn').html();
            //
            ////库位编码、物品编码、物品序列号一致才能删除
            //for(var i=0;i<_rukuArr.length;i++){
            //
            //    if( _rukuArr[i].itemNum == wpNum && _rukuArr[i].localNum == kwNum && _rukuArr[i].sn == snNum ){
            //
            //        _$thisRemoveRowXiao = _rukuArr[i].itemNum;
            //
            //        _moTaiKuang($('#myModal2'), '提示', '', 'istap' ,'确定要删除吗？', '删除');
            //
            //        //弹出框增加类（daShanchu是入库单删除、xiaoShanchu是第一层已选中的入库产品删除、removeButton是第二层已选中入库产品删除）
            //        $('#myModal2').find('.btn-primary').removeClass('daShanchu').removeClass('xiaoShanchu').addClass('removeButton');
            //
            //    }
            //}


        })

    //入库产品第二层弹框【删除】
    $('#myModal2')
        .on('click','.removeButton',function(){

            sureRemoveRK($('#wuPinListTable1'));

            $(this).removeClass('removeButton');

        })
        //入库产品第一层
        .on('click','.xiaoShanchu',function(){

            sureRemoveRK($('#personTable1'));

            $(this).removeClass('xiaoShanchu');

        })

    //确定入库产品第二层【选择】
    $('#myModal1').on('click','.ruku',function(){

        _rukuArr.length = 0;

        //将暂存的数组传给_rukuArr;
        for(var i=0;i<_tempRukuArr.length;i++){

            _rukuArr.push(_tempRukuArr[i]);

        }


        _datasTable($('#personTable1'),_rukuArr);

        $('#myModal1').modal('hide');

    })

    //点击按钮选择入库--------------------------------------------------------------------------------------
    //选择入库物品
    $('.tianJiaruku').click(function(){

        //初始化
        selectWPInit()

        //模态框
        _moTaiKuang($('#myModal4'),'选择入库产品', '', '' ,'', '选择');

    })

    //选择入库物品条件查询
    $('#selected2').click(function(){

        var prm = {
            'ItemNum':$('#myModal4').find('.filterInput1').val(),
            'itemName':$('#myModal4').find('.filterInput2').val(),
            'cateName':$('#myModal4').find('#filterInput3').children('option:checked').html(),
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            data:prm,
            success:function(result){
                _datasTable($("#wuPinListTable"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    })

    //点击表格，选择物品
    //选择物品列表
    $('#wuPinListTable tbody').on('click','tr',function(){

        $('#wuPinListTable tbody').children('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

        _$thisWP = $(this).children('.bianma').html();
    });

    //确定选中的物品
    $('#myModal4').on('click','.btn-primary',function(){

        //确定选中的物品，并且赋值
        for(var i=0;i<_wpListArr.length;i++){

            if(_$thisWP == _wpListArr[i].itemNum){

                //赋值
                //物品编码
                putInGoods.bianhao = _wpListArr[i].itemNum;
                //物品名称
                putInGoods.mingcheng = _wpListArr[i].itemName;
                //规格型号
                putInGoods.size = _wpListArr[i].size;
                //是否耐用
                putInGoods.picked = _wpListArr[i].isSpare;
                //单位
                putInGoods.unit = _wpListArr[i].unitName;
                //是否耐用分情况
                $('.inpus').parents('span').removeClass('checked');

                if(putInGoods.picked == 0){

                    //消耗品
                    $('#twos').parents('span').addClass('checked');

                    //序列号等于物品编号（并且不可操作）
                    putInGoods.goodsId = putInGoods.bianhao;

                    $('.goodsId').attr('readonly','readonly').addClass('disabled-block');

                    $('.goodsId').parent().addClass('disabled-block');

                    //数量
                    $('.rknum').removeAttr('readonly').removeClass('disabled-block');

                    $('.rknum').parent().removeClass('disabled-block');

                    //数量置为空
                    putInGoods.num = '';


                }else{

                    //耐用品
                    $('#ones').parents('span').addClass('checked');

                    //序列号需要填写、数量必须为1且不可编辑

                    putInGoods.num = '1';

                    $('.rknum').attr('readonly','readonly').addClass('disabled-block');

                    $('.rknum').parent().addClass('disabled-block');

                    //序列号可填
                    $('.goodsId').removeAttr('readonly','readonly').removeClass('disabled-block');

                    $('.goodsId').parent().removeClass('disabled-block');

                }
            }

        }

        //模态框消失
        $('#myModal4').modal('hide');

    })

    /*------------------------------------------------入库产品键盘事件--------------------------------------*/

    //敲击回车，自动换行
    $('.inputType').keyup(function(e){

        var e = e||window.event;

        if(e.keyCode == 13 ){

            _numIndex = -1;

            if( $(this).parents('.gdList').next('li').find('.inputType').attr('id') == 'addRK' ){

                //当前如果是添加按钮的话，敲击回车，自动想表格添加数据
                //首先判断非空(库位、编号、名称、数量)
                if( putInGoods.kuwei == '' || putInGoods.bianhao == '' || putInGoods.mingcheng == '' || putInGoods.num == '' ){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');

                }else{

                    rukuTable(true);
                    ////验证数量正则
                    //var o = $('.format-error')[0].style.display;
                    ////入库单价格式
                    //var s = $('.format-error1')[0].style.display;
                    ////不耐用时，物品id要与物品编码一致
                    //var a = $('.isEqual')[0].style.display;
                    ////序列号是否唯一
                    //var b = $('.isEnabled')[0].style.display;
                    //
                    //if( o!='none' && s!='none' && a!='none' && b!='none' ){
                    //
                    //    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');
                    //
                    //}else{
                    //
                    //    //判断当前数据是否已添加过（库位和编号相同的时候，说明添加过）
                    //    var existFlag = false;
                    //
                    //    for(var i=0;i<_rukuArr.length;i++){
                    //
                    //        if(putInGoods.bianhao == _rukuArr[i].itemNum && $('.kuwei').attr('data-num') == _rukuArr[i].localNum && putInGoods.goodsId == _rukuArr[i].sn ){
                    //
                    //            existFlag = true;
                    //
                    //            break
                    //
                    //        }
                    //
                    //    }
                    //
                    //
                    //    //添加过的话，提示已添加过，否则添加
                    //    if(existFlag){
                    //
                    //        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'已添加过！', '');
                    //
                    //    }else{
                    //
                    //        //获取入库单信息创建对象，存入_rukuArr数组
                    //        var rukuDan = {};
                    //        //库区、物品编号、物品名称、规格型号、是否耐用、物品序列号、单位、品质、质保期、数量、入库单价、总金额、备注
                    //        rukuDan.localNum = $('.kuwei').attr('data-num');
                    //        rukuDan.localName = putInGoods.kuwei;
                    //        rukuDan.itemNum = putInGoods.bianhao;
                    //        rukuDan.itemName = putInGoods.mingcheng;
                    //        rukuDan.size = putInGoods.size;
                    //        rukuDan.isSpare = putInGoods.picked;
                    //        rukuDan.sn = putInGoods.goodsId;
                    //        rukuDan.unitName = putInGoods.unit;
                    //        rukuDan.batchNum = putInGoods.quality;
                    //        rukuDan.maintainDate = putInGoods.warranty;
                    //        rukuDan.num = putInGoods.num;
                    //        rukuDan.inPrice = putInGoods.inprice;
                    //        rukuDan.amount = putInGoods.amount;
                    //        rukuDan.inMemo = putInGoods.remark;
                    //        //判断仓库、如果没有选择的话直接填''
                    //        var ckName = '';
                    //        if($('#ckselect').val() == ''){
                    //            ckName = ''
                    //        }else{
                    //            ckName = $('#ckselect').children('option:selected').html();
                    //        }
                    //        rukuDan.storageName = ckName;
                    //
                    //        rukuDan.storageNum = $('#ckselect').val();
                    //
                    //        _rukuArr.unshift(rukuDan);
                    //
                    //        _datasTable($('#wuPinListTable1'),_rukuArr);
                    //
                    //        //聚焦到第一个
                    //        $('#workDone').find('.inputType').eq(0).focus();
                    //
                    //    }
                    //
                    //}

                }

            }else{
                $(this).parents('.gdList').next('li').find('.inputType').focus();
            }

        }else{

            return false

        }


    })

    /*------------------------------------------------入库产品点击事件-------------------------------------*/
    //点击下拉三角，出现的地方
    $('.selectBlock').click(function(e){

        if($(this).parent('.input-blockeds').hasClass('disabled-block')){

            return false;

        }else{

            //初始化库区、物品下拉列表
            if($(this).next('.kuqu-list').length != 0){

                var data = $('#ckselect').val();

                getKQ(data);

            }else if($(this).next('.accord-with-list').length != 0){

                var str = '';

                arrList(str,_wpListArr,false);
            }

            var e = event || window.event;

            var this1 = $(this);

            if(this1.next()[0].style.display == 'none'){

                this1.next().show();

            }else if(this1.next()[0].style.display != 'none'){

                this1.next().hide();

            }

            e.stopPropagation();
        }
    });

    //点击其他地方所有下拉框都消失
    $(document).click(function(){
        $('.hidden1').hide();
    });

    //所有下拉框的mouseover事件
    $('.hidden1').on('mouseover','li,div',function(){

        $(this).parents('.hidden1').children().removeClass('li-color');

        $(this).addClass('li-color');

        _numIndex = $(this).index();

    })

    //库位选择
    $('.kuqu-list').on('click','li',function(){

        enterFQName();

    })

    //物品编号选择
    $('.accord-with-list').on('click','li',function(){

        enterBMName();

    })

    //品质选择
    $('.pinzhixx').on('click','li',function(){

        enterQualityName();

    })


    /*------------------------------------------------其他方法----------------------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var realityStart = filterInput[1] + ' 00:00:00';
        var realityEnd = moment(filterInput[2]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var ckArr = [];
        for(var i=0;i<_ckArr.length;i++){
            ckArr.push(_ckArr[i].storageNum);
        }
        var prm = {
            'st':realityStart,
            'et':realityEnd,
            'orderNum':filterInput[0],
            'inType':$('.tiaojian').val(),
            'storageNums':ckArr,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,

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
                _datasTable($('#scrap-datatables1'),confirm);

                _datasTable($('#scrap-datatables2'),confirmed);

                _datasTable($('#scrap-datatables'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //根据数组，生成物品下拉框(用flag来区分输入值是否和列表值完全相同，true相同 false不同)；
    function arrList(str,arr,flag){

        for(var i=0;i<arr.length;i++){
            if(flag){

                str += '<li class="li-color" data-durable="' + arr[i].isSpare +
                    '"' + 'data-unit="' + arr[i].unitName +
                    '"data-quality="' + arr[i].batchNum +
                    '"data-maintainDate="' +  arr[i].maintainDate +
                    '"' + 'data-sn="' + arr[i].sn +
                    '"' +
                    'data-shengyu="' + arr[i].num +
                    '"' +
                    '>' + '<span class="dataNum">' + arr[i].itemNum +'</span>' +
                    '<span class="dataName" style="margin-left: 20px;">' +  arr[i].itemName +'</span>' +
                    '<span class="dataSize" style="margin-left: 20px;">' +
                    arr[i].size+'</span>' +
                    '</li>'

            }else{

                str += '<li data-durable="' + arr[i].isSpare +
                    '"' + 'data-unit="' + arr[i].unitName +
                    '"data-quality="' + arr[i].batchNum +
                    '"data-maintainDate="' +  arr[i].maintainDate +
                    '"' + 'data-sn="' + arr[i].sn +
                    '"' +
                    'data-shengyu="' + arr[i].num +
                    '"' +
                    '>' + '<span class="dataNum">' + arr[i].itemNum +'</span>' +
                    '<span class="dataName" style="margin-left: 20px;">' +  arr[i].itemName +'</span>' +
                    '<span class="dataSize" style="margin-left: 20px;">' +
                    arr[i].size+'</span>' +
                    '</li>'
            }

        }

        $('.accord-with-list').eq(0).empty().append(str);

        $('.accord-with-list').eq(1).empty().append(str);
    }

    //添加入库产品的时候，给表格赋值,true的时候，是添加，false的时候，是保存
    function rukuTable(flag){

        //验证数量正则
        var o = $('.format-error')[0].style.display;
        //入库单价格式
        var s = $('.format-error1')[0].style.display;
        //不耐用时，物品id要与物品编码一致
        var a = $('.isEqual')[0].style.display;
        //序列号是否唯一
        var b = $('.isEnabled')[0].style.display;

        if( o!='none' && s!='none' && a!='none' && b!='none' ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

        }else{

            //判断数量是否输入大于0
            if( putInGoods.num != '' && putInGoods.num > 0 ){

                //判断当前数据是否已添加过（库位和编号相同的时候，说明添加过）
                var existFlag = false;

                if(flag){
                    for(var i=0;i<_tempRukuArr.length;i++){

                        if(putInGoods.bianhao == _tempRukuArr[i].itemNum && $('.kuwei').attr('data-num') == _tempRukuArr[i].localNum && putInGoods.goodsId == _tempRukuArr[i].sn ){

                            existFlag = true;

                            break

                        }

                    }
                }

                //添加过的话，提示已添加过，否则添加
                if(existFlag){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'已添加过！', '');

                }else{

                    //获取入库单信息创建对象，存入_tempRukuArr数组
                    var rukuDan = {};
                    //库区、物品编号、物品名称、规格型号、是否耐用、物品序列号、单位、品质、质保期、数量、入库单价、总金额、备注
                    var price = putInGoods.inprice;

                    if(Number(price) == ''){

                        price = 0.00

                    }else{

                        price = Number(price).toFixed(2);

                    }
                    rukuDan.localNum = $('.kuwei').attr('data-num');
                    rukuDan.localName = putInGoods.kuwei;
                    rukuDan.itemNum = putInGoods.bianhao;
                    rukuDan.itemName = putInGoods.mingcheng;
                    rukuDan.size = putInGoods.size;
                    rukuDan.isSpare = putInGoods.picked;
                    rukuDan.sn = putInGoods.goodsId;
                    rukuDan.unitName = putInGoods.unit;
                    rukuDan.batchNum = putInGoods.quality;
                    rukuDan.maintainDate = putInGoods.warranty;
                    rukuDan.num = putInGoods.num;
                    rukuDan.inPrice = price;
                    rukuDan.amount = putInGoods.amount;
                    rukuDan.inMemo = putInGoods.remark;

                    //判断仓库、如果没有选择的话直接填''
                    var ckName = '';

                    if($('#ckselect').val() == ''){
                        ckName = ''
                    }else{
                        ckName = $('#ckselect').children('option:selected').html();
                    }

                    rukuDan.storageName = ckName;

                    rukuDan.storageNum = $('#ckselect').val();

                    if(flag){

                        _tempRukuArr.unshift(rukuDan);

                        _datasTable($('#wuPinListTable1'),_tempRukuArr);

                    }else{

                        for(var i=0;i<_tempRukuArr.length;i++){

                            if(_tempRukuArr[i].itemNum == rukuDan.itemNum &&  _tempRukuArr[i].sn == rukuDan.sn){

                                //修改(可修改的有库位、品质、质保期、数量、入库单价、总金额、备注)
                                //库位编码
                                _tempRukuArr[i].localNum = $('.kuwei').attr('data-num');
                                //库位名称
                                _tempRukuArr[i].localName = putInGoods.kuwei;
                                //品质
                                _tempRukuArr[i].batchNum = putInGoods.quality;
                                //质保期
                                _tempRukuArr[i].maintainDate = putInGoods.warranty;
                                //数量
                                _tempRukuArr[i].num = putInGoods.num;
                                //单价
                                _tempRukuArr[i].inPrice = putInGoods.inprice;
                                //总金额
                                _tempRukuArr[i].amount = putInGoods.amount;
                                //备注
                                _tempRukuArr[i].inMemo = putInGoods.remark;
                            }
                        }

                        _datasTable($('#wuPinListTable1'),_tempRukuArr);
                    }



                    //聚焦到第一个
                    $('#workDone').find('.inputType').eq(0).focus();

                }

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

            }

        }
    }

    //表格入库产品删除按钮
    function removeRK($this){

        var wpNum = $this.parents('tr').children('.bianma').html();

        var kwNum = $this.parents('tr').children('.localName').children('span').attr('data-num');

        var snNum = $this.parents('tr').children('.sn').html();

        console.log(_rukuArr);

        //库位编码、物品编码、物品序列号一致才能删除
        for(var i=0;i<_rukuArr.length;i++){

            if( _rukuArr[i].itemNum == wpNum && _rukuArr[i].localNum == kwNum && _rukuArr[i].sn == snNum ){

                _$thisRemoveRowXiao = _rukuArr[i].itemNum;

                _moTaiKuang($('#myModal2'), '提示', '', 'istap' ,'确定要删除吗？', '删除');

                //弹出框增加类（daShanchu是入库单删除、xiaoShanchu是第一层已选中的入库产品删除、removeButton是第二层已选中入库产品删除）
                //$('#myModal2').find('.btn-primary').removeClass('daShanchu').removeClass('xiaoShanchu').addClass('removeButton');

            }
        }
    }

    //表格入库产品删除确定按钮
    function sureRemoveRK(tableId){

        _rukuArr.removeByValue(_$thisRemoveRowXiao,'itemNum');

        _datasTable(tableId,_rukuArr);

        $('#myModal2').modal('hide');

    }

    //入库单赋值
    function bindData(num){

        for(var i=0;i<_allData.length;i++){
            //绑定数据
            if(_allData[i].orderNum == num){

                //入库单号
                putInList.bianhao = _allData[i].orderNum;
                //入库单类型
                putInList.rkleixing = _allData[i].inType;
                //供货方名称
                putInList.suppliermc = _allData[i].supNum;
                //供货方联系人
                putInList.suppliercontent = _allData[i].contactName;
                //供货方联系电话
                putInList.supplierphone = _allData[i].phone;
                //仓库
                putInList.ckselect = _allData[i].storageNum;
                //制单人
                putInList.zhidanren = _allData[i].createUserName;
                //制单时间
                putInList.shijian = _allData[i].createTime;
                //备注
                putInList.remarks = _allData[i].remark;
                //审核备注
                putInList.shremarks = _allData[i].auditMemo;
                //判断创建入库单的人是否是本人
                if( _allData[i].createUser == _userIdNum ){

                    _examineRen = false;

                }else{

                    _examineRen = false;

                }
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

    //入库单登记、编辑(true,编辑,false,登记)
    function djOrBj(url,flag,successMeg,errorMeg){

        //验证非空
        if( putInList.rkleixing == '' ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项', '');

        }else{

            //入库产品数组
            var inStoreDetails = [];

            for(var i=0;i<_rukuArr.length;i++){

                var obj = {};
                //序列号
                obj.sn = _rukuArr[i].sn;
                //是否耐用
                obj.isSpare = _rukuArr[i].isSpare;
                //入库产品编号
                obj.itemNum = _rukuArr[i].itemNum;
                //入库产品名称
                obj.itemName = _rukuArr[i].itemName;
                //品质
                obj.batchNum = _rukuArr[i].batchNum;
                //数量
                obj.num = _rukuArr[i].num;
                //入库价格
                obj.inPrice = _rukuArr[i].inPrice;
                //总金额
                obj.amount = _rukuArr[i].amount;
                //仓库编号
                obj.storageNum = _rukuArr[i].storageNum;
                //仓库名称
                obj.storageName = _rukuArr[i].storageName;
                //规格型号
                obj.size = _rukuArr[i].size;
                //单位
                obj.unitName = _rukuArr[i].unitName;
                //备注
                obj.inMemo = _rukuArr[i].inMemo;
                //质保期
                obj.maintainDate = _rukuArr[i].maintainDate;
                //库区编号
                obj.localNum = _rukuArr[i].localNum;
                //库区名称
                obj.localName = _rukuArr[i].localName;
                //用户id
                obj.userID=_userIdNum;
                //用户名
                obj.userName = _userIdName;

                inStoreDetails.push(obj);

            }

            //仓库选择
            var ckName = '';
            if($('#ckselect').val() == ''){

                ckName = ''

            }else{

                ckName = $('#ckselect').children('option:selected').html();

            }

            var prm = {

                //入库类型
                inType:putInList.rkleixing,
                //供应方编号
                supNum:$('#supplier').val(),
                //供应方名称
                supName:$('#supplier').children('option:selected').html(),
                //供应方联系人
                contactName:putInList.suppliercontent,
                //供应方联系电话
                phone:putInList.supplierphone,
                //仓库名称
                storageName:ckName,
                //仓库编码
                storageNum:putInList.ckselect,
                //入库物品
                inStoreDetails:inStoreDetails,
                //备注
                remark:putInList.remarks,
                //用户id
                userID:_userIdNum,
                //用户名称
                userName:_userIdName,
                //角色
                b_UserRole:_userRole,

            };

            if(flag){

                prm.orderNum = _ruCode;

            }

            $.ajax({

                type:'post',
                url:_urls + url,
                timeout:_theTimes,
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success:function(result){

                    if( result == 99 ){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,successMeg, '');

                        $('#myModal').modal('hide');

                        conditionSelect();

                    }else{

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,errorMeg, '');

                    }

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })

        }

    }

    //入库单审核、删除(true,审核,false,删除)
    function ShOrSc(url,flag,successMeg,errorMeg){
        var prm ={
            orderNum:_ruCode,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }

        if( flag ){

            prm.auditMemo = putInList.shremarks;

        }

        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result==99){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,successMeg, '');

                    $('#myModal').modal('hide');

                    conditionSelect();

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,errorMeg, '');
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })
    }

    //入库单不可编辑
    function rudNotEdit(){

        //所有input框不可操作，并且置灰
        $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');

        $('#myApp33').find('input').parents('.input-blockeds').addClass('disabled-block');

        //所有select框不可操作，并且置灰
        $('#myApp33').find('select').attr('diasbled',true).addClass('disabled-block');

        $('#myApp33').find('select').parents('.input-blockeds').addClass('disabled-block');

        //所有textarea框不可操作，并且置灰
        $('#myApp33').find('textarea').attr('readonly','readonly').addClass('disabled-block');

    }

    //入库单可编辑
    function rudEdit(){

        //所有input框不可操作，并且置灰
        $('#myApp33').find('input').removeAttr('readonly').removeClass('disabled-block');

        $('#myApp33').find('input').parents('.input-blockeds').removeClass('disabled-block');

        //所有select框不可操作，并且置灰
        $('#myApp33').find('select').removeAttr('diasbled').removeClass('disabled-block');

        $('#myApp33').find('select').parents('.input-blockeds').removeClass('disabled-block');

        //所有textarea框不可操作，并且置灰
        $('#myApp33').find('textarea').removeAttr('readonly').removeClass('disabled-block');

    }

    //按钮初始化-----------------------------------------------------------------------------------------------

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
        _rukuArr = [];

        _datasTable($('#personTable1'),_rukuArr);

    }

    //新增物品初始化
    function newGoodsInit(){

        putInGoods.kuwei = '';

        putInGoods.bianhao = '';

        putInGoods.mingcheng = '';

        putInGoods.size = '';

        putInGoods.picked = 0;

        putInGoods.goodsId = '';

        putInGoods.unit = '';

        putInGoods.quality = '';

        putInGoods.warranty = '';

        putInGoods.num = '';

        putInGoods.inprice = '';

        putInGoods.amount = '';

        putInGoods.remark = '';

        if( putInGoods.picked == 0 ){

            $('.inpus').eq(1).parent('span').addClass('checked');

        }else if( putInGoods.picked == 1 ){

            $('.inpus').eq(0).parent('span').addClass('checked');

        }

        //所有输入框清空，并且除了品质下拉框，所有的属性清空

        $('#workDone').find('.inputType').removeAttr('readonly').removeClass('disabled-block');

        $('#workDone').find('.inputType').parents('.input-blockeds').removeClass('disabled-block');

        //库位清空属性
        $('.kuwei').removeAttr('data-num');

        //库位选中下拉框的清空
        $('.kuqu-list').children().removeClass('li-color');

        //编号选中下拉框的清空
        $('.accord-with-list').children().removeClass('li-color');

        //聚焦
        $('#workDone').find('.inputType').eq(0).focus();

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

    //出库单模态框初始化
    function chuInit(){

        $('.chukuHao').val('');

        //开始时间
        $('.chukumin').val(_chuStartTime);

        //结束时间
        $('.chukumax').val(_chuTime);

    }

    //选择物品模态框初始化
    function selectWPInit(){

        //物品编码
        $('#myModal4').find('.filterInput1').val('');

        //物品名称
        $('#myModal4').find('.filterInput2').val('');

        //分类名称
        $('#myModal4').find('#filterInput3').val('');

        //表格数据
        _datasTable($('#wuPinListTable'),_wpListArr);

    }

    //键盘方法--------------------------------------------------------------------------------------------------

    //键盘事件方法
    function upDown(e,ul,enterFun,inputFun){

        var e = e||window.event;

        var chils = ul.children();

        var lengths = 0;

        lengths = chils.length;

        //ul.show();

        if(e.keyCode == 40){

            //console.log('向下');

            if(_numIndex < lengths -1){

                _numIndex ++ ;

            }else{

                _numIndex = lengths -1;

            }

            ul.children().removeClass('li-color');

            ul.children().eq(_numIndex).addClass('li-color');

            //滚动条问题
            if(_numIndex> 4){

                var moveDis = (_numIndex - 4)*40;

                $('ul').scrollTop(moveDis);
            }

        }else if(e.keyCode == 38){

            //console.log('向上');

            if(_numIndex < 1){

                _numIndex =0;

            }else{

                _numIndex--;

            }

            ul.children().removeClass('li-color');

            ul.children().eq(_numIndex).addClass('li-color');

            //滚动条问题
            if(lengths-4>_numIndex){

                var moveDis = (_numIndex - 4)*40;

                $('ul').scrollTop(moveDis);

            }

        }else if(e.keyCode == 13){

            //console.log('回车');

            enterFun();

        }else if(e != 9){

            //console.log('其他');

            inputFun();

        }
    }

    //库区回车事件
   var enterFQName =  function enterFQ(){

       //input框赋值
        putInGoods.kuwei = $('.kuqu-list').children('.li-color').html();

       //通过data-num来绑定库位编码
        $('.kuwei').attr('data-num',$('.kuqu-list').children('.li-color').attr('data-num'));

       //选择框消失
        $('.kuqu-list').hide();

    }

    //库区输入事件
    var inputFQName = function inputFQ(){

        var searchValue = putInGoods.kuwei;

        var str = '';

        var arr = [];

        for(var i=0;i<_kuquArr.length;i++){
            //完全相同的情况下
            if( searchValue == _kuquArr[i].localName || searchValue == _kuquArr[i].localNum ){


                str += '<li class="li-color" data-num="' + _kuquArr[i].localNum + '">' + _kuquArr[i].localName + '</li>'

            }else{

                if(_kuquArr[i].localName.indexOf(searchValue)>=0 || _kuquArr[i].localNum.indexOf(searchValue)>=0){

                    arr.push(_kuquArr[i]);

                    str += '<li data-num="' + _kuquArr[i].localNum + '">' + _kuquArr[i].localName + '</li>'
                }
            }
        }

        $('.kuqu-list').empty().append(str);

        if(arr.length){

            $('.kuqu-list').show();

        }

    }

    //编码输入事件
    var inputBMName = function inputBM(){

        var searchValue = putInGoods.bianhao;

        var str = '';

        var arr = [];

        var isWho = false;

        for(var i=0;i<_wpListArr.length;i++){

            if( searchValue ==  _wpListArr[i].itemNum ){

                arr.push(_wpListArr[i]);

                isWho = true;


            }else{

                if( _wpListArr[i].itemNum.indexOf(searchValue)>=0 ){

                    arr.push(_wpListArr[i]);

                }
            }
        }


        if(isWho){

            arrList(str,arr,true);

        }else{

            arrList(str,arr,false);

        }

        if(arr.length>0){

            $('.accord-with-list').eq(0).show();

        }

    }

    //编码回车事件(选中编码后，将名称、规格型号、是否耐用、单位、序列号自动填写);
    var enterBMName = function enterBM(){

        //input框赋值
        //物品编码
        putInGoods.bianhao = $('.accord-with-list').eq(0).children('.li-color').children('.dataNum').html();

        //物品名称
        putInGoods.mingcheng = $('.accord-with-list').eq(0).children('.li-color').children('.dataName').html();

        //规格型号
        putInGoods.size = $('.accord-with-list').eq(0).children('.li-color').children('.dataSize').html();

        //是否耐用
        var isDurable = $('.accord-with-list').eq(0).children('.li-color').attr('data-durable');

        //单位
        putInGoods.unit = $('.accord-with-list').eq(0).children('.li-color').attr('data-unit');

        //是否耐用单选框初始化
        $('.inpus').parents('span').removeClass('checked');


        //是否为耐用品，耐用品的=1，消耗品=0，耐用品的情况下，数量只能为1（并且不能编辑），物品序列号需要自填，消耗品的情况下序列号等于物品编号
        if( isDurable == 0 ){

            $('#twos').parents('span').addClass('checked');

            //序列号等于物品编号（并且不可操作）
            putInGoods.goodsId = putInGoods.bianhao;

            $('.goodsId').attr('readonly','readonly').addClass('disabled-block');

            $('.goodsId').parent().addClass('disabled-block');

            //数量
            $('.rknum').removeAttr('readonly').removeClass('disabled-block');

            $('.rknum').parent().removeClass('disabled-block');

            //数量置为空
            putInGoods.num = '';

        }else if( isDurable == 1 ){

            $('#ones').parents('span').addClass('checked');

            //序列号需要填写、数量必须为1且不可编辑

            putInGoods.num = '1';

            $('.rknum').attr('readonly','readonly').addClass('disabled-block');

            $('.rknum').parent().addClass('disabled-block');

            //序列号可填
            $('.goodsId').removeAttr('readonly','readonly').removeClass('disabled-block');

            $('.goodsId').parent().removeClass('disabled-block');


        }

        //物品编号、物品名称、规格型号、是否耐用、单位置为不可操作（置灰）

        $('.auto-input').attr('readonly','readonly').addClass('disabled-block');

        $('.auto-input').parents('.input-blockeds').addClass('disabled-block');

        $('.accord-with-list').hide();

        //确定聚焦位置
        setTimeout(function(){

            if( putInGoods.mingcheng == '' ){

                $('.inputType').eq(3).focus();

            }else{

                if(putInGoods.goodsId != ''){

                    $('.inputType').eq(8).focus();

                }else{

                    $('.inputType').eq(6).focus();

                }

            }
        },300);

        //初始化



    }

    //品质输入事件
    var inputQualityName = function inputQuality(){



    }

    //品质回车事件
    var enterQualityName = function enterQuality(){

        putInGoods.quality = $('.pinzhixx').children('.li-color').html();

        $('.pinzhixx').hide();

    }

    //页面加载时获取数据方法------------------------------------------------------------------------------------

    //获取入库类型(type是区别入库和出库的，入库=1，出库=2)
    function rkLX(type){
        var prm = {
            "catType": type,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetInOutCate',
            data:prm,
            success:function(result){

                if(type == 1){

                    var str = '<option value="">全部</option>';

                    for(var i=0;i<result.length;i++){

                        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';

                    }

                    $('.tiaojian').empty().append(str);

                    var str1 = '<option value="">请选择</option>';

                    for(var i=0;i<result.length;i++){

                        str1 += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';

                    }

                    $('#rkleixing').empty().append(str1);

                }else{
                    var str = '<option value="">全部</option>';

                    for(var i=0;i<result.length;i++){

                        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';

                    }

                    $('#ckType').empty().append(str);

                    chukuList();

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //仓库列表
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
                _ckArr.length = 0;
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    _ckArr.push(result[i]);
                    str += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';
                    $('#ckselect').empty().append(str);
                }

                //条件查询
                conditionSelect();

                //获取出库单
                chukuList();

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //供货方名称
    function getSupplier(){

        $.ajax({
            type:'get',
            url:_urls + 'YWCK/GetAllYWCKSupplier',
            data:{
                supName:''
            },
            beforeSend:function(){
                //刷新按钮旋转
                var i=0;
                _rotate = setInterval(function(){
                    i++;
                    var deg = i;
                    $('.refresh').css({
                        'transform':'rotate(' + deg + 'deg)'
                    },1000)
                })
            },
            timeout:_theTimes,
            success:function(result){
                //console.log(result);
                clearInterval(_rotate);
                var str = '<option>请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].supNum +'"' + 'data-Content="' + result[i].linkPerson + '"' + 'data-phone="' + result[i].phone + '">'
                        + result[i].supName + '</option>';
                }
                $('#supplier').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取物品id
    function getWPid(){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItemSN',
            data:prm,
            success:function(result){
                for(var i=0;i<result.length;i++){

                    //if(result[i] == workDone.goodsId){
                    //    console.log('重复')
                    //    $('.isEnabled').show();
                    //}else{
                    //    console.log('不重复')
                    //    $('.isEnabled').hide();
                    //}
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有库区
    function getKQ(data){
        //获取仓库，获得对应的库区
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:{
                'storageNum':data,
                'hasLocation':1,
                'userID':_userIdNum,
                'userName':_userIdName,
                b_UserRole:_userRole,
            },
            timeout:_theTimes,
            success:function(result){
                var str = '';
                _kuquArr = [];
                for(var i=0;i<result.length;i++){
                    for(var j=0;j<result[i].locations.length;j++){
                        _kuquArr.push(result[i].locations[j]);
                        str += '<li data-num="' + result[i].locations[j].localNum + '">' + result[i].locations[j].localName + '</li>'
                    }
                }
                $('.kuqu-list').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有物品列表
    function wlList(){
        var prm = {
            'ItemNum':'',
            'itemName':'',
            'cateName':'',
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            async:false,
            data:prm,
            success:function(result){

                _wpListArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _wpListArr.push(result[i]);

                }

                var str = '';

                //给物品编码和物品名称的列表赋初始值
                arrList(str,result,false);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取出库列表
    function chukuList(){

        var ck = [];

        for(var i=0;i<_ckArr.length;i++){

            ck.push(_ckArr[i].storageNum);

        }

        var prm = {
            "st": $('.chukumin').val(),
            "et": $('.chukumax').val(),
            "orderNum": $('.chukuHao').val(),
            "outType": $('#ckType').val(),
            "userID":_userIdNum,
            "userName":_userIdName,
            "b_UserRole":_userRole,
            "storageNums":ck
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorage',
            data:prm,
            success:function(result){
                var arr = [];
                for(var i=0;i<result.length;i++){
                    if(result[i].status == 1){
                        arr.push(result[i]);
                    }
                }
                _datasTable($('#scrap-datatables3'),arr);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取物品编码分类
    function wpClass(){

        var prm = {

            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole

        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItemCate',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">全部</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].cateNum +
                        '">' + result[i].cateName + '</option>'

                }

                $('#myModal4').find('#filterInput3').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }


})