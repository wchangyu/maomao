$(function(){
    /*---------------------------------------------时间-----------------------------------------------------*/
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间
    //设置初始时间
    var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');

    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);

    /*--------------------------------------------变量-----------------------------------------------------*/
    //存放当前所有入库单的数组
    var _allData = [];

    //入库类型方法
    rkLX(1);

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

    //存放品质的数组
    var _pzArr = ['新件','良品','坏件'];

    //存放入库物品的数组
    var _rukuArr = [];

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
    _tableInit($('#wuPinListTable1'),col2,'1','','','');

    //表格数据
    warehouse();

    //获取所有物品列表
    wlList();

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

    //查询按钮
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');

        var inputs = parents.find('input');

        inputs.val('');

        //时间置为今天
        $('.min').val(_initStart);

        $('.max').val(_initEnd);
    });

    //新增
    $('.creatButton').click(function(){

        //模态框显示
        _moTaiKuang($('#myModal'), '新增入库单', '', '' ,'', '新增');

        //初始化
        newButtonInit();

        //选择物品按钮名称
        $('.zhiXingRenYuanButton').html('新增物品');

    });

    //新增物品按钮
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

            //根据选中的仓库，获取库区
            //console.log(putInList.ckselect)

            getKQ(putInList.ckselect);
        }



    })

    //点击新增物品模态框出现后执行的方法
    $('#myModal1').on('shown.bs.modal',function(){

        if(_addGoods){

            $('.warranty').focus();

            if($('.datepicker:visible')){

                $('.datepicker').hide();

            }

            //自动聚焦
            $('.not-editable').eq(0).focus();

            _addGoods = false;
        }

    })

    //添加入库产品
    $('#addRK').click(function(){

        console.log(putInGoods.kuwei)

        //验证非空
        if( putInGoods.bianhao == '' || putInGoods.mingcheng == '' || putInGoods.num == '' ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');

        }else{

            var a = $('.isEqual').css('display');

            var b = $('.isEnabled').css('display');

            var c = $('.format-error').css('display');

            var d = $('.format-error1').css('display');

            var e = $('.format-error3').css('display');

            if(a!='none' || b!='none' || c!='none' || d!='none' ||e!='none'){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

            }else{

                console.log('新增成功！')

            }

        }

    });

    /*------------------------------------------------入库产品键盘事件--------------------------------------*/

    //敲击回车，自动换行
    $('.inputType').keyup(function(e){

        var e = e||window.event;

        if(e.keyCode == 13 ){

            if( $(this).parents('.gdList').next('li').find('.inputType').attr('id') == 'addRK' ){

                //当前如果是添加按钮的话，敲击回车，自动想表格添加数据
                //首先判断非空(库位、编号、名称、数量)
                if( putInGoods.kuwei == '' || putInGoods.bianhao == '' || putInGoods.mingcheng == '' || putInGoods.num == '' ){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');

                }else{
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

                        //判断当前数据是否已添加过（库位和编号相同的时候，说明添加过）
                        var existFlag = false;
                        for(var i=0;i<_rukuArr.length;i++){
                            if(putInGoods.bianhao == _rukuArr[i].itemNum && putInGoods.kuwei == _rukuArr[i].addRK){

                                existFlag = true;

                            }
                        }
                        //添加过的话，提示已添加过，否则添加
                        if(existFlag){

                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'已添加过！', '');

                        }else{

                            //获取入库单信息创建对象，存入_rukuArr数组
                            var rukuDan = {};
                            //库区、物品编号、物品名称、规格型号、是否耐用、物品序列号、单位、品质、质保期、数量、入库单价、总金额、备注
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
                            rukuDan.inPrice = putInGoods.inprice;
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

                            _rukuArr.unshift(rukuDan);

                            _datasTable($('#wuPinListTable1'),_rukuArr);

                        }

                    }

                }

            }else{
                $(this).parents('.gdList').next('li').find('.inputType').focus();
            }

        }else{

            return false

        }


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
                //console.log(result);

                //条件查询的单据类型
                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].catNum +
                        '">' + result[i].catName + '</option>';
                }
                $('.tiaojian').empty().append(str);

                //添加入库单的入库类型
                $('#rkleixing').empty().append(str);

                //if(type == 1){
                //    if(flag){
                //        var str = '<option value="">全部</option>';
                //        for(var i=0;i<result.length;i++){
                //            str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                //        }
                //        $('.tiaojian').empty().append(str);
                //    }else{
                //        var str = '<option value="">请选择</option>';
                //        for(var i=0;i<result.length;i++){
                //            str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                //        }
                //        $('#rkleixing').empty().append(str);
                //    }
                //}else{
                //    var str = '<option value="">全部</option>';
                //    for(var i=0;i<result.length;i++){
                //        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                //    }
                //    $('#ckType').empty().append(str);
                //}

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
                conditionSelect();
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

            if( searchValue ==  _wpListArr[i].itemNum || searchValue ==  _wpListArr[i].itemName){

                arr.push(_wpListArr[i]);

                isWho = true;


            }else{

                if( _wpListArr[i].itemNum.indexOf(searchValue)>=0 || _wpListArr[i].itemName.indexOf(searchValue)>=0 ){

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


                //datasTable($('#wuPinListTable'),result);
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

})