$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //存放选中的物品编码
    var _thisBianhao,_thisMingcheng;

    //登记列表vue信息
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            //分类编码
            'flbianma':'',
            //分类名称
            'flmingcheng':'',
            //物品编号
            'bianhao':'',
            //物品名称
            'mingcheng':'',
            //预警下限
            'xiaxian':'',
            //预警上限
            'shangxian':'',
            //单位
            'danwei':'',
            //是否耐用
            'picked':0,
            //是否返修
            'isfix':0,
            //规格
            'guige':'',
            //颜色
            'yanse':'',
            //主要供货商
            'gonghuoshang':'',
            //描述
            'miaoshu':'',
            //备注
            'beizhu':''
        },
        methods:{
            'radios':function(){
                $('.inpus').click(function(){
                    //单选框选中
                    $('.inpus').parent('span').removeClass('checked');

                    $(this).parent('span').addClass('checked');

                    //非耐用品一定是非返修件,耐用品可以是返修件也可以是非返修件
                    if($(this).attr('id') == 'twos'){

                        $('.isfix').parent('span').removeClass('checked');

                        $('#fours').parent('span').addClass('checked');

                        //并且不可修改
                        $('.isfix').attr('disabled',true);
                    }else{

                        $('.isfix').parent('span').removeClass('checked');

                        $('#fours').parent('span').addClass('checked');

                        //并且可修改
                        $('.isfix').attr('disabled',false);

                    }

                })
            },
            'fixFun':function(){

                $('.isfix').click(function(){

                    $('.isfix').parent('span').removeClass('checked');

                    $(this).parent('span').addClass('checked');
                })
            },
            'keyword':function(){

                var arr = [];

                //显示提示消息

                for(var i=0;i<_wpBMArr.length;i++){

                    arr.push(_wpBMArr[i].itemNum);

                }

                if(arr.indexOf(myApp33.bianhao)>=0){

                    $('.error1').show();

                }else{

                    $('.error1').hide();

                }

                //显示列表
                var seacherValue = myApp33.bianhao;

                var aboutArr = [];

                var isonly = false;

                //完全相同的情况下，红色加粗提示，否则就是普通列出
                for(var i=0;i<_wpBMArr.length;i++){

                    if(_wpBMArr[i].itemNum == seacherValue){

                        isonly = true;

                        aboutArr.push(_wpBMArr[i]);

                    }else{

                        if(_wpBMArr[i].itemNum.indexOf(seacherValue)>=0){

                            aboutArr.push(_wpBMArr[i]);

                        }

                    }

                }


                //将数组放入列表中
                if(isonly){

                    wpList(aboutArr,true);

                }else{

                    wpList(aboutArr,false);

                }

                if(aboutArr.length != 0){

                    $('.accord-with-list').show();

                }else{

                    $('.accord-with-list').hide();

                }

            },
            'clickword':function(e){

                var e = event || window.event;

                e.stopPropagation();

                var lengths = $('.accord-with-list').children().length;

                if(lengths != 0){

                    $('.accord-with-list').show();

                }else{

                    $('.accord-with-list').hide();
                }

            },
            'focusword':function(){

                $('.accord-with-list').show();

            }
        }
    });

    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    })

    //存放当前列表的数据
    var allData = [];

    //存放选中当前选中的物品分类
    var _$thisFL = '';

    //存放所有物品分类的数组
    var _elArr = [];

    //编码去重数组
    var _wpBMArr = [];

    wpBM();

    /*-------------------------------------表格初始化------------------------------*/
    var col = [
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
            title:'预警下限',
            data:'minNum'
        },
        {
            title:'预警上限',
            data:'maxNum'
        },
        {
            title:'单位',
            data:'unitName'
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
            title:'分类名称',
            data:'cateName'
        },
        {
            title:'规格',
            data:'size'
        },
        {
            title:'主要供货商',
            data:'cusName'
        },
        {
            title:'备注',
            data:'remark'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class='fa fa-edit'></i>编辑</span><span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"
        }
    ];
    _tableInit($('#scrap-datatables'),col,'1','flag','','');

    //表格数据加载
    conditionSelect();

    //分类编码表格
    var col1 = [
        {
            title:'分类编码',
            data:'cateNum',
            className:'cateNum'
        },
        {
            title:'分类名称',
            data:'cateName'
        }
    ];

    _tableInit($('#wuPinListTable'),col1,2,false,'','');

    wpClass(true);

    /*-------------------------------------按钮事件-------------------------------*/
    //新增按钮
    $('.creatButton').on('click',function(){
        //确定按钮去掉修改类，添加登记类
        $('#myModal').find('.btn-primary').removeClass('xiugai').addClass('dengji');
        //初始化
        detailInit();
        //模态框
        _moTaiKuang($('#myModal'), '添加', '', '' ,'', '添加');
        //编码不能修改
        $('.shishi').attr('disabled',false).removeClass('disabled-block');
    })

    //登记按钮；
    $('#myModal').on('click','.dengji',function(){

        var o = $('.error1').css('display');

        if(myApp33.bianhao == ''|| myApp33.mingcheng == '' || myApp33.flbianma == '' || myApp33.flmingcheng == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');

        }else{

            if(o == 'none'){

                //获取填写数据
                var prm ={
                    'ItemNum':myApp33.bianhao,
                    'ItemName':myApp33.mingcheng,
                    'MinNum':myApp33.xiaxian,
                    'MaxNum':myApp33.shangxian,
                    'UnitName':myApp33.danwei,
                    'CateNum':myApp33.flbianma,
                    'CateName':myApp33.flmingcheng,
                    'Size':myApp33.guige,
                    'Color':myApp33.yanse,
                    'Description':myApp33.miaoshu,
                    'CusName':myApp33.gonghuoshang,
                    'remark':myApp33.beizhu,
                    userID:_userIdNum,
                    userName:_userIdName,
                    b_UserRole:_userRole,
                    'isSpare':myApp33.picked,
                    //是否为返修件
                    'isFX':myApp33.isfix
                }
                $.ajax({
                    type:'post',
                    url:_urls + 'YWCK/ywCKAddItem',
                    data:prm,
                    beforeSend: function () {
                        $('#theLoading').modal('show');
                    },
                    complete: function () {
                        $('#theLoading').modal('hide');
                    },
                    success:function(result){
                        if(result == 99){

                            //成功后刷新列表，并且提示添加成功；
                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'添加成功!', '');

                            conditionSelect();

                            $('#myModal').modal('hide');

                        }else{

                            //成功后刷新列表，并且提示添加成功；
                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'添加失败!', '');

                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'物品编码已存在!', '');

            }


        }

    })

    //重置按钮
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
    });

    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    });

    //修改弹窗确认按钮
    $('#myModal').on('click','.xiugai',function(){
        if(myApp33.mingcheng == '' || myApp33.flbianma == '' || myApp33.flmingcheng == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{
            var prm = {
                'ItemNum':myApp33.bianhao,
                'ItemName':myApp33.mingcheng,
                'MinNum':myApp33.xiaxian,
                'MaxNum':myApp33.shangxian,
                'UnitName':myApp33.danwei,
                'CateNum':myApp33.flbianma,
                'CateName':myApp33.flmingcheng,
                'Size':myApp33.guige,
                'Color':myApp33.yanse,
                'Description':myApp33.miaoshu,
                'CusName':myApp33.gonghuoshang,
                'remark':myApp33.beizhu,
                userID:_userIdNum,
                userName:_userIdName,
                b_UserRole:_userRole,
                'isSpare':myApp33.picked,
                //是否为返修件
                'isFX':myApp33.isfix
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKEditItem',
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success:function(result){

                    if(result == 99){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'修改成功！', '');

                        //刷新列表
                        conditionSelect();

                        $('#myModal').modal('hide');

                    }else{

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'修改失败！', '');

                    }
                },
                error:function(jqXHR, textStatus, errorThrown){

                    console.log(jqXHR.responseText);

                }
            })
        }
    })

    //修改td操作按钮
    $('#scrap-datatables tbody')
        .on('click','.option-edit',function(){

            //loadding
            $('#theLoading').modal('show');

            //初始化
            detailInit();

            //类
            $('#myModal').find('.btn-primary').removeClass('dengji').addClass('xiugai');

            //样式
            var $this = $(this).parents('tr');

            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

            $this.addClass('tables-hover');

            //首先绑定原有的信息
            var wlBianMa = $(this).parents('tr').find('.bianma').html();

            var wlMingCheng = $(this).parents('tr').find('.mingcheng').html();

            var prm = {
                'ItemNum':wlBianMa,
                'itemName':wlMingCheng,
                userID:_userIdNum,
                userName:_userIdName,
                b_UserRole:_userRole,
            }

            $.ajax({

                type:'post',
                url:_urls + 'YWCK/ywCKGetItems',
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                timeout:_theTimes,
                success:function(result){

                    if(result){

                        //绑定数据
                        //分类编码
                        myApp33.flbianma = result[0].cateName;
                        //分类名称
                        myApp33.flmingcheng = result[0].cateNum;
                        //物品编号
                        myApp33.bianhao = result[0].itemNum;
                        //物品名称
                        myApp33.mingcheng = result[0].itemName;
                        //预警下限
                        myApp33.xiaxian = result[0].minNum;
                        //预警上限
                        myApp33.shangxian = result[0].maxNum;
                        //单位
                        myApp33.danwei = result[0].unitName;
                        //是否耐用
                        myApp33.picked = result[0].isSpare;
                        //是否返修
                        myApp33.isfix = result[0].isFX;
                        //规格
                        myApp33.guige =result[0].size;
                        //颜色
                        myApp33.yanse = result[0].color;
                        //主要供货商
                        myApp33.gonghuoshang = result[0].cusName;
                        //描述
                        myApp33.miaoshu = result[0].description;
                        //备注
                        myApp33.beizhu = result[0].remark;
                        //是否耐用
                        $('.inpus').parent().removeClass('checked');

                        if( myApp33.picked == 1 ){

                            $('#ones').parent().addClass('checked');

                        }else{

                            $('#twos').parent().addClass('checked');

                        }
                        //是否返修
                        $('.isfix').parent().removeClass('checked');

                        if( myApp33.isfix == 1 ){

                            $('#threes').parent().addClass('checked');

                        }else{

                            $('#fours').parent().addClass('checked');

                        }

                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    $('#theLoading').modal('hide');

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        myAlter("超时");
                    }else{
                        myAlter("请求失败！");
                    }

                }

            })

            _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');

            //编码不能修改
            $('.shishi').attr('disabled',true).addClass('disabled-block');

            $('#theLoading').modal('hide');
        });

    //删除弹窗确认按钮
    $('#scrap-datatables tbody')
        //删除td操作按钮
        .on('click','.option-delete',function(){

            //初始化
            //物品编码
            $('#wpbm').val('');
            //物品名称
            $('#wpmc').val('');
            //分类名称
            $('#flmc').val('');
            //分类编码
            $('#flbm').val('');

            //loadding显示
            $('#theLoading').modal('show');
            //样式
            var $this = $(this).parents('tr');

            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

            $this.addClass('tables-hover');

            //绑定数据
            var wlBianMa = $(this).parents('tr').find('.bianma').html();

            var wlMingCheng = $(this).parents('tr').find('.mingcheng').html();

            _thisBianhao = wlBianMa;

            _thisMingcheng = wlMingCheng;

            for(var i = 0;i<allData.length;i++){
                if(allData[i].itemNum == wlBianMa && allData[i].itemName == wlMingCheng){
                    //绑定信息
                    $('#wpbm').val(allData[i].itemNum);
                    $('#wpmc').val(allData[i].itemName);
                    $('#flbm').val(allData[i].cateNum);
                    $('#flmc').val(allData[i].cateName);
                    _moTaiKuang($('#myModal3'), '确定要删除吗？', '', '' ,'', '删除');
                }
            }

            $('#theLoading').modal('hide');

        })

    $('#myModal3').on('click','.shanchu',function(){
        var prm = {
            'ItemNum':_thisBianhao,
            'ItemName':_thisMingcheng,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKDelItem',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                if(result == 99){
                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除成功！', '');
                    conditionSelect();
                }else{
                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除失败！', '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })

    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });

    //选择物品编码和名称
    $('#wuPinListTable tbody').on('click','tr',function(){
        var $this = $(this);
        $('#wuPinListTable tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        _$thisFL = $this.children('.cateNum').html();
    })

    //选择物品编码确定按钮
    $('#myModal4').find('.btn-primary').click(function(){

        for(var i=0;i<_elArr.length;i++){

            if(_elArr[i].cateNum == _$thisFL){

                myApp33.flbianma = _elArr[i].cateNum;

                myApp33.flmingcheng = _elArr[i].cateName;

            }
        }

        //将分类编码格式化后自动填入物品编码

        myApp33.bianhao = myApp33.flbianma;

    })

    //点击其他地方，下拉列表消失
    $(document).click(function(){

        $('.accord-with-list').hide();


    })

    //物品编码条件选择
    $('#myModal4').find('.condition-query').on('click','button',function(){

        wpClass();

    })

    //选择物品分类
    $('#selectClass').click(function(){

        //初始化
        $('#myModal4').find('.condition-query').find('input').val('');

        _datasTable($('#wuPinListTable'),_elArr);

        //模态框
        _moTaiKuang($('#myModal4'), '分类编码选择', '', '' ,'', '选择');

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
        var prm = {
            'ItemNum':filterInput[0],
            'itemName':filterInput[1],
            'cateName':filterInput[2],
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                allData = [];

                for(var i=0;i<result.length;i++){
                    allData.push(result[i])
                }

                _jumpNow($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //物品列表生成
    function wpList(arr,flag){

        var str = ''

        if(flag){

            for(var i=0;i<arr.length;i++){

                str += '<li class="colorTip"><span style="margin-right: 20px;">' + arr[i].itemNum +
                    '</span><span>' + arr[i].itemName +
                    '</span></li>'

            }

        }else{

            for(var i=0;i<arr.length;i++){

                if(arr[i].isDelete == 1){

                    str += '<li style="color: #CCCCCC"><span style="margin-right: 20px;">' + arr[i].itemNum +
                        '</span><span>' + arr[i].itemName +
                        '</span></li>'

                }else{

                    str += '<li><span style="margin-right: 20px;">' + arr[i].itemNum +
                        '</span><span>' + arr[i].itemName +
                        '</span></li>'

                }


            }

        }

        $('.accord-with-list').empty().append(str);

    }

    //物品类别
    function wpClass(flag){

        $.ajax({

            type:'post',
            url:_urls + 'YWCK/ywCKGetItemCate',
            timeout:_theTimes,
            data:{

                //分类编码
                cateNum:$('#myModal4').find('.condition-query').find('input').eq(0).val(),
                //分类名称
                cateName:$('#myModal4').find('.condition-query').find('input').eq(1).val(),
                //用户id
                userID:_userIdNum,
                //用户名
                userName:_userIdName,
                //角色
                b_UserRole:_userRole

            },
            success:function(result){

                if(flag){

                    _elArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _elArr.push(result[i]);

                    }
                }

                _datasTable($('#wuPinListTable'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //物品编码
    function wpBM(){

        $.ajax({

            type:'post',
            url:_urls + 'YWCK/ywCKGetAllItemNums',
            data:{
                //用户id
                "userID": _userIdNum,
                "userName": _userIdName,
                "b_UserRole": _userRole,
                "b_DepartNum": _loginUser.departNum
            },
            timeout:_theTimes,
            success:function(result){

                _wpBMArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _wpBMArr.push(result[i]);

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //模态框初始化
    function detailInit(){

        //分类编码
        myApp33.flbianma = '';
        //分类名称
        myApp33.flmingcheng = '';
        //物品编号
        myApp33.bianhao = '';
        //物品名称
        myApp33.mingcheng = '';
        //预警下限
        myApp33.xiaxian = '';
        //预警上限
        myApp33.shangxian = '';
        //单位
        myApp33.danwei = '';
        //是否耐用
        myApp33.picked = 0;
        //是否返修
        myApp33.isfix = 0;
        //规格
        myApp33.guige ='';
        //颜色
        myApp33.yanse = '';
        //主要供货商
        myApp33.gonghuoshang = '';
        //描述
        myApp33.miaoshu = '';
        //备注
        myApp33.beizhu = '';
        //单选框
        //是否耐用
        $('.inpus').parent().removeClass('checked');
        //否
        $('#twos').parent().addClass('checked');
        //是否返修
        $('.isfix').parent().removeClass('checked');
        //否
        $('#fours').parent().addClass('checked');
        //需要默认点一下，因为单选点击事件
        $('#twos').click();

        $('#fours').click();
    }

    /*----------------------------打印部分去掉的东西-----------------------------*/

    //导出按钮,每页显示数据条数,表格页码打印隐藏

    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})