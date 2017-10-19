$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',
        forceParse: 0
    });

    //设置初始时间
     var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');

    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);

    var realityStart = '';

    var realityEnd = '';

    //记录选择入库产品的上下键选项的index
    var _num = -1;

    //新增入库单的vue对象
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            'bianhao':'',
            'rkleixing':'',
            'supplierMC':'',
            'supplierContent':'',
            'supplierPhone':'',
            'ckselect':'',
            'zhidanren':'',
            'remarks':'',
            'gysphone':'',
            'shijian':'',
            'shRemarks':''
        },
        methods:{
            selectSupplier:function(){
                myApp33.supplierContent = $('#supplier').children('option:selected').attr('data-content');
                myApp33.supplierPhone = $('#supplier').children('option:selected').attr('data-phone');
            }
        }
    });

    //新增入库物品的vue对象
    var workDone = new Vue( {
        'el':'#workDone',
        'data':{
            'goodsId':'',
            'bianhao':'',
            'mingcheng':'',
            'size':'',
            'picked':'',
            'unit':'',
            'quality':'',
            'warranty':'',
            'num':'',
            'inPrice':'',
            'amount':0,
            'remark':'',
            'kuwei':''
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
            addFun2:function(){
                var mny = /^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/;
                if(workDone.inPrice != ''){
                    if(mny.test(workDone.inPrice)){
                        $('.format-error1').hide();
                    }else{
                        $('.format-error1').show();
                    }
                }else{
                    $('.format-error1').hide();
                }
                var amount = Number(workDone.inPrice) * Number(workDone.num);
                workDone.amount = amount.toFixed(2);
            },
            addFun3:function(){
                var mny = /^([1-9][0-9]*(\.[0-9]{1,2})?|0\.(?!0+$)[0-9]{1,4})$/;
                if(mny.test(workDone.amount)){
                    $('.format-error3').hide();
                    //根据总金额得出单价
                    var danjia =  Number(workDone.amount)/Number(workDone.num);
                    workDone.inPrice = danjia.toFixed(2);
                }else{
                    $('.format-error3').show();
                }
            },
            addFun4:function(){
                var inPrince = workDone.inPrice;
                workDone.inPrice = parseFloat(inPrince).toFixed(2);
            },
            searchbm:function(e){
                var value = $.trim(workDone.bianhao);
                keySelect(value,0)
            },
            searchmc:function(e){
                var value = $.trim(workDone.mingcheng);
                keySelect(value,1)
            },
            radios:function(){
                $('.inpus').click(function(){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            },
            isequal:function(){
                if(workDone.picked == 0){
                    if(workDone.bianhao == workDone.goodsId){
                        $('.isEqual').hide();
                    }else{
                        $('.isEqual').show();
                    }
                }else{
                    //获取数据，用于去重
                    getWPid();
                }
            },
            time:function(){
                $('.datatimeblock').eq(2).datepicker({
                    language:  'zh-CN',
                    todayBtn: 1,
                    todayHighlight: 1,
                    format: 'yyyy/mm/dd',
                });
            },
            timeblur:function(){
                setTimeout(function(){
                    $('.datepicker').hide();
                },200)
            },
            focusFun:function(e){
                $('.pinzhixx').show();
            },
            selectFun:function(e,msg){
                var e = e || window.event;
                var lis = $('.pinzhixx').children('div');
                if(e.keyCode == 40){
                    //向下
                    if(_pzNum<lis.length-1){
                        _pzNum++;
                    }else{
                        _pzNum = lis.length-1;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_pzNum).addClass('li-color');

                }else if(e.keyCode == 38){
                    //向上
                    if(_pzNum>0){
                        _pzNum--;
                    }else{
                        _pzNum = 0;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_pzNum).addClass('li-color');
                }else if(e.keyCode == 13){
                    //回车
                    workDone.quality = $('.pinzhixx').children('.li-color').html();
                    var pzNum = $('.pinzhixx').children('.li-color').attr('data-value');
                    $('.quality').attr('data-pzNum',pzNum);
                    $('.pinzhixx').hide();
                }
                //else if(e.keyCode != 9){
                //    var values = workDone.quality;
                //    var lis = $('.pinzhixx').children('div');
                //    var str = '';
                //    for(var i=0;i<lis.length;i++){
                //        if(lis.eq(i).html().indexOf(values) || lis.eq(i).attr('data-value').indexOf(values)){
                //            console.log(lis.eq(i));
                //            str += '<div data-value="' + lis.eq(i).attr('data-value') +
                //                '">' + lis.eq(i).html() + '</div>'
                //        }
                //    }
                //    $('.pinzhixx').empty().append(str);
                //}
            },
            clickFun:function(e){
                e.stopPropagation();
            },
            kuweiFun:function(e){
                var e = e || window.event;
                //区分上下回车键
                if(e.keyCode == 40){
                    //按下键的时候，
                    //获得所有li
                    var lis = $('.kuqu-list').eq(0).children('li');
                    if(_num<lis.length-1){
                        _num ++;
                    }else{
                        _num = lis.length-1;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_num).addClass('li-color');
                    //首先获取ul的高度
                    var ulHeight = $('.kuqu-list').eq(0).height();
                    var num = parseInt(ulHeight/30);
                    //判断放了几个ul
                    if(_num > num){
                        var height = (_num - num) * 30;
                        $('.kuqu-list').eq(0).scrollTop(height);
                    }
                }else if(e.keyCode == 38){
                    var lis = $('.kuqu-list').eq(0).children('li');
                    if(_num<1){
                        _num =0;
                    }else{
                        _num--;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_num).addClass('li-color');
                    //首先获取ul的高度
                    var ulHeight = $('.accord-with-list').eq(index).height();
                    var num = parseInt(ulHeight/30);
                    if(_num < lis.length -num){
                        var height = (_num-num) * 30;
                        $('.accord-with-list').eq(index).scrollTop(height);
                    }
                }else if(e.keyCode == 13){
                    //选中
                    var lis = $('.kuqu-list').children('li');
                    for(var i=0;i<lis.length;i++){
                        if(lis.eq(i).attr('class') == 'li-color'){
                            workDone.kuwei = lis.eq(i).html();
                            $('.kuwei').attr('data-num',lis.eq(i).attr('data-num'));
                        }
                    }
                    $('.kuqu-list').hide();
                }else{
                    if(e.keyCode != 9){
                        //比较
                        _num = -1;
                        var searchValue = workDone.kuwei;
                        var includeArr = [];
                        var str = '';
                        for(var i=0;i<_kuquArr.length;i++){
                            if(_kuquArr[i].localName.indexOf(searchValue)>=0 || _kuquArr[i].localNum.indexOf(searchValue)>=0){
                                includeArr.push(_kuquArr[i]);
                                str += '<li data-num="' + _kuquArr[i].localNum + '">' + _kuquArr[i].localName + '</li>'
                            }
                        }
                        $('.kuqu-list').empty().append(str);
                        if(includeArr.length>0){
                            $('.kuqu-list').show();
                        }
                    }
                }
            }
        }
    });

    //查看入库产品详细信息
    var rukuObject = new Vue({
        el:'#rukuObject',
        data:{
            bianhao:'',
            mingcheng:'',
            size:'',
            picked:0,
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

    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //记录当前工单号
    var _gdCode = '';

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

    //存放仓库数组
    var _ckArr = [];

    //入库类型
    rkLX(1);

    rkLX(1,'flag');

    //出库类型
    rkLX(2);

    //存放当前入库单号
    var _$thisRKnum = '';

    wlList();

    //记录品质选项的上下键index
    var _pzNum = -1;

    //获取供应商
    getSupplier();

    var _rotate;

    var _examineRen = false;

    //根据仓库，获得对应的库区
    var _kuquArr = [];

    //记录出库单号
    var _chukuD = '';
    /*-------------------------------------表格初始化------------------------------*/
    var buttonVisible = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs'
        }
    ];

    var buttonHidden = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        }
    ];
    //入库单表格初始化
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
    tableInit($('.rukuTable'),col,buttonVisible,'flag');

    //加载页面的时候，隐藏其他两个导出按钮
    for( var i=1;i<$('.excelButton').children().length;i++ ){
        $('.excelButton').children().eq(i).addClass('hidding');
    };

    //入库单入库产品表格
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
            data:'localName'
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
    tableInit($('#personTable1'),col1,buttonHidden);

    //添加入库产品表格
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
            data:'sn'
        },
        {
            title:'库区',
            data:'localName'
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
    tableInit($('#wuPinListTable1'),col2,buttonHidden);

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
    tableInit($('#wuPinListTable'),col3,buttonHidden);

    //选择出库单
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
    tableInit($('#scrap-datatables3'),col4,buttonHidden);

    //数据
    wlList('flag');
    //点击刷新
    $('.refresh').click(function(){
        getSupplier();
    })
    /*------------------------------------表格数据--------------------------------*/
    //加载仓库列表
    warehouse('flag');
    /*-------------------------------------按钮事件-------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //验证时间
        if( $('.min').val() == '' || $('.max').val() == '' ){
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'起止时间不能为空', '');
        }else{
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'起止时间不能大于结束时间', '');
            }else{
                conditionSelect();
            }
        }
    });

    //新增按钮
    $('.creatButton').on('click',function(){
        //审核备注不显示
        $('.shRemarks').hide();
        //所有输入框不可操作；
        $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');
        $('#myApp33').find('input').parent('.input-blockeds').removeClass('disabled-block');
        $('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');
        $('#myApp33').find('textarea').attr('disabled',false);
        //入库单编号、制单人、制单时间不可编辑
        $('.automatic').attr('disabled',true).addClass('disabled-block');
        //新增物品按钮隐藏
        $('.zhiXingRenYuanButton').html('新增物品').show();
        //入库产品删除按钮不可操作
        $('#personTable1 tbody').find('.option-shanchu').attr('disabled',false);
        //确定按钮显示
        $('#myModal').find('.confirm').show();
        //动态添加类名dengji删除bianji类
        $('#myModal').find('.confirm').removeClass('bianji').removeClass('shenhe').addClass('dengji');
        //新增物品按钮
        $('.tableHovers').children('.condition-query').show();
        //初始化登记框
            myApp33.bianhao = '';
            myApp33.rkleixing = '';
            myApp33.zhidanren = '';
            myApp33.remarks = '';
            myApp33.gysphone = '';
            myApp33.supplierMC = '';
            myApp33.supplierBM = '';
            myApp33.ckselect = '';
            myApp33.supplierContent = '';
            myApp33.supplierPhone = ''
        warehouse();
        //物品登记表格清空；
        _rukuArr = [];
        datasTable($('#personTable1'),_rukuArr);
        _moTaiKuang($('#myModal'), '新增入库单','', '' ,'', '保存');
    });

    //重置按钮(点击重置按钮的时候，所有input框清空，时间还原成今天的)
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    });

    //新增物品按钮(出现模态框)
    $('.zhiXingRenYuanButton').on('click',function(){
        //库区清空
        $('.kuwei').val('').removeAttr('data-num');
        //先选择仓库
        if($('#ckselect').val() == ''){
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请先选择仓库', '');
        }else{
            //编辑的时候，编码和名称，条形码不能修改。
            $('.not-editable').attr('disabled',false).removeClass('disabled-block');
            $('.not-editable').parent('.input-blockeds').removeClass('disabled-block');
            $('.goodsId').attr('disabled',false).removeClass('disabled-block');
            $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
            $('.rknum').attr('disabled',false).removeClass('disabled-block');
            $('.rknum').parents('.input-blockeds').removeClass('disabled-block');
            $('.auto-input').attr('disabled',false).removeClass('disabled-block');
            $('.auto-input').parent('.input-blockeds').removeClass('disabled-block');
            $('.accord-with-list').hide();
            //入库产品的是否耐用和单位不可修改
            $('.automatic').attr('disabled',true).addClass('disabled-block');
            //获取仓库，获得对应的库区
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKGetStorages',
                data:{
                    'storageNum':myApp33.ckselect,
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
            //初始化入库物品
            workDone.goodsId = '';
            workDone.bianhao = '';
            workDone.mingcheng = '';
            workDone.size = '';
            workDone.picked = 0;
            workDone.unit = '';
            workDone.quality = '新件';
            workDone.warranty = '';
            workDone.num = '';
            workDone.inPrice = '';
            workDone.amount = 0;
            workDone.remark = '';
            if(workDone.picked == 0){
                $('.inpus').parent('span').removeClass('checked');
                $('.inpus').parent('span').eq(1).addClass('checked');
            }else if(workDone.picked == 1){
                $('.inpus').parent('span').removeClass('checked');
                $('.inpus').parent('span').eq(0).addClass('checked');
            }
            _moTaiKuang($('#myModal1'), '入库物品管理', '', '' ,'', '确定');
            //首先要获得原本的物品
            datasTable($('#wuPinListTable1'),_rukuArr);

            $('#myModal1').on('shown.bs.modal', function () {
                //让日历插件首先失去焦点
                $('.warranty').focus();
                if($('.datepicker:visible')){
                    $('.datepicker').hide();
                }
                //自动聚焦
                $('.not-editable').eq(0).focus();
            })
        }
    });

    //导入出库单按钮
    $('.chukuDan').on('click',function(){
        //导入出库单的按钮
        var chuTime = moment().format('YYYY/MM/DD');
        var chuStartTime = moment(chuTime).subtract(8,'d').format('YYYY/MM/DD');
        $('.chukumin').val(chuStartTime);
        $('.chukumax').val(chuTime);
        $('.chukuHao').val('');
        $('#ckType').val('');
        if($('#ckselect').val() == ''){
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请先选择入库仓库！', '')
        }else{
            //导入出库单
            _moTaiKuang($('#myModal7'), '出库单', '', '' ,'', '确定');
            chukuList();
        }
    });

    //出库单条件查询
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
        //console.log(_chukuD);
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
                _rukuArr = [];
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
                datasTable($('#personTable1'),_rukuArr);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
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
    });

    //新增确定按钮（点击确定按钮，与数据库发生交互）
    $('#myModal').on('click','.dengji',function(){
        if(myApp33.rkleixing == ''){
            //提示框
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项', '');
        }else{
            var inStoreDetails1 = [];
            //入库单的信息
            for(var i=0;i<_rukuArr.length;i++){
                var obj = {};
                obj.sn = _rukuArr[i].sn;
                obj.itemNum = _rukuArr[i].itemNum;
                obj.itemName = _rukuArr[i].itemName;
                obj.size = _rukuArr[i].size;
                obj.isSpare = _rukuArr[i].isSpare;
                obj.unitName = _rukuArr[i].unitName;
                obj.batchNum = _rukuArr[i].batchNum;
                obj.maintainDate = _rukuArr[i].maintainDate;
                obj.num = _rukuArr[i].num;
                obj.inPrice = _rukuArr[i].inPrice;
                obj.amount = _rukuArr[i].amount;
                obj.inMemo = _rukuArr[i].inMemo;
                obj.userID=_userIdNum;
                obj.userName = _userIdName;
                obj.storageName = _rukuArr[i].storageName;
                obj.storageNum = _rukuArr[i].storageNum;
                obj.localName = _rukuArr[i].localName;
                obj.localNum = _rukuArr[i].localNum;
                inStoreDetails1.push(obj);
            }
            console.log(inStoreDetails1);
            var ckName = '';
            if($('#ckselect').val() == ''){
                ckName = ''
            }else{
                ckName = $('#ckselect').children('option:selected').html();
            }
            //获取填写的入库信息
            var prm = {
                'inType':myApp33.rkleixing,
                'remark':myApp33.remarks,
                'inStoreDetails':inStoreDetails1,
                'userID':_userIdNum,
                'userName':_userIdName,
                b_UserRole:_userRole,
                'storageName':ckName,
                'storageNum':$('#ckselect').val(),
                'supName':$('#supplier').children('option:selected').html(),
                'contractOrder':myApp33.supplierBM,
                'supNum':myApp33.supplierMC,
                'contactName':myApp33.supplierContent,
                'phone':myApp33.supplierPhone
            }
            $.ajax({
                type:'post',
                url: _urls + 'YWCK/ywCKAddInStorage',
                data:prm,
                success:function(result){
                    if(result == 99){
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'添加成功!', '');
                        conditionSelect();
                        $('#myModal').modal('hide');
                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'添加失败!', '');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    });

    //表格中的操作按钮
    $('.main-contents-table .table tbody')
        //表格查看
        .on('click','.option-see',function(){
            //审核备注不显示
            $('.shRemarks').hide();
            //新增按钮置为不可操作
            $('.tableHovers').children('.condition-query').hide();
            //动态删除类名dengji
            $('#myModal').find('.confirm').removeClass('dengji').removeClass('bianji');
            //样式
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();
            _gdCode = $thisDanhao;
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    myApp33.rkleixing = _allData[i].inType;
                    myApp33.bianhao = _allData[i].orderNum;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.gysphone = _allData[i].phone;
                    myApp33.zhidanren = _allData[i].createUserName;
                    myApp33.shijian = _allData[i].createTime;
                    myApp33.supplierMC = _allData[i].supNum;
                    myApp33.supplierBM = _allData[i].contractOrder;
                    myApp33.ckselect = _allData[i].storageNum;
                    myApp33.supplierContent = _allData[i].contactName;
                    myApp33.supplierPhone = _allData[i].phone;
                }
            }
            //获取当前入库单号的
            _moTaiKuang($('#myModal'), '查看', 'flag', '' ,'', '');
            function sucFun3(result){
                datasTable($('#personTable1'),result)
            }
            detailInfo($thisDanhao,sucFun3);
            //所有操作框均为只读
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true);
            //新增物品按钮隐藏
            $('.zhiXingRenYuanButton').hide();
            //入库产品删除按钮不可操作
            $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
        })
        //表格编辑
        .on('click','.option-edit',function(){
            //审核备注不显示
            $('.shRemarks').hide();
            $('.tableHovers').children('.condition-query').show();
            //动态删除类名dengji
            $('#myModal').find('.confirm').removeClass('dengji').removeClass('shenhe').addClass('bianji');
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();
            _gdCode = $thisDanhao;
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    myApp33.rkleixing = _allData[i].inType;
                    myApp33.bianhao = _allData[i].orderNum;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.gysphone = _allData[i].phone;
                    myApp33.zhidanren = _allData[i].createUserName;
                    myApp33.shijian = _allData[i].createTime;
                    myApp33.supplierMC = _allData[i].supNum;
                    myApp33.supplierBM = _allData[i].contractOrder;
                    myApp33.ckselect = _allData[i].storageNum;
                    myApp33.supplierContent = _allData[i].contactName;
                    myApp33.supplierPhone = _allData[i].phone;
                }
            }
            //获取当前入库单号的
            _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');
            //获取入库信息的详细物品信息
            //获得当前的页数，
            $thisTbale = $(this).parents('.table');
            currentTable = $thisTbale.next().next();
            currentPages = parseInt(currentTable.children('span').children('.paginate_button.current').index());
            function secFun2(result){
                _rukuArr = [];
                for(var i=0;i<result.length;i++){
                    _rukuArr.push(result[i]);
                }
                datasTable($('#personTable1'),result)
            }
            detailInfo($thisDanhao,secFun2);
            //判断状态是已确认还是待确定
            if( $(this).next().html() == '已审核' ){
                //所有输入框不可操作；
                $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
                $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');
                $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
                $('#myApp33').find('textarea').attr('disabled',true);
                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').hide();
                //入库产品删除按钮不可操作
                $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
            }else if( $(this).next().html() == '待审核' ){
                //所有输入框不可操作；
                $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');
                $('#myApp33').find('input').parent('.input-blockeds').removeClass('disabled-block');
                $('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');
                $('#myApp33').find('textarea').attr('disabled',false);
                //入库单号、审核人、审核时间態修改
                $('.automatic').attr('disabled',true).addClass('disabled-block');
                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').html('修改物品').show();
                //入库产品删除按钮不可操作
                $('#personTable1 tbody').find('.option-shanchu').attr('disabled',false);
            }
        })
        //删除入库单
        .on('click','.option-delete',function(){
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();
            _gdCode = $thisDanhao;
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
            _moTaiKuang($myModal, '确定要删除吗？', '', '' ,'', '删除');
            //获得当前的页数，
            $thisTbale = $(this).parents('.table');
            currentTable = $thisTbale.next().next();
            currentPages = parseInt(currentTable.children('span').children('.paginate_button.current').index());
        })
        //入库单确认操作
        .on('click','.option-confirm',function(){
            //审核备注不显示
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
            var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();
            _gdCode = $thisDanhao;
            _$thisRKnum = $thisDanhao;
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    myApp33.rkleixing = _allData[i].inType;
                    myApp33.bianhao = _allData[i].orderNum;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.gysphone = _allData[i].phone;
                    myApp33.zhidanren = _allData[i].createUserName;
                    myApp33.shijian = _allData[i].createTime;
                    myApp33.supplierMC = _allData[i].supNum;
                    myApp33.supplierBM = _allData[i].contractOrder;
                    myApp33.ckselect = _allData[i].storageNum;
                    myApp33.supplierContent = _allData[i].contactName;
                    myApp33.supplierPhone = _allData[i].phone;
                    //判断制单人和审核人是不是一样
                    if(_allData[i].createUser == _userIdNum){
                        _examineRen = false;
                    }else{
                        _examineRen = true;
                    }
                }
            }
            //判断如果是查看功能的话，确认按钮消失
            $('#myModal').find('.confirm').addClass('shenhe');
            //获取当前入库单号的
            _moTaiKuang($('#myModal'), '审核', '', '' ,'', '审核');
            //获取入库信息的详细物品信息
            function secFun1(result){
                datasTable($('#personTable1'),result)
            };
            detailInfo($thisDanhao,secFun1);
            //所有操作框均为只读
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true);
            $('.shRemarks').find('textarea').attr('disabled',false);
            //新增物品按钮隐藏
            $('.zhiXingRenYuanButton').hide();
            //入库产品删除按钮不可操作
            $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
        })
        //入库已确认操作
        //.on('click','.option-confirmed',function(){
        //    $('#myModal2').find('.btn-primary').removeClass('.xiaoShanchu').removeClass('daShanchu');
        //    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'已确认，不能进行该操作', '');
        //})

    //表格编辑确认按钮
    $('#myModal')
        .on('click','.bianji',function(){
        var inStoreDetails1 = [];
        //入库单的信息
        for(var i=0;i<_rukuArr.length;i++){
            var obj = {};
            obj.sn = _rukuArr[i].sn;
            obj.itemNum = _rukuArr[i].itemNum;
            obj.itemName = _rukuArr[i].itemName;
            obj.size = _rukuArr[i].size;
            obj.isSpare = _rukuArr[i].isSpare;
            obj.unitName = _rukuArr[i].unitName;
            obj.batchNum = _rukuArr[i].batchNum;
            obj.maintainDate = _rukuArr[i].maintainDate;
            obj.num = _rukuArr[i].num;
            obj.inPrice = _rukuArr[i].inPrice;
            obj.amount = _rukuArr[i].amount;
            obj.inMemo = _rukuArr[i].inMemo;
            obj.userID=_userIdNum;
            obj.userName = _userIdName;
            obj.storageName = _rukuArr[i].storageName;
            obj.storageNum = _rukuArr[i].storageNum;
            inStoreDetails1.push(obj);
        }
        var ckName = '';
        if($('#ckselect').val() == ''){
            ckName = ''
        }else{
            ckName = $('#ckselect').children('option:selected').html();
        }
        var prm = {
            'orderNum':myApp33.bianhao,
            'inType':myApp33.rkleixing,
            'remark':myApp33.remarks,
            'inStoreDetails':inStoreDetails1,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
            'storageName':ckName,
            'storageNum':$('#ckselect').val(),
            'supName':myApp33.supplierMC,
            'contractOrder':myApp33.supplierBM
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWCK/ywCKEditInStorage',
            data:prm,
            success:function(result){
                if(result ==99){
                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'修改成功！', '');
                    conditionSelect();
                    $('#myModal').modal('hide');
                }else{
                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'修改失败！', '')
                }
                //点击一下当前的数字，自动指向当前页
                currentTable.children('span').children('.paginate_button').eq(currentPages).click();
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })
        .on('click','.shenhe',function(){
            if( !_examineRen ){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'不能审核自己创建的入库单！', '');
            }else{
                var prm = {
                    'OrderNum':_$thisRKnum,
                    userID:_userIdNum,
                    userName:_userIdName,
                    b_UserRole:_userRole,
                    'auditMemo':myApp33.shRemarks
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
                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'确认成功！', '')
                            $('#myModal').modal('hide');
                            conditionSelect();

                        }else{
                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'确认失败！', '')
                        }
                        //点击一下当前的数字，自动指向当前页
                        currentTable.children('span').children('.paginate_button').eq(currentPages).click();
                        $(this).removeClass('shenhe');
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })
            }

        })

    //增加入库单操作(仅仅是全端静态操作，没有涉及数据库)
    $('#myModal1').on('click','.ruku',function(){
        $('#myModal1').modal('hide');
        datasTable($('#personTable1'),_rukuArr);
    })

    //删除入库物品操作
    $('#personTable1 tbody')
        .on('click','.option-shanchu',function(){
        _$thisRemoveRowXiao = $(this).parents('table').children('tbody').find('.bianma').html();
            _moTaiKuang($('#myModal2'),'提示', '', 'istap' ,'确定要删除吗？', '删除');
        //新添加类名，实现入库单操作；
        $('#myModal2').find('.btn-primary').removeClass('daShanchu').addClass('xiaoShanchu');
        $('#myModal2').find('.btn-primary').addClass('xiaoShanchu');
    })
        .on('click','.option-see1',function(){
            //出现详情页面
            _moTaiKuang($('#myModal6'), '入库产品详情', 'flag', '' ,'', '');
            //获取详情，赋值
            function secFun(result){
                rukuObject.bianhao = result[0].itemNum;
                rukuObject.mingcheng = result[0].itemName;
                rukuObject.size = result[0].size;
                rukuObject.picked = result[0].isSpare;
                rukuObject.goodsId = result[0].sn;
                rukuObject.unit = result[0].unitName;
                rukuObject.quality = result[0].batchNum;
                rukuObject.warranty = result[0].maintainDate;
                rukuObject.num = result[0].num;
                rukuObject.inPrice = result[0].inPrice;
                rukuObject.amount = result[0].amount;
                rukuObject.remark = result[0].inMemo;
                if(rukuObject.picked == 0){
                    $('.durable').parent('span').removeClass('checked');
                    $('.durable').parent('span').eq(1).addClass('checked');
                }else{
                    $('.durable').parent('span').removeClass('checked');
                    $('.durable').parent('span').eq(0).addClass('checked');
                }
                //所有信息不可编辑
                $('#rukuObject').find('.gdList').children('.input-blockeds').addClass('disabled-block');
                $('#rukuObject').find('.gdList').children('.input-blockeds').children('input').addClass('disabled-block').attr('disabled',true);
            }
            detailInfo(_gdCode,secFun)
        })

    //入库物品删除操作按钮
    $('#myModal2').on('click','.xiaoShanchu',function(){
        _rukuArr.removeByValue(_$thisRemoveRowXiao,'itemNum');
        datasTable($('#personTable1'),_rukuArr);
        $('#myModal2').modal('hide');
    })

    //入库单确认删除操作
    $('.modal').on('click','.daShanchu',function(){
        var prm = {
            'orderNum':_$thisRemoveRowDa,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKDelInStorage',
            data:prm,
            success:function(result){
                if(result == 99){
                    _moTaiKuang($('#myModal5'),'提示','flag', 'istap' ,'删除成功！', '');
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
                }else {
                    _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'删除失败！', '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })

    //选择物品列表
    $('#wuPinListTable tbody').on('click','tr',function(){
        $('#wuPinListTable tbody').children('tr').removeClass('tables-hover');
        $(this).addClass('tables-hover');
        _$thisWP = $(this).children('.bianma').html();
    })

    //选择入库产品
    $('.tianJiaruku').click(function(){
            //选择物品列表
        wlList();
        _moTaiKuang($('#myModal4'),'选择入库产品', '', '' ,'', '选择');
    });

    //鼠标选择物品编码或名称
    $('.accord-with-list')
        .on('click','li',function(e){
            workDone.bianhao = $(this).children('.dataNum').html();
            workDone.mingcheng = $(this).children('.dataName').html();
            workDone.size = $(this).children('.dataSize').html();
            workDone.picked = $(this).attr('data-durable');
            workDone.unit = $(this).attr('data-unit');
            if(workDone.picked == 0){
                $('.inpus').parent('span').removeClass('checked');
                $('.inpus').parent('span').eq(1).addClass('checked');
                //物品id必须跟物品编码一样
                workDone.goodsId = workDone.bianhao;
                $('.rknum').attr('disabled',false).removeClass('disabled-block');
                $('.rknum').parents('.input-blockeds').removeClass('disabled-block');
                //置为不可操作
                $('.goodsId').attr('disabled',true).addClass('disabled-block');
                $('.goodsId').parents('.input-blockeds').addClass('disabled-block');
                workDone.num = '';
            }else if(workDone.picked == 1){
                $('.inpus').parent('span').removeClass('checked');
                $('.inpus').parent('span').eq(0).addClass('checked');
                $('.goodsId').attr('disabled',false).removeClass('disabled-block');
                $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
                $('.rknum').attr('disabled',true).addClass('disabled-block');
                $('.rknum').parents('.input-blockeds').addClass('disabled-block');
                workDone.num = '1';
                workDone.goodsId = '';
            }
            $(this).parents('.hidden1').hide();
            e.stopPropagation();
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
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');
        }else{
            var o = $('.format-error')[0].style.display;
            var s = $('.format-error1')[0].style.display;
            var a = $('.isEqual')[0].style.display;
            var b = $('.isEnabled')[0].style.display;
            if(o!='none' && s!='none' && a!='none' && b!='none'){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');
            }else{
                //首先判断输入过了没
                var existFlag = false;
                for(var i=0;i<_rukuArr.length;i++){
                    if(workDone.bianhao == _rukuArr[i].itemNum && workDone.kuwei == _rukuArr[i].addRK){
                        existFlag = true;
                    }
                }
                if(existFlag){
                    //有
                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'已添加过！', '');
                }else{
                    //无
                    //获取入库单信息创建对象，存入_rukuArr数组
                    var rukuDan = {};
                    rukuDan.sn = workDone.goodsId;
                    rukuDan.itemNum = workDone.bianhao;
                    rukuDan.itemName = workDone.mingcheng;
                    rukuDan.size = workDone.size;
                    rukuDan.isSpare = workDone.picked;
                    rukuDan.unitName = workDone.unit;
                    rukuDan.batchNum = workDone.quality;
                    rukuDan.maintainDate = workDone.warranty;
                    rukuDan.num = workDone.num;
                    rukuDan.inPrice = workDone.inPrice;
                    rukuDan.amount = workDone.amount;
                    rukuDan.inMemo = workDone.remark;
                    rukuDan.localNum = $('.kuwei').attr('data-num');
                    rukuDan.localName = workDone.kuwei;
                    var ckName = '';
                    if($('#ckselect').val() == ''){
                        ckName = ''
                    }else{
                        ckName = $('#ckselect').children('option:selected').html();
                    }
                    rukuDan.storageName = ckName;
                    rukuDan.storageNum = $('#ckselect').val();
                    _rukuArr.push(rukuDan);
                    datasTable($('#wuPinListTable1'),_rukuArr.reverse());
                    //添加之后自动重置
                    workDone.goodsId = '';
                    workDone.bianhao = '';
                    workDone.mingcheng = '';
                    workDone.size = '';
                    workDone.picked = 0;
                    workDone.unit = '';
                    workDone.quality = '新件';
                    workDone.warranty = '';
                    workDone.num = '';
                    workDone.inPrice = '';
                    workDone.amount = 0;
                    workDone.remark = '';
                    workDone.kuwei = '';
                    $('.kuwei').removeAttr('data-num');
                    if(workDone.picked == 0){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(1).addClass('checked');
                    }else if(workDone.picked == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(0).addClass('checked');
                    }
                    //工单id置为可编辑
                    $('.goodsId').attr('disabled',false).removeClass('disabled-block');
                    $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
                    $('.rknum').attr('disabled',false).removeClass('disabled-block');
                    $('.rknum').parents('.input-blockeds').removeClass('disabled-block');
                    //自动聚焦
                    $('.not-editable').eq(0).focus();
                }
            }
        }
    });

    //重置
    $('#addReset').click(function(){
        workDone.goodsId = '';
        workDone.bianhao = '';
        workDone.mingcheng = '';
        workDone.size = '';
        workDone.picked = 0;
        workDone.unit = '';
        workDone.quality = '新件';
        workDone.warranty = '';
        workDone.num = '';
        workDone.inPrice = '';
        workDone.amount = 0;
        workDone.remark = '';
        workDone.kuwei = '';
        $('.kuwei').removeAttr('data-num');
        if(workDone.picked == 0){
            $('.inpus').parent('span').removeClass('checked');
            $('.inpus').parent('span').eq(1).addClass('checked');
        }else if(workDone.picked == 1){
            $('.inpus').parent('span').removeClass('checked');
            $('.inpus').parent('span').eq(0).addClass('checked');
        }
        //工单id置为可编辑
        $('.goodsId').attr('disabled',false).removeClass('disabled-block');
        $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
        $('.rknum').attr('disabled',false).removeClass('disabled-block');
        $('.rknum').parents('.input-blockeds').removeClass('disabled-block');
        //自动聚焦
        $('.not-editable').eq(0).focus();
        //所有框可操作
        $('.not-editable').attr('disabled',false).removeClass('disabled-block');
        $('#wuPinListTable1 tbody').children('tr').css('background','#ffffff');
        $('.accord-with-list').hide();
        //编辑的时候，编码，名称，规格型号，是否耐用，单位都不可修改
        $('.auto-input').attr('disabled',false).removeClass('disabled-block');
        $('.auto-input').parents('.input-blockeds').removeClass('disabled-block');
        $('.goodsId').attr('disabled',false).removeClass('disabled-block');
        $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
        //重置的时候，是否耐用、单位不可操作
        $('.automatic').attr('disabled',true).addClass('disabled-block');
    });

    //入库物品操作静态删除
    $('#wuPinListTable1 tbody')
        .on('click','.option-shanchu',function(event){
            _$thisRemoveRowXiao = $(this).parents('table').children('tbody').find('.bianma').html();
            _moTaiKuang($('#myModal2'), '提示', '', 'istap' ,'确定要删除吗？', '删除');
            //新添加类名，实现入库单操作；
            $('#myModal2').find('.btn-primary').removeClass('daShanchu').removeClass('xiaoShanchu').addClass('removeButton');

            event.stopPropagation();
        })
        //点击表格中的数据，将内容赋值给onput，以便编辑
        .on('click','.option-bianji',function(){
            //编辑的时候，编码和名称，条形码不能修改。
            var $this = $(this).parents('tr');
            $('.not-editable').attr('disabled',true).addClass('disabled-block');
            //编辑的时候，编码，名称，规格型号，是否耐用，单位都不可修改
            $('.auto-input').attr('disabled',true).addClass('disabled-block');
            $('.auto-input').parents('.input-blockeds').addClass('disabled-block');
            $(this).html('保存').removeClass('option-bianji').addClass('option-save');
            $('.accord-with-list').hide();
            $('.size').attr('disabled',false).removeClass('disabled-block');
            $('.size').parent('.input-blockeds').removeClass('disabled-block');
            //库区可修改
            $('.kuwei').attr('disabled',false).removeClass('disabled-block');
            $('.kuwei').parent('.input-blockeds').removeClass('disabled-block');
            //样式修改
            $('#wuPinListTable1 tbody').children('tr').css({'background':'#ffffff'});
            $this.css({'background':'#FBEC88'});
            var bm = $this.find('.bianma').html();
            for(var i=0;i<_rukuArr.length;i++){
                if(_rukuArr[i].itemNum == bm){
                    //赋值
                    workDone.bianhao = _rukuArr[i].itemNum;
                    workDone.mingcheng = _rukuArr[i].itemName;
                    workDone.size = _rukuArr[i].size;
                    workDone.picked = _rukuArr[i].isSpare;
                    workDone.kuwei = _rukuArr[i].localName;
                    $('.kuwei').attr('data-num',_rukuArr[i].localNum);
                    if(workDone.picked == 0){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(1).addClass('checked');
                        //物品id必须跟物品编码一样
                        workDone.goodsId = _rukuArr[i].sn;
                        //置为不可操作
                        $('.goodsId').attr('disabled',true).addClass('disabled-block');
                        $('.goodsId').parents('.input-blockeds').addClass('disabled-block');
                    }else if(workDone.picked == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(0).addClass('checked');
                        $('.goodsId').attr('disabled',false).removeClass('disabled-block');
                        $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
                    }
                    workDone.goodsId = _rukuArr[i].sn;
                    workDone.unit = _rukuArr[i].unitName;
                    workDone.quality = _rukuArr[i].batchNum;
                    workDone.warranty = _rukuArr[i].maintainDate;
                    workDone.num = _rukuArr[i].num;
                    workDone.inPrice = _rukuArr[i].inPrice;
                    workDone.amount = _rukuArr[i].amount;
                    workDone.remark = _rukuArr[i].inMemo;
                }
            }
        })
        .on('click','.option-save',function(){
            $('.not-editable').attr('disabled',false).removeClass('disabled-block');
            if(workDone.bianhao == '' || workDone.mingcheng == '' || workDone.num == ''){
                //提示框
                _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'请填写红色必填项!', '');
            }else{
                var o = $('.format-error')[0].style.display;
                var s = $('.format-error1')[0].style.display;
                var a = $('.isEqual')[0].style.display;
                var b = $('.isEnabled')[0].style.display;
                if(o!='none' || s!='none' || a!='none' || b!='none'){
                    _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'输入有误!', '');
                }else{
                    var bm = workDone.bianhao;
                    for(var i=0;i<_rukuArr.length;i++){
                        if(bm == _rukuArr[i].itemNum){
                            _rukuArr[i].localName = workDone.kuwei;
                            _rukuArr[i].localNum = $('.kuwei').attr('data-num');
                            _rukuArr[i].num = workDone.num;
                            _rukuArr[i].inPrice = workDone.inPrice;
                            _rukuArr[i].amount = workDone.amount;
                            _rukuArr[i].inMemo = workDone.remark;
                            _rukuArr[i].sn = workDone.goodsId;
                            _rukuArr[i].batchNum = workDone.quality;
                            _rukuArr[i].maintainDate = workDone.warranty;
                        }
                    }
                    datasTable($('#wuPinListTable1'),_rukuArr);
                    //编辑之后清空
                    workDone.goodsId = '';
                    workDone.bianhao = '';
                    workDone.mingcheng = '';
                    workDone.size = '';
                    workDone.picked = 0;
                    workDone.unit = '';
                    workDone.quality = '新件';
                    workDone.warranty = '';
                    workDone.num = '';
                    workDone.inPrice = '';
                    workDone.amount = 0;
                    workDone.remark = '';
                    workDone.kuwei = '';
                    $('.kuwei').removeAttr('data-num');
                    if(workDone.picked == 0){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(1).addClass('checked');
                    }else if(workDone.picked == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(0).addClass('checked');
                    }
                    //工单id置为可编辑
                    $('.goodsId').attr('disabled',false).removeClass('disabled-block');
                    $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
                    $('.rknum').attr('disabled',false).removeClass('disabled-block');
                    $('.rknum').parents('.input-blockeds').removeClass('disabled-block');
                    $('.auto-input').attr('disabled',false).removeClass('disabled-block');
                    $('.auto-input').parents('.input-blockeds').removeClass('disabled-block');
                    //自动聚焦
                    $('.not-editable').eq(0).focus();
                    //是否耐用，单位不可操作
                    $('.automatic').attr('disabled',true).addClass('disabled-block');
                }
            }
        })

    $('#myModal2').on('click','.removeButton',function(){
        //静态删除
        _rukuArr.removeByValue(_$thisRemoveRowXiao,'itemNum');
        datasTable($('#wuPinListTable1'),_rukuArr.reverse());
        $('#myModal2').modal('hide');
        $(this).removeClass('removeButton');
    });

    //通过表格选择入库产品
    $('#myModal4').on('click','.btn-primary',function(){
        //通过编码来找数组
        for(var i=0;i<_wpListArr.length;i++){
            if(_wpListArr[i].itemNum == _$thisWP){
                workDone.bianhao = _wpListArr[i].itemNum;
                workDone.mingcheng = _wpListArr[i].itemName;
                workDone.size = _wpListArr[i].size;
                workDone.picked = _wpListArr[i].isSpare;
                if(workDone.picked == 0){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(1).addClass('checked');
                    workDone.goodsId = workDone.bianhao;
                    $('.goodsId').attr('disabled',true).addClass('disabled-block');
                    $('.goodsId').parents('.input-blockeds').addClass('disabled-block');
                    //数量
                    $('.rknum').attr('disabled',false).removeClass('disabled-block');
                    $('.rknum').parent('.input-blockeds').removeClass('disabled-block');
                    workDone.num = '';
                }else if(workDone.picked == 1){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(0).addClass('checked');
                    $('.goodsId').attr('disabled',false).removeClass('disabled-block').html('');
                    $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
                    //数量
                    $('.rknum').attr('disabled',true).addClass('disabled-block');
                    $('.rknum').parent('.input-blockeds').addClass('disabled-block');
                    workDone.num = 1;
                }
                workDone.unit = _wpListArr[i].unitName;
            }
        }
        $('#myModal4').modal('hide');
    });

    //入库产品的回车自动聚焦功能
    $('.inputType').keyup(function(e){
        var e = e||window.event;
        if(e.keyCode == 13){
            $(this).parents('.gdList').next('li').find('.inputType').focus();
        }
    });

    //入库产品--品质选择
    $('.pinzhixx')
        .on('click','div',function(e){
            workDone.quality = $('.pinzhixx').children('.li-color').html();
            var pzNum = $('.pinzhixx').children('.li-color').attr('data-value');
            $('.quality').attr('data-pzNum',pzNum);
            $(this).parents('.gdList').next('li').find('.inputType').focus();
            $(this).parents('.hidden1').hide();
            e.stopPropagation();
        })
        .on('mouseover','div',function(){
            $(this).parent('.pinzhixx').children('div').removeClass('li-color');
            $(this).addClass('li-color');
            _pzNum = $('.li-color').index();

        })

    $('.bianhao').change(function(){
        workDone.mingcheng = '';
        workDone.size='';
        workDone.picked = 0;
        workDone.goodsId = '';
        workDone.unit = '';
        workDone.quality = '新件';
        workDone.warranty = '';
        workDone.num ='';
        workDone.inPrice = '';
        workDone.amount = '';
        workDone.remark = '';
        if(workDone.picked == 0){
            $('.inpus').parent('span').removeClass('checked');
            $('.inpus').parent('span').eq(1).addClass('checked');
        }else if(workDone.picked == 1){
            $('.inpus').parent('span').removeClass('checked');
            $('.inpus').parent('span').eq(0).addClass('checked');
        }
        $('.goodsId').attr('disabled',false).removeClass('disabled-block');
        $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
        $('.rknum').attr('disabled',false).removeClass('disabled-block');
        $('.rknum').parents('.input-blockeds').removeClass('disabled-block');
    });

    //点击下拉三角，出现的地方
    $('.selectBlock').click(function(e){
        if($(this).parent('.input-blockeds').hasClass('disabled-block')){
            return false;
        }else{
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

    $(document).click(function(){
        $('.hidden1').hide();
    });

    //库位点击选择
    $('.kuqu-list')
        .on('click','li',function(e){
            //赋值
            workDone.kuwei = $(this).html();
            $('.kuwei').attr('data-num',$(this).attr('data-num'));
            $(this).parents('.hidden1').hide();
            e.stopPropagation();
        })
        .on('mouseover','li',function(e){
            $(this).parents('.kuqu-list').children('li').removeClass('li-color');
            $(this).addClass('li-color');
        })

    //入库产品条件选择
    $('#selected2').click(function(){
        var prm = {
            'ItemNum':$('.filterInput1').eq(0).val(),
            'itemName':$('.filterInput1').eq(1).val(),
            'cateName':$('.filterInput1').eq(2).val(),
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            data:prm,
            success:function(result){
                datasTable($("#wuPinListTable"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })
    /*------------------------------------其他方法-------------------------------*/

    //表格初始化
    function tableInit(tableId,col,buttons,flag){
        var _tables = tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": true,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": false,
            "iDisplayLength":50,//默认每页显示的条数
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '没有数据',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            "dom":'B<"clear">lfrtip',
            'buttons':buttons,
            "columns": col
        })
        if(flag){
            _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
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
        //仓库
        console.log(_ckArr);
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
                datasTable($('#scrap-datatables1'),confirm);
                datasTable($('#scrap-datatables2'),confirmed);
                datasTable($('#scrap-datatables'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //仓库选择（第一次页面加载时，flag）；
    function warehouse(flag){
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
                if(flag){
                    //console.log(result);
                    _ckArr.length = 0;
                    for(var i=0;i<result.length;i++){
                        _ckArr.push(result[i]);
                    }
                    conditionSelect();
                }else{
                    var str = '<option value="">请选择</option>'
                    for(var i=0;i<result.length;i++){
                        str += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';
                    }
                    $('#ckselect').empty().append(str);
                    myApp33.ckselect = result[0].storageNum;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取物品列表
    function wlList(flag){
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
                _wpListArr = result;
                var str = '';
                //给物品编码和物品名称的列表赋初始值
                for(var i=0;i<result.length;i++){
                    str += '<li data-durable="' + _wpListArr[i].isSpare +
                        '"' + 'data-unit="' + _wpListArr[i].unitName +
                        '"data-quality="' + _wpListArr[i].batchNum +
                        '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                        '"' + 'data-sn="' + _wpListArr[i].sn +
                        '"' +
                        'data-shengyu="' + _wpListArr[i].num +
                        '"' +
                        '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                        '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                        '<span class="dataSize" style="margin-left: 20px;">' +
                        _wpListArr[i].size+'</span>' +
                        '</li>'
                }
                $('.accord-with-list').eq(0).empty().append(str);
                $('.accord-with-list').eq(1).empty().append(str);
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
    function rkLX(type,flag){
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
                    if(flag){
                        var str = '<option value="">全部</option>';
                        for(var i=0;i<result.length;i++){
                            str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                        }
                        $('.tiaojian').empty().append(str);
                    }else{
                        var str = '<option value="">请选择</option>';
                        for(var i=0;i<result.length;i++){
                            str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                        }
                        $('#rkleixing').empty().append(str);
                    }
                }else{
                    var str = '<option value="">全部</option>';
                    for(var i=0;i<result.length;i++){
                        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                    }
                    $('#ckType').empty().append(str);
                }

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

    //键盘选择出库产品(专门针对物品id的)
    function keySelect(value,index,flag){
        var e = e || window.event;
        //下键40 上键38
        if(e.keyCode == 40){
            //按下键的时候，
            //获得所有li
            var lis = $('.accord-with-list').eq(index).children('li');
            if(_num<lis.length-1){
                _num ++;
            }else{
                _num = lis.length-1;
            }
            lis.removeClass('li-color');
            lis.eq(_num).addClass('li-color');
            //首先获取ul的高度
            var ulHeight = $('.accord-with-list').eq(index).height();
            var num = parseInt(ulHeight/30);
            //判断放了几个ul
            if(_num > num){
                var height = (_num - num) * 30;
                $('.accord-with-list').eq(index).scrollTop(height);
            }
        }else if(e.keyCode == 38){
            var lis = $('.accord-with-list').eq(index).children('li');
            if(_num<1){
                _num =0;
            }else{
                _num--;
            }
            lis.removeClass('li-color');
            lis.eq(_num).addClass('li-color');
            //首先获取ul的高度
            var ulHeight = $('.accord-with-list').eq(index).height();
            var num = parseInt(ulHeight/30);
            if(_num < lis.length -num){
                var height = (_num-num) * 30;
                $('.accord-with-list').eq(index).scrollTop(height);
            }

        }else if(e.keyCode == 13){
            var lis = $('.accord-with-list').eq(index).children('li');
            for(var i=0;i<lis.length;i++){
                if(lis.eq(i).attr('class') == 'li-color'){
                    workDone.bianhao = lis.eq(i).children('.dataNum').html();
                    workDone.mingcheng = lis.eq(i).children('.dataName').html();
                    workDone.size = lis.eq(i).children('.dataSize').html();
                    workDone.picked = lis.eq(i).attr('data-durable');
                    workDone.unit = lis.eq(i).attr('data-unit');
                    if(workDone.picked == 0){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(1).addClass('checked');
                        //物品id必须跟物品编码一样
                        workDone.goodsId = workDone.bianhao;
                        //置为不可操作
                        $('.goodsId').attr('disabled',true).addClass('disabled-block');
                        $('.goodsId').parents('.input-blockeds').addClass('disabled-block');
                        $('.rknum').attr('disabled',false).removeClass('disabled-block');
                        $('.rknum').parents('.input-blockeds').removeClass('disabled-block');
                        workDone.num = '';
                    }else if(workDone.picked == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(0).addClass('checked');
                        $('.goodsId').attr('disabled',false).removeClass('disabled-block');
                        $('.goodsId').parents('.input-blockeds').removeClass('disabled-block');
                        workDone.num = '1';
                    }
                    //选择完之后，关闭
                    $('.accord-with-list').hide();
                }
            }
            setTimeout(function(){
                if(workDone.goodsId != ''){
                    $('.inputType').eq(8).focus();
                }else{
                    $('.inputType').eq(5).focus();
                }
            },300);
        }else{
            if(e.keyCode != 9){
                _num = -1;
                $('.accord-with-list').eq(index).empty();
                //将符合输入的项列出来
                var searchValue = value;
                var includeArr = [];
                var str = '';
                for(var i=0;i<_wpListArr.length;i++){
                    if(flag){
                        if(_wpListArr[i].sn.indexOf(searchValue)>=0){
                            includeArr = [];
                            includeArr.push(_wpListArr[i]);
                            str += '<li data-durable="' + _wpListArr[i].isSpare +
                                '"' + 'data-unit="' + _wpListArr[i].unitName +
                                '"data-quality="' + _wpListArr[i].batchNum +
                                '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                                '"' + 'data-sn="' + _wpListArr[i].sn +
                                '"' +
                                'data-shengyu="' + _wpListArr[i].num +
                                '"' +
                                '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                                '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                                '<span class="dataSize" style="margin-left: 20px;">' +
                                _wpListArr[i].size+'</span>' +
                                '</li>'
                        }
                    }else{
                        if(_wpListArr[i].itemNum.indexOf(searchValue)>=0 || _wpListArr[i].itemName.indexOf(searchValue)>=0 ){
                            includeArr.push(_wpListArr[i]);
                            str += '<li data-durable="' + _wpListArr[i].isSpare +
                                '"' + 'data-unit="' + _wpListArr[i].unitName +
                                '"data-quality="' + _wpListArr[i].batchNum +
                                '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                                '"' + 'data-sn="' + _wpListArr[i].sn +
                                '"' + 'data-shengyu="' + _wpListArr[i].num +
                                '"' +
                            '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                            '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                            '<span class="dataSize" style="margin-left: 20px;">' +
                            _wpListArr[i].size+'</span>' +
                            '</li>'
                        }
                    }
                }
                if(includeArr.length>0){
                    $('.accord-with-list').eq(index).show();
                }
                $('.accord-with-list').eq(index).empty().append(str);
            }
        }
    }

    //获取入库单中的入库产品详细信息
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
            async:false,
            success:function(result){
                seccessFun(result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取供应商
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

    //获取出库单
    function chukuList(){
        var prm = {
            "st": $('.chukumin').val(),
            "et": $('.chukumax').val(),
            "orderNum": $('.chukuHao').val(),
            "outType": $('#ckType').val(),
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorage',
            data:prm,
            success:function(result){
                console.log(result);
                var arr = [];
                for(var i=0;i<result.length;i++){
                    if(result[i].status == 1){
                        arr.push(result[i]);
                    }
                }
                datasTable($('#scrap-datatables3'),arr);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

})