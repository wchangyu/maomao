var User = function () {

    //条件刷新标识
    var _isReloadData = false;

    //记录当前选中的userId
    var _thisID = '';

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[

        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

               return  "<span class='data-option option-edit btn default btn-xs green-stripe' data-userId='" + full.userId + "'>编辑</span>"

                   //"<span class='data-option option-shanchu btn default btn-xs green-stripe' data-userId='" + full.userId + "'>删除</span>"

            }
        },
        {
            title:'账户ID',
            data:'sysuserId',
            className:'sysuserId'
        },
        {
            title:'登陆账户名',
            data:'userName'
        },
        {
            title:'账户角色',
            data:'roleName'
        },
        //{
        //    title:'是否有效',
        //    data:'isDelName'
        //},
        {
            title:'创建时间',
            data:'createDate'
        },
        {
            title:'描述',
            data:'memo'
        }

    ]

    _tableInit($('#table'),col,2,true,'','','','');

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //登陆账户名(不能是中文)
            'create-user-name':{

                required: true,

                NonChinese:true

            },
            //登陆密码
            'create-user-passW':{

                required: true,

                minlength: 6

            },
            //账户名称
            'create-user-login-name':'required'

        },
        messages:{

            //登陆账户名
            'create-user-name':{

                required: '请输入登陆账户名'

            },
            //登陆密码
            'create-user-passW':{

                required: '请输入登陆密码',

                minlength: '密码长度不能小于 6 位'

            },
            //账户名称
            'create-user-login-name':'请输入账户名'

        }

    })

    //正则表达式（账户名不能是中文）
    $.validator.addMethod("NonChinese",function(value,element,params){

        var doubles= /([a-zA-Z0-9]*[a-zA-Z][a-zA-Z0-9]*)/;

        return this.optional(element)||(doubles.test(value));

    },"请使用英文加数字格式");


    /*-----------------------------------按钮事件----------------------------------------*/

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【创建账户】
    $('#creatUser').click(function(){

        //loadding
        $('#theLoading').modal('show');

        //初始化
        createInit();

        //模态框
        _moTaiKuang($('#create-Modal'), '提示', false, '' ,'', '创建');

        //loadding
        $('#theLoading').modal('hide');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可编辑（都可编辑）
        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        //密码显示
        $('.password-block').show();


    })

    //创建账户【确定按钮】
    $('#create-Modal').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRUser/CreateDRUserInfo','创建成功！');

        })
    })

    //【编辑】
    $('#table tbody').on('click','.option-edit',function(){

        $('#theLoading').modal('show');

        //样式
        changeCss($(this));

        //初始化
        createInit();

        //获取当前的账户id
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#create-Modal'), '提示', false, '' ,'', '保存');

        //绑定数据
        bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //是否可操作
        //账户登陆名不能操作
        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        $('#create-user-name').attr('disabled',true);

        //密码不显示
        $('.password-block').hide();

    })

    //编辑【确定】
    $('#create-Modal').on('click','.bianji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRUser/ModifyDRUserInfo','编辑成功！',true);

        })

    })

    //【删除】
    $('#table tbody').on('click','.option-shanchu',function(){

        $('#theLoading').modal('show');

        //样式
        changeCss($(this));

        //初始化
        createInit();

        //获取当前的账户id
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#create-Modal'), '确定要删除吗？', false, '' ,'', '删除');

        //绑定数据
        bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //是否可操作
        //账户登陆名不能操作
        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        //密码不显示
        $('.password-block').hide();

    })

    //删除【确定】
    $('#create-Modal').on('click','.shanchu',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            var prm = {

                UserId:_thisID

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DRUser/LogicDelDRUser',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    //重载数据标识
                    _isReloadData = true;

                    if(result.code == 0){

                        //创建成功
                        _moTaiKuang($('#tip-Modal'),'提示',true,true,'删除成功！','');

                        //模态框消失
                        $('#create-Modal').modal('hide');


                    }else if(result.code == -2){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                    }

                },

                error:_errorFun

            })


        })

    })

    /*----------------------------------其他方法-----------------------------------------*/


    //获取账户列表
    function conditionSelect(){

        $('#theLoading').modal('show');

        var  prm = {

            //角色
            role:$('#role').val(),

            //是否有效
            isdel:2
            //isdel:$('#effective').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRUser/GetDRUserDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                   _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }else if(result.code == 0){

                    arr = result.users;

                }

                _jumpNow($('#table'),arr);


            },

            error:_errorFun

        })


    }

    //创建账户初始化
    function createInit(){

        //清空
        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val(1);

        $('#create-Modal').find('textarea').val('');

        //记录当前选中的userId
        _thisID = '';

    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#create-user-name').val() == '' || $('#create-user-login-name').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项!','');

        }else{

            //验证错误
            var error = $('#create-Modal').find('.error');

            if(error.length != 0){

                if(error.css('display') != 'none'){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式!','');

                }else{

                    //验证通过
                    fun();

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //创建账户(flag代表是否传id)
    function sendOption(url,seccessMeg,flag){

        var prm = {

            //账户名称
            userName:$('#create-user-login-name').val(),
            //账户角色
            userRole:$('#create-user-role').val(),
            //备注
            memo:$('#create-remark').val()

        };

        if(flag){

            prm.id = _thisID;

        }else{

            //账户登录名 ,
            prm.sysuserId = $('#create-user-name').val();
            //账户密码
            prm.sysuserPass = $('#create-user-passW').val();

        }


        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                //重载数据标识
                _isReloadData = true;

                if(result.code == 0){

                    //创建成功
                    _moTaiKuang($('#tip-Modal'),'提示',true,true,seccessMeg,'');

                    //模态框消失
                    $('#create-Modal').modal('hide');

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }

            },

            error:_errorFun


        })

    }

    //样式
    function changeCss(el){

        $('.table tbody').find('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

    }

    //绑定数据
    function bind(id){

        var prm = {

            userId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRUser/GetDRUserById',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //绑定数据
                    //登陆账户名
                    $("#create-user-login-name").val(result.user.userName);
                    //账户名
                    $('#create-user-name').val(result.user.sysuserId);
                    //密码
                    $('#create-user-passW').val('123456');
                    //角色
                    $('#create-user-role').val(result.user.userRole);
                    //备注
                    $('#create-remark').val(result.user.memo);

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }

            }

        })

    }

    //提示关闭之后，再刷新数据
    $('#tip-Modal').on('hidden.bs.modal',function(){

        if(_isReloadData){

            conditionSelect();

        }

        //标识重置
        _isReloadData = false;

    })

    return {
        init: function () {

            //获取账户列表
            conditionSelect();

        }
    }

}()