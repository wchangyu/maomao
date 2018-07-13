﻿var Epr = function () {

    //条件刷新标识
    var _isReloadData = false;

    //记录当前选中的userId
    var _thisID = '';

    //创建大用户的时候，记录聚合商id
    var _JHID = '';

    //存放用户所有数据
    var YHArr = [];

    //获取用户数据
    YHData(true);

    //存放户号所有数据
    var HHArr = [];

    //获取户号数据
    HHData(true);

    //记录当前选中的用户id
    var _thisYHID = '';

    //记录当前选中的户号
    var _thisHHArr = [];

    //当前选中的企业类型
    var _thisType = '';

    /*-----------------------------------表格初始化-------------------------------------*/

    //主表格
    var col=[
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='data-option option-edit btn default btn-xs green-stripe' data-userId='" + full.eprId + "'>编辑</span>" +

                    "<span class='data-option option-shanchu btn default btn-xs green-stripe' data-userId='" + full.eprId + "'>删除</span>" +

                    "<span class='data-option option-yonghu btn default btn-xs green-stripe' data-userId='" + full.eprId + "'>绑定用户</span>" +

                    "<span class='data-option option-huhao btn default btn-xs green-stripe' data-userId='" + full.eprId + "' data-type='" + full.eprType +"'>绑定户号</span>"

            }
        },
        {
            title:'标识',
            data:'eprId'
        },
        {
            title:'编码',
            data:'eprCode'
        },
        {
            title:'名称',
            data:'eprName'
        },
        {
            title:'签署容量（kW）',
            data:'signatureVolume'
        },
        {
            title:'类型',
            data:'eprTypeName'
        },
        {
            title:'所属用户',
            data:''
        },
        {
            title:'绑定户号',
            data:''
        },
        {
            title:'地址',
            data:'address'
        },
        {
            title:'联系人',
            data:'linkMan'
        },
        {
            title:'联系方式',
            data:'phone'
        },
        {
            title:'邮箱',
            data:'eMail'
        },
        {
            title:'行业机构',
            data:'agencyTypeName'
        },
        {
            title:'是否有效',
            data:'isDelName'
        },
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

    //选择聚合商表格
    var JHCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'标识',
            data:'eprId',
            className:'modal-eprId'
        },
        {
            title:'编码',
            data:'eprCode'
        },
        {
            title:'名称',
            data:'eprName'
        },
        {
            title:'签署容量（kW）',
            data:'signatureVolume'
        },
        {
            title:'地址',
            data:'address'
        },
        {
            title:'联系人',
            data:'linkMan'
        },
        {
            title:'联系方式',
            data:'phone'
        },
        {
            title:'邮箱',
            data:'eMail'
        },
        {
            title:'行业机构',
            data:'agencyTypeName'
        },
        {
            title:'是否有效',
            data:'isDelName'
        },
        {
            title:'创建时间',
            data:'createDate'
        },
        {
            title:'描述',
            data:'memo'
        }

    ]

    _tableInit($('#JH-table'),JHCol,2,true,'','','','',10);

    //用户表格
    var YHCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.userId +'"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'用户ID',
            data:'sysuserId',
            className:'sysuserId'
        },
        {
            title:'登陆用户名',
            data:'userName'
        },
        {
            title:'用户角色',
            data:'roleName'
        },
        {
            title:'是否有效',
            data:'isDelName'
        },
        {
            title:'创建时间',
            data:'createDate'
        },
        {
            title:'描述',
            data:'memo'
        }

    ]

    _tableInit($('#YH-table'),YHCol,2,true,'','','','',10);

    //户号表格
    var HHCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.accountId +'"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'户号',
            data:'accountCode'
        },
        {
            title:'户号名称',
            data:'accountName'
        },
        {
            title:'所属区域',
            data:'districtName'
        },
        {
            title:'是否有效',
            data:'isDelName'
        },
        {
            title:'创建时间',
            data:'createDate'
        },
        {
            title:'备注',
            data:'memo'
        }

    ]

    _tableInit($('#HH-table'),HHCol,2,true,'','','','',10);

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //编码
            'encoded-J':'required',
            //名称
            'name-J':'required',
            //签署容量（kW）
            'capacity-J':{

                required:true,

                numberFormat:true

            },
            //地址
            'address-J':'required',
            //联系人名称
            'contact-name-J':'required',
            //联系人方式
            'contact-mode-J':{

                required:true,

                numberFormat:true

            },
            //邮箱
            'mailbox-J':{

                required:true,

                emailFormat:true

            }

        },
        messages:{

            //编码
            'encoded-J':{

                required:'请输入编码'

            },
            //名称
            'name-J':{

                required:'请输入名称'

            },
            //签署容量（kW）
            'capacity-J':{

                required:'请输入签署容量（kW）'

            },
            //地址
            'address-J':{

                required:'请输入地址'

            },
            //联系人名称
            'contact-name-J':{

                required:'请输入联系人名称'

            },
            //联系人方式
            'contact-mode-J':{

                required:'请输入联系人方式'

            },
            //邮箱
            'mailbox-J':{

                required:'请输入邮箱'

            }

        }

    })

    //正则表达式（补贴价格只能是数字）
    $.validator.addMethod("numberFormat",function(value,element,params){

        var doubles= /^\d+(\.\d+)?$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入数字格式");

    //正则表达式（邮箱）
    $.validator.addMethod("emailFormat",function(value,element,params){

        var doubles= /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入邮箱格式");

    /*-----------------------------------按钮事件---------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //【创建聚合商】
    $('#creatUserS').click(function(){

        //loadding
        $('#theLoading').modal('show');

        //初始化
        createInitJ();

        //模态框
        _moTaiKuang($('#create-Modal-J'), '提示', false, '' ,'', '创建');

        //loadding
        $('#theLoading').modal('hide');

        //类
        $('#create-Modal-J').find('.btn-primary').removeClass('bianji').removeClass('shanchu').removeClass('dengjiD').addClass('dengjiJ');

        //是否可编辑（都可编辑）
        $('#create-Modal-J').find('input').attr('disabled',false);

        $('#create-Modal-J').find('select').attr('disabled',false);

        $('#create-Modal-J').find('textarea').attr('disabled',false);

        //隐藏是否派生于聚合商
        $('.JH-button').hide();

    })

    //【创建大用户】
    $('#creatUserD').click(function(){

        //loadding
        $('#theLoading').modal('show');

        //初始化
        createInitJ();

        //模态框
        _moTaiKuang($('#create-Modal-J'), '提示', false, '' ,'', '创建');

        //loadding
        $('#theLoading').modal('hide');

        //类
        $('#create-Modal-J').find('.btn-primary').removeClass('bianji').removeClass('shanchu').removeClass('dengjiJ').addClass('dengjiD');

        //是否可编辑（都可编辑）
        $('#create-Modal-J').find('input').attr('disabled',false);

        $('#create-Modal-J').find('select').attr('disabled',false);

        $('#create-Modal-J').find('textarea').attr('disabled',false);

        //隐藏是否派生于聚合商
        $('.JH-button').show();

    })

    //创建聚合商【确定按钮】
    $('#create-Modal-J').on('click','.dengjiJ',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DREpr/CreateDREprInfoByAggregator','创建聚合商成功！');

        })
    })

    //创建大用户【确定按钮】
    $('#create-Modal-J').on('click','.dengjiD',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DREpr/CreateDREprInfoByConsumer','创建大用户成功！',false,true);

        })
    })

    //【删除】
    $('#table tbody').on('click','.option-shanchu',function(){

        $('#theLoading').modal('show');

        //样式
        changeCss($(this));

        //获取当前的用户id
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#del-Modal'), '提示', false, true ,'确定要删除吗？', '删除');

        $('#theLoading').modal('hide');

    })

    //删除【确定】按钮
    $('#del-Modal').on('click','.btn-primary',function(){

        $('#theLoading').modal('show');

        var prm = {

            eprId:_thisID

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DREpr/LogicDelDREprInfo',

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
                    $('#del-Modal').modal('hide');

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

    })

    //【绑定用户】
    $('#table tbody').on('click','.option-yonghu',function(){

        //初始化
        $('#keyWord-YH').val('');

        //赋值
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#select-YH-Modal'),'用户','','','','选择');

        //数据
        _datasTable($('#YH-table'),YHArr);

    })

    //用户选择【tr】
    $('#YH-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#YH-table tbody').find('tr').removeClass('tables-hover');

            $('#YH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#YH-table tbody').find('tr').removeClass('tables-hover');

            $('#YH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //确定选中的用户id
    $('#select-YH-Modal').on('click','.btn-primary',function(){

        $('#theLoading').modal('show');

        var selectedTr = $('#YH-table tbody').find('.tables-hover');

        //给id赋值
        _thisYHID = selectedTr.find('.checker').attr('data-id');

        //模态框
        $('#select-YH-Modal').modal('hide');

        //发送请求
        var prm = {

            //企业及居民id
            eprId:_thisID,
            //用户登录账户Id
            userId:_thisYHID

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DREpr/CreateEprBindUserBySelect',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                _isReloadData = true;

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }else if(result.code == 0){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'绑定用户成功！', '');

                }

            },

            error:_errorFun

        })


    })

    //条件选择-用户【查询】
    $('#selected-user-modal').click(function(){

        //数据
        YHData();

    })

    //【绑定户号】
    $('#table tbody').on('click','.option-huhao',function(){

        //初始化
        $('#keyWord-HH').val('');

        //赋值
        _thisID = $(this).attr('data-userid');

        //企业类型
        _thisType = $(this).attr('data-type');

        //模态框
        _moTaiKuang($('#select-HH-Modal'),'用户','','','','选择');

        //数据
        _datasTable($('#HH-table'),HHArr);

    })

    //户号选择【tr】
    $('#HH-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //确定选中的户号id
    $('#select-HH-Modal').on('click','.btn-primary',function(){

        var selectedTr = $('#HH-table tbody').find('.tables-hover');

        _thisHHArr.length = 0;

        //给id赋值

        for(var i=0;i<selectedTr.length;i++){

            _thisHHArr.push(selectedTr.eq(i).find('.checker').attr('data-id'))

        }

        //模态框
        $('#select-HH-Modal').modal('hide');

        //发送请求
        var prm = {

            //企业及居民id
            eprId:_thisID,
            //用户登录账户Id
            acctIds:_thisHHArr,
            //企业及居民类型
            eprType:_thisType

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DREpr/CreateEprBindUserBySelect',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                _isReloadData = true;

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }else if(result.code == 0){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'绑定用户成功！', '');

                }

            },

            error:_errorFun

        })



    })

    //提示关闭之后，再刷新数据
    $('#tip-Modal').on('hidden.bs.modal',function(){

        if(_isReloadData){

            conditionSelect();

        }

        //标识重置
        _isReloadData = false;

    })

    //选择聚合商按钮
    $('.modal-button').click(function(){

        //初始化
        //行业选择
        $('#industry-type-modal').val(0);
        //是否有效
        $('#valuation-method-modal').val(2);

        //模态框
        _moTaiKuang($('#select-JH-Modal'),'聚合商列表',false,false,false,'选择')

        //获取数据
        JHlist();

    })

    //模态框-条件查询选择
    $('#selected-modal').click(function(){

        JHlist();

    })

    //模态框-选择聚合商
    $('#JH-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#JH-table tbody').find('tr').removeClass('tables-hover');

            $('#JH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#JH-table tbody').find('tr').removeClass('tables-hover');

            $('#JH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //确定选择的聚合商id
    $('#select-JH-Modal').on('click','.btn-primary',function(){

        _JHID = $('.tables-hover').find('.modal-eprId').html();

        //模态框消失
        $('#select-JH-Modal').modal('hide');

    })

    /*-------------------------------------其他方法-----------------------------------------*/

    //获取所有产品
    function conditionSelect(){

        $('#theLoading').modal('show');

        var prm = {

            //行业选择
            agency:$('#industry-type').val(),
            //企业及居民类型
            eprtype:$('#people-type').val(),
            //是否有效
            isdel:$('#valuation-method').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DREpr/GetDREprDs',

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

                    arr = result.eprs

                }

                _jumpNow($('#table'),arr);

            },

            error:_errorFun

        })


    }

    //聚合商初始化
    function createInitJ(){

        //清空
        $('#create-Modal-J').find('input').val('');

        $('#create-Modal-J').find('select').val(1);

        $('#create-Modal-J').find('textarea').val('');

        //复选框
        $('.JH-button').find('input').parent('span').removeClass('checked');

        _thisID = '';

        _JHID = '';

        //选中的用户id
        _thisYHID = '';

        //选中的户号数组
        _thisHHArr = [];

    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#encoded-J').val() == '' || $('#name-J').val() == '' || $('#capacity-J').val() == '' || $('#address-J').val() == ''|| $('#contact-name-J').val() == ''|| $('#contact-mode-J').val() == '' || $('#mailbox-J').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项!','');

        }else{

            //验证错误
            var error = $('#create-Modal-J').find('.error');

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

    //创建用户(flag代表是否传id,JD代表当前是创建的大用户还是聚合商，true的时候是创建的大用户)
    function sendOption(url,seccessMeg,flag,JD){

        var prm = {

            //行业机构
            agencyType:$('#industry-body-J').val(),
            //编码
            eprCode:$('#encoded-J').val(),
            //名称
            eprName:$('#name-J').val(),
            //签署容量（kW）
            signatureVolume:$('#capacity-J').val(),
            //地址
            address:$('#address-J').val(),
            //联系人名称
            linkMan:$('#contact-name-J').val(),
            //联系方式
            phone:$('#contact-mode-J').val(),
            //邮箱
            eMail:$('#mailbox-J').val(),
            //描述
            memo:$('#create-remark').val()

        };

        if(flag){

            prm.id = _thisID;

        }else{


        }

        if(JD){

            //是否派生于聚合商

            if($('.JH-button').find('input').parent('span').hasClass('checked')){

                prm.isFromAggregator = true;

            }else{

                prm.isFromAggregator = false;

            }

            prm.aggregatorId = _JHID;

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
                    $('#create-Modal-J').modal('hide');

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

    //获取所有聚合商列表
    function JHlist(){

        $('#theLoading').modal('show');

        var prm = {

            //行业选择
            agency:$('#industry-type-modal').val(),
            //企业及居民类型
            eprtype:1,
            //是否有效
            isdel:$('#valuation-method-modal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DREpr/GetDREprDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                if(result.code == 0){

                    for(var i=0;i<result.eprs.length;i++){

                        arr.push(result.eprs[i]);

                    }


                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }

                _datasTable($('#JH-table'),arr);

            },

            error:_errorFun1

        })

    }

    //样式
    function changeCss(el){

        $('.table tbody').find('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

    }

    //获取用户数据
    function YHData(flag){

        var prm = {

            keyword:$('#keyWord-YH').val()

        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'DREpr/GetEprBindUserSelectDs',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var arr = [];

                if(result.code == -2){

                    if(flag){

                        console.log('获取用户数据结果：暂无数据！');

                    }else{

                        _moTaiKuang($('#tip-Modal'),'提示',true,true,'暂无数据！','');

                    }

                }else if(result.code == -1){

                    if(flag){

                        console.log('获取用户数据结果：异常错误！');

                    }else{

                        _moTaiKuang($('#tip-Modal'),'提示',true,true,'异常错误！','');

                    }

                }else if(result.code == -3){

                    if(flag){

                        console.log('获取用户数据结果：参数错误！');

                    }else{

                        _moTaiKuang($('#tip-Modal'),'提示',true,true,'参数错误！','');

                    }

                }else if(result.code == -4){

                    if(flag){

                        console.log('获取用户数据结果：内容已存在！');

                    }else{

                        _moTaiKuang($('#tip-Modal'),'提示',true,true,'内容已存在！','');

                    }

                }else if(result.code == 0){

                    arr = result.users;

                }

                if(flag){

                    YHArr.length = 0;

                    for(var i=0;i<arr.length;i++){

                        YHArr.push(arr[i]);

                    }

                }else{

                    _datasTable($('#YH-table'),arr);

                }

            },

            error:_errorFun1

        })

    }

    //获取户号数据
    function HHData(flag){

        var prm = {

            keyword:$('#keyWord-HH').val()

        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'DREpr/GetEprBindAcctSelectDs',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var arr = [];

                if(result.code == -2){

                    console.log('获取户号数据结果：暂无数据！');

                }else if(result.code == -1){

                    console.log('获取户号数据结果：异常错误！');

                }else if(result.code == -3){

                    console.log('获取户号数据结果：参数错误！');

                }else if(result.code == -4){

                    console.log('获取户号数据结果：内容已存在！');

                }else if(result.code == 0){

                    arr = result.accts;

                }

                if(flag){

                    HHArr.length = 0;

                    for(var i=0;i<arr.length;i++){

                        HHArr.push(arr[i]);

                    }

                }else{

                    _datasTable($('#HH-table'),arr);

                }

            },

            error:_errorFun1

        })

    }

    return {

        init: function(){

            conditionSelect();

        }

    }

}()