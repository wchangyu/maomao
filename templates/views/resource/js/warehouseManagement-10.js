$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //新增vue对象数据绑定
    var wharehouse = new Vue({
        el:'#myApp33',
        data:{
            'num':'',
            'name':'',
            'barnum':'',
            'beizhu':'',
            'location':''
        },
        methods:{
            keyUpJob:function(){
                var existFlag = false;
                var allArr = [];
                var values = wharehouse.num;
                for(var i=0;i<_allData.length;i++){
                    if( values !=  _allData[i].storageNum){
                        existFlag = true;
                    }else{
                        existFlag = false;
                    }
                    allArr.push(existFlag);
                }
                if(allArr.indexOf(false)<0){
                    $('.quchong').hide();
                }else{
                    $('.quchong').show();
                }
            }
        }
    });

    //库区Vue对象
    var reservoir = new Vue(    {
        el:'#myApp11',
        data:{
            num:'',
            name:'',
            barnum:'',
            inventory:''
        },
        methods:{
            keyUpJob1:function(){
                var existFlag = false;
                var allArr = [];
                var values = reservoir.num;
                for(var i=0;i<_allKQ.length;i++){
                    if( values !=  _allKQ[i].localNum){
                        existFlag = true;
                    }else{
                        existFlag = false;
                    }
                    allArr.push(existFlag);
                }
                if(allArr.indexOf(false)<0){
                    $('.kquchong').hide();
                }else{
                    $('.kquchong').show();
                }
            }
        }
    })

    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    })

    //存放当前列表的数据
    var _allData = [];

    //存放库区列表数组
    var _allKQ = [];

    //存放所有仓库数据
    var _ckArr = [];

    //标识仓库下拉框已完成
    var _isWarehouse = false;
    /*-------------------------------------表格初始化------------------------------*/
    //仓库
    var col = [
        {
            title:'仓库编号',
            data:'storageNum',
            className:'bianma'
        },
        {
            title:'仓库名称',
            data:'storageName'
        },
        {
            title:'排序',
            data:'sort'
        },
        {
            title:'仓库所在地',
            data:'address'
        },
        {
            title:'备注',
            data:'remark'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class=''></i>编辑</span><span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"

        }
    ];
    _tableInit($('#scrap-datatables'),col,'1','flag','','');

    //库区
    var col1 = [
        {
            title:'库区编号',
            data:'localNum',
            className:'bianma'
        },
        {
            title:'库区名称',
            data:'localName'
        },
        {
            title:'所属仓库',
            data:'storageName'
        },
        {
            title:'排序',
            data:'sort'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class=''></i>编辑</span><span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"

        }
    ];
    _tableInit($('#scrap-datatables1'),col1,'1','flag','','');


    //默认界面只显示第一个导出按钮
    $('.excelButton .dt-buttons').eq(1).hide();

    //仓库select
    conditionSelect('YWCK/ywCKGetStorages','flag');
    //页面加载数据
    conditionSelect('YWCK/ywCKGetStorages');
    /*-------------------------------------按钮功能-------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //查询库区
        //conditionSelect('YWCK/ywCKGetLocations',false,true);
        locationSelect();
    })

    //重置
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
    })

    //新增
    $('.creatButton').click(function(){
        if(!$('.kq-manage').is(":hidden")){

            $('#myModal1 input').val('');
            $('#myModal1 .btn-primary').attr('type','add');
            _moTaiKuang($('#myModal1'), '新增库区', '', '' ,'', '新增');
            return false;
        }
        //都可以编辑
        $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');
        $('#myApp33').find('textarea').attr('disabled',false);
        //清空所有内容
        wharehouse.name = '';
        wharehouse.num = '';
        wharehouse.beizhu = '';
        wharehouse.barnum = '';
        wharehouse.location = '';
        $('#myModal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
        _moTaiKuang($('#myModal'), '新增仓库', '', '' ,'', '新增');
    });

    //编辑按钮
    $('#scrap-datatables')
        .on('click','.option-edit',function(){
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');
            _moTaiKuang($('#myModal'), '编辑仓库','', '' ,'', '保存');
            //绑定数据
            bindData($(this),'YWCK/ywCKGetStorages');
            //编码不可编辑
            $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');
            $('#myApp33').find('input').eq(0).attr('disabled',true).addClass('disabled-block');
        })
        .on('click','.option-delete',function(){

            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

            _moTaiKuang($('#myModal'), '确定要删除吗？', '', '' ,'', '删除');

            //绑定数据
            bindData($(this),'YWCK/ywCKGetStorages');

            //都不可编辑
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');

            $('#myApp33').find('textarea').attr('disabled',true);
        })

    //确定按钮
    $('#myModal')
        //登记确定按钮
        .on('click','.dengji',function(){
            sendMessage('YWCK/ywCKAddStorage','新增成功！','新增失败','1');
        })
        //编辑确定按钮
        .on('click','.bianji',function(){
            sendMessage('YWCK/ywCKUptStorage','编辑成功！','编辑失败','2');
        })
        //删除确定按钮
        .on('click','.shanchu', function () {
            sendMessage('YWCK/ywCKDelStorage','删除成功！','删除失败','3');
        })

    /*-------------------------------------方法---------------------------------*/
    //查询仓库，①无参数的时候，查询仓库，②flag1 select下拉框 ③flag2查询库区
    function conditionSelect(url,flag1,flag2){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
            storageNum:$('#ck-select').val()
        }
        $.ajax({
            type:'post',
            url: _urls + url,
            data:prm,
            async:false,
            success:function(result){
                if(flag1){
                    _isWarehouse = true;
                    _ckArr.length = 0;
                    var str = '<option value="">全部</option>';
                    var str1 = '';
                    for(var i=0;i<result.length;i++){
                        _ckArr.push(result[i]);
                        str1 += '<option value="' + result[i].storageNum +
                            '">' + result[i].storageName + '</option>'
                    }
                    $('#ck-select').empty().append(str + str1);
                    $('.ck-list').empty().append(str1);
                    //console.log(_ckArr);
                    if(_isWarehouse){
                        locationSelect();
                    }
                }else if(flag2){
                    _allKQ = [];
                    for(var i=0;i<result.length;i++){
                        _allKQ.push(result[i]);
                    }
                    _datasTable($('#scrap-datatables1'),result);
                }else{
                    _allData = [];
                    for(var i=0;i<result.length;i++){
                        _allData.push(result[i]);
                    }
                    _datasTable($('#scrap-datatables'),result);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //查询库区
    function locationSelect(){
        var ckArr = [];
        var ckNum = '';
        if($('#ck-select').val() == ''){
            for(var i=0;i<_ckArr.length;i++){
                ckArr.push(_ckArr[i].storageNum);
            }
            ckNum = '';
        }else{
            ckNum = $('#ck-select').val();
            ckArr = [];
        }
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
            storageNums:ckArr,
            storageNum:ckNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetLocations',
            timeout:_theTimes,
            data:prm,
            success: function (result) {
                _allKQ = [];
                for(var i=0;i<result.length;i++){
                    _allKQ.push(result[i]);
                }
                _datasTable($('#scrap-datatables1'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //绑定数据
    function bindData(el,url,flag){

        var $this = el.parents('tr');

        var $thisBM = $this.children('.bianma').html();

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }

        if(flag){
            prm.localNum=$thisBM
        }else{
            prm.storageNum=$thisBM
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                if(result.length>0){
                    //赋值
                    if(flag){
                       $('#myModal1 .localNum').val(result[0].localNum);
                        $('#myModal1 .localName').val(result[0].localName);
                        $('#myModal1 .ck-list').val(result[0].storageNum);
                        $('#myModal1 .local-sort').val(result[0].sort);
                    }else{
                        wharehouse.num = result[0].storageNum;
                        wharehouse.name = result[0].storageName;
                        wharehouse.barnum = result[0]['sort'];
                        wharehouse.beizhu = result[0].remark;
                        wharehouse.location = result[0].address;
                    }

                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //登记/编辑/删除
    function sendMessage(url,succcessMeg,errorMeg,flag){
        //判断仓库编码是否重复
        var firstTip = $('.quchong')[0].style.display;
        var ckName = $('.ckName').css('display');
        // 首先判断是否为空
        if(ckName == 'none' && wharehouse.num != '' && wharehouse.name != ''){
            //判断编号是否重复
            if(firstTip == 'none'){
                //用flag来区分哪个是编辑，哪个是登记，登记不需要发送编码，编辑需要,flag=1代表登记flag=2代表编辑flag=3代表删除,
                var prm = {};
                if(flag == 1){
                    //登记
                    prm.storageNum = wharehouse.num;
                    prm.storageName = wharehouse.name;
                    prm.sort  = wharehouse.barnum;
                    prm.remark = wharehouse.beizhu;
                    prm.address = wharehouse.location;
                }else if(flag == 2){
                    prm.storageNum = wharehouse.num;
                    prm.storageNum = wharehouse.num;
                    prm.storageName = wharehouse.name;
                    prm.sort  = wharehouse.barnum;
                    prm.remark = wharehouse.beizhu;
                    prm.address = wharehouse.location;
                }else if(flag == 3){
                    prm.storageNum = wharehouse.num;
                }
                prm.userID = _userIdNum;
                prm.userName = _userIdName;
                $.ajax({
                    type:'post',
                    url:_urls + url,
                    data:prm,
                    success:function(result){
                        if(result == 99){
                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,succcessMeg, '');
                            $('#myModal').modal('hide');
                            //刷新仓库
                            conditionSelect('YWCK/ywCKGetStorages');
                            //舒心仓库列表
                            conditionSelect('YWCK/ywCKGetStorages','flag');
                        }else{
                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,errorMeg, '');
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })
            }else{
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'仓库编码不能重复！', '');
            }
        }else{
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');
        }
    }

    //仓库下拉框
    //function

    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint');

    /*--------------------------------按钮事件--------------------------*/
    //tab切换
    $('.table-title').find('span').click(function(){
        $('.table-title').find('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.table-block-list').hide();
        $('.table-block-list').eq($(this).index()).show();
        //默认界面只显示第一个导出按钮
        $('.table-block-list').find('.excelButton .dt-buttons').hide();
        $('.table-block-list').eq($(this).index()).find('.excelButton .dt-buttons').eq($(this).index()).show();
    });

    //编辑按钮
    $('#scrap-datatables1')
        .on('click','.option-edit',function(){
            $('#myModal1').find('.btn-primary').attr('type','redact');
            _moTaiKuang($('#myModal1'), '编辑','', '' ,'', '保存');
            //绑定数据
            bindData($(this),'YWCK/ywCKGetLocations',true);
            //编码不可编辑
            $('#myApp11').find('input').attr('disabled',false).removeClass('disabled-block');
            $('#myApp11').find('input').eq(0).attr('disabled',true).addClass('disabled-block');
        })
        .on('click','.option-delete',function(){
            $('#myModal1').find('.btn-primary').attr('type','remove');
            _moTaiKuang($('#myModal1'), '确定要删除吗？', '', '' ,'', '删除');
            //绑定数据
            bindData($(this),'YWCK/ywCKGetLocations',true);
            //都不可编辑
            $('#myApp11').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp11').find('textarea').attr('disabled',true);
        })

    //点击模态框确定按钮时按钮
    $('#myModal1').on('click','.btn-primary',function(){
        //新增时
        if($(this).attr('type') == 'add'){
            postKQdata('YWCK/ywCKAddLocation','0','新增成功');
        }
        //修改时
        if($(this).attr('type') == 'redact'){
            postKQdata('YWCK/ywCKUptLocation','0','修改成功');
        }
        //删除时
        if($(this).attr('type') == 'remove'){
            postKQdata('YWCK/ywCKDelLocation','0','删除成功');
        }
    });

    //给后台传递数据
    function postKQdata(url,flag,succcessMeg){

        //获取库区编码
        var localNum = $('#myModal1 .localNum').val();
        //获取库区名称
        var localName = $('#myModal1 .localName').val();
        //获取库区所属仓库编号
        var storageNum = $('#myModal1 .ck-list').val();
        //获取库区所属仓库名称
        var storageName = $('#myModal1 .ck-list').find("option:selected").text();
        //获取库区排序
        var localSort = $('#myModal1 .local-sort').val();
        if( localNum == '' || localName == '') {
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap', '请填写红色必填项！', '');
            //return false;
        }else{
            var kqc = $('.kquchong').css('display');
            if(kqc == 'none'){
                var prm = {};
                prm.storageNum = storageNum;
                prm.storageName = storageName;
                prm.localNum = localNum;
                prm.localName = localName;
                prm.sort = localSort;
                prm.userID = _userIdNum;
                prm.userName = _userIdName;
                //给后台传递参数
                $.ajax({
                    type:'post',
                    url:_urls + url,
                    data:prm,
                    success:function(result){
                        if(result == 99){
                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,succcessMeg, '');
                            $('#myModal1').modal('hide');
                            //conditionSelect('YWCK/ywCKGetLocations',false,true);
                            locationSelect();
                        }else{
                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'出现错误', '');
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })
            }else{
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap', '库区编码不能重复！', '');
            }
        }
    }
});
