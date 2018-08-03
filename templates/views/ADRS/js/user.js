var User = function () {

    //记录当前选中的userId
    var _thisID = '';

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[
        {
            title:'账户角色',
            data:'roleName',
            name:'roleName'
        },
        {
            title:'登录账户',
            data:'sysuserId',
            className:'sysuserId'
        },
        {
            title:'登录账户名称',
            data:'userName'
        },
        {
            title:'创建时间',
            data:'createDate'
        },
        {
            title:'描述',
            data:'memo'
        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='option-edit option-button' data-userId='" + full.userId + "'>编辑</span>"

            }
        },
    ]

    $('#table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": true,
        "bProcessing":true,
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
        "dom":'t<"F"lip>',
        'buttons':{
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        },
        "columns": col,

        "rowsGroup": [
            'roleName:name',
            0,
            1
        ],
        "aoColumnDefs": [ { "orderable": false, "targets": [ 1,2,3,4,5] }]
    });

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //登录账户名(不能是中文)
            'create-user-name':{

                required: true,

                NonChinese:true

            },
            //登录密码
            'create-user-passW':{

                required: true,

                minlength: 6

            },
            //账户名称
            'create-user-login-name':'required'

        },
        messages:{

            //登录账户名
            'create-user-name':{

                required: '请输入登录账户名'

            },
            //登录密码
            'create-user-passW':{

                required: '请输入登录密码',

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
        //账户登录名不能操作
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

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                var arr = [];

                if(result.code == -2){

                    _topTipBar('暂时没有账户数据');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == 0){

                    $('#tip').hide();

                    arr = result.users

                }

                _datasTable($('#table'),arr)

            },

            error:_errorBar

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

        //验证消息要隐藏
        var error = $('#create-Modal').find('.error');

        for(var i=0;i<error.length;i++){

            if(error[i].nodeName == 'LABEL'){

                error.eq(i).hide();

            }else{

                error.eq(i).removeClass('error');

            }

        }

        //提示消息隐藏
        $('#create-Modal').find('#tip-error-modal').hide();

    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#create-user-name').val() == '' || $('#create-user-login-name').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项','');

        }else{

            //验证错误
            var error = $('#create-Modal').find('.error');

            if(error.length != 0){

                if(error.css('display') != 'none'){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式','');

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

                if(result.code == 0){

                    //模态框消失
                    $('#create-Modal').modal('hide');

                    $('#create-Modal').one('hidden.bs.modal',function(){

                        conditionSelect();

                    })

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

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
                    //登录账户名
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

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }
            },
            error:_errorFun

        })

    }

    return {
        init: function () {

            //获取账户列表
            conditionSelect();

        }
    }

}()