$(function(){

    /*------------------------------------------变量--------------------------------------*/

    //存放列表所有数据
    var _allPersonalArr = [];

    //条件选择的下拉框
    getDepartment();

    //角色下拉框
    getRole();

    //新增用户登记对象
    var user = new Vue({
        el:'#user',
        data:{
            //用户名
            username:'',
            //工号
            jobnumber:'',
            //密码
            password:'123456',
            //确认密码
            confirmpassword:'123456',
            //职位
            position:'',
            //邮箱
            email:'',
            //电话
            fixedtelephone:'',
            //手机
            mobilephone:'',
            //拼音
            pinyin:'',
            //部门
            department:'',
            //角色
            role:'',
            //排序
            order:'',
            //备注
            remarks:''
        },
        methods:{
            keyUp:function(){
                if( user.password != user.confirmpassword ){
                    $('.confirmpassword').show().html('两次输入密码不一致！');
                    if( user.confirmpassword == '' ){
                        $('.confirmpassword').hide();
                    }
                }else{
                    $('.confirmpassword').hide();
                }
            },
            keyUpJob:function(){
                var existFlag = false;
                for(var i=0;i<_allPersonalArr.length;i++){
                    if(_allPersonalArr[i].userNum == user.jobnumber){
                        existFlag = true;
                    }
                }
                if(existFlag){
                    $('.jobNumberExists').show();
                }else{
                    $('.jobNumberExists').hide();
                }
            },
            naturalNumber:function(attr){

                var mny = /^\d+$/;

                var $this = $(this)[0][attr];

                var e = e||window.event;

                var error = $(e.srcElement).parents('li').find('.multiple-condition');

                if( $this == '' ){

                    error.show();

                }else{

                    if(mny.test($this)){

                        error.hide();

                    }else{

                        error.show();

                    }

                }


            }
        }
    });

    //验证必填项（非空）
    Vue.validator('notempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    /*------------------------------------------表格初始化---------------------------------*/

    var mainCol = [

        {
            title:'用户名',
            data:'userName'
        },
        {
            title:'工号',
            data:'userNum',
            className:'userNum'
        },
        {
            title:'部门',
            data:'departName'
        },
        {
            title:'角色',
            data:'roleName'
        },
        {
            title:'邮箱',
            data:'email'
        },
        {
            title:'手机',
            data:'mobile'
        },
        {
            title:'固定电话',
            data:'phone'
        },
        {
            title:'备注',
            data:'remark'
        },
        {
            title:'排序',
            data:'sort'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

        }

    ];

    _tableInit($('#personal-table'),mainCol,2,false,'','','','');

    conditionSelect();

    /*------------------------------------------按钮事件----------------------------------*/

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【重置】
    $('.resites').click(function(){

        //input 重置
        $('.condition-query').eq(0).find('input').val('');

        //select 重置
        $('.condition-query').eq(0).find('select').val('');

    })

    //【新增】
    $('.creatButton').click(function(){

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '新增');

        //是否可操作
        abledOption();

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').removeClass('shanchu').removeClass('bianji').addClass('dengji');

        //loadding隐藏
        $('#theLoading').modal('hide');
    })

    //表格【查看】
    $('#personal-table').on('click','.option-see',function(){

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'),'查看',true,'','','');

        //赋值
        bindData($(this));

        //是否可操作
        disabledOption();

        //loadding隐藏
        $('#theLoading').modal('hide');

    })

    //表格【编辑】
    $('#personal-table').on('click','.option-edit',function(){

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'),'编辑',false,'','','保存');

        //赋值
        bindData($(this));

        //是否可操作
        abledOption();

        //用户名工号和密码不能修改
        $('.not-edit').attr('disabled',true).addClass('disabled-block');

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').removeClass('shanchu').removeClass('dengji').addClass('bianji');

        //loadding隐藏
        $('#theLoading').modal('hide');

    })

    //表格【删除】
    $('#personal-table').on('click','.option-delete',function(){

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'),'确定要删除吗？',false,'','','删除');

        //赋值
        bindData($(this));

        //是否可操作
        disabledOption();

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').removeClass('bianji').removeClass('dengji').addClass('shanchu');

        //loadding隐藏
        $('#theLoading').modal('hide');

    })

    //登记【确定按钮】
    $('#myModal').on('click','.dengji',function(){

        buttonOption('RBAC/rbacAddUser',true,'新增成功！','新增失败！');

    })

    //编辑【确定按钮】
    $('#myModal').on('click','.bianji',function(){

        buttonOption('RBAC/rbacUptUser',true,'编辑成功！','编辑失败！');

    })

    //删除【确定按钮】
    $('#myModal').on('click','.shanchu',function(){

        buttonOption('RBAC/rbacDelUser',false,'删除成功！','删除失败！');

    })

    /*-------------------------------------------其他方法---------------------------------*/
    //条件选择
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            //用户名称
            "userName2":filterInput[0],
            //用户id
            "userNum":filterInput[1],
            //所属部门
            "departNum":$('#rybm').val(),
            //角色
            "roleNum":$('#ryjs').val(),
            //当前用户id
            "userID": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                _allPersonalArr = [];

                for(var i=0;i<result.length;i++){
                    _allPersonalArr.push(result[i]);
                }

                _jumpNow($('#personal-table'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取部门
    function getDepartment(){

        var prm = {
            "userID": _userIdNum
        }

        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            success:function(result){
                var str = '<option value="">全部</option>';

                var str1 = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].departNum + '">' + result[i].departName + '</option>';

                    str1 += '<option value="' + result[i].departNum + '">' + result[i].departName + '</option>'
                }

                //条件选择
                $('#rybm').empty().append(str);

                //新增模态框
                $('#djbm').empty().append(str1);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取角色
    function getRole(){
        var prm = {
            "userID": _userIdNum
        };
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetRoles',
            data:prm,
            success:function(result){
                var str = '<option value="">全部</option>';

                var str1 = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].roleNum + '">' + result[i].roleName + '</option>';

                    str1 += '<option value="' + result[i].roleNum + '">' + result[i].roleName + '</option>';
                }

                //条件选择
                $('#ryjs').empty().append(str);

                //新增模态框
                $('#jsbm').empty().append(str1);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //初始化
    function detailInit(){

        //用户名
        user.username = '';
        //工号
        user.jobnumber = '';
        //密码
        user.password = '123456';
        //确认密码
        user.confirmpassword = '123456';
        //职位
        user.position = '';
        //邮箱
        user.email = '';
        //电话
        user.fixedtelephone = '';
        //手机
        user.mobilephone = '';
        //拼音
        user.pinyin = '';
        //部门
        user.department = '';
        //角色
        user.role = '';
        //排序
        user.order = '';
        //备注
        user.remarks = '';

    }

    //可操作
    function abledOption(){

        $('#user').find('input').attr('disabled',false).removeClass('disabled-block');

        $('#user').find('select').attr('disabled',false).removeClass('disabled-block');

        $('#user').find('textarea').attr('disabled',false).removeClass('disabled-block');

    }

    //不可操作
    function disabledOption(){

        $('#user').find('input').attr('disabled',true).addClass('disabled-block');

        $('#user').find('select').attr('disabled',true).addClass('disabled-block');

        $('#user').find('textarea').attr('disabled',true).addClass('disabled-block');

    }

    //数据绑定
    function bindData(el){

        //样式
        $('#personal-table').find('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

        //确定编码
        var thisBM = el.parents('tr').children('.userNum').html();
        //根据工号绑定数据
        for(var i=0;i<_allPersonalArr.length;i++){

            if(_allPersonalArr[i].userNum == thisBM){

                //绑定数据
                //姓名
                user.username = _allPersonalArr[i].userName;
                //工号
                user.jobnumber = _allPersonalArr[i].userNum;
                //密码
                user.password = '';
                //确认密码
                user.confirmpassword = '';
                //职位
                user.position = _allPersonalArr[i].pos;
                //邮箱
                user.email = _allPersonalArr[i].email;
                //电话
                user.fixedtelephone = _allPersonalArr[i].phone;
                //手机
                user.mobilephone = _allPersonalArr[i].mobile;
                //拼音
                user.pinyin = _allPersonalArr[i].pinyin;
                //部门
                user.department = _allPersonalArr[i].departNum;
                //角色
                user.role = _allPersonalArr[i].roleNum;
                //排序
                user.order = _allPersonalArr[i].sort;
                //备注
                user.remarks = _allPersonalArr[i].remark;


            }
        }

    }

    //登记、编辑、删除、方法flag为真编辑、登记  为假删除
    function buttonOption(url,flag,successMeg,errorMeg){

        //首先验证非空
        if( user.username == '' || user.jobnumber == '' || user.department == '' ){

            _moTaiKuang($('#myModal2'), '提示', false, 'istap' ,'请填写红色必填项!', '');

        }else{

            //验证格式
            //两次密码是否一致
            var c = $('.confirmpassword').css('display');
            //排序格式
            var n = $('.numberType').css('display');
            //工号
            var g = $('.jobNumberExists').css('display');

            if(c == 'none' && n == 'none' && g == 'none'){

                if(flag){

                    var prm = {
                        //用户名
                        "userName2":user.username,
                        //工号
                        "userNum":user.jobnumber,
                        //密码
                        "password":user.password,
                        //职位
                        "pos":user.position,
                        //邮箱
                        "email":user.email,
                        //电话
                        "phone":user.fixedtelephone,
                        //手机
                        "mobile":user.mobilephone,
                        //拼音
                        "pinyin":user.pinyin,
                        //部门
                        "departNum":user.department,
                        //角色
                        "roleNum":user.role,
                        //排序
                        "sort":user.order,
                        //备注
                        "remark":user.remarks,
                        //用户id
                        "userID":_userIdNum
                    }

                }else{

                    var prm = {

                        //用户名
                        "userName2":user.username,
                        //工号
                        "userNum":user.jobnumber,
                        //用户id
                        "userID":_userIdNum
                    }

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
                    timeout:_theTimes,
                    success:function(result){

                        if(result == 99){

                            conditionSelect();

                            $('#myModal').modal('hide');

                            _moTaiKuang($('#myModal2'),'提示',true,'istap',successMeg,'');

                        }else{

                            _moTaiKuang($('#myModal2'),'提示',true,'istap',errorMeg,'');

                        }

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {

                        //清除loadding
                        $('#theLoading').modal('hide');

                        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                        }else{

                            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                        }

                    }

                })


            }else{

                _moTaiKuang($('#myModal2'), '提示', false, 'istap' ,'格式错误!', '');

            }

        }

    }

})