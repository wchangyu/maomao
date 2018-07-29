$(function(){

    /*---------------------------------变量-------------------------------------*/

    //当前创建用户的id
    var _thisUser = '';

    //当前企业id
    var _thisEpr = '';

    //当前选择的聚合商列表
    var _JHID = '';

    //当前选择的区域
    var _DistrictID = '';

    //当前选择的企业
    var _EprId = '';

    //选择区域按钮
    var _thisDistrictButton = '';

    //选择企业按钮
    var _thisEprButton = '';

    /*----------------------------------验证------------------------------------*/

    //创建用户验证
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

    //创建企业验证
    $('#commentFormEpr').validate({

        rules:{

            //编码
            'encoded-J':'required',
            //名称
            'name-J':'required',
            //地址
            'address-J':'required',
            //联系人名称
            'contact-name-J':'required',
            //联系人方式
            'contact-mode-J':{

                required:true,

                phoneNumFormat:true

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

    //创建户号验证
    $('#commentFormAccount').validate({

        rules:{

            //编码
            'account-num':{

                required: true

            },

            //名称
            'account-name':{

                required: true

            },

            //区域
            'account-district':{

                required: true

            },

            //签署容量
            'account-capacity':{

                required: true,

                numberFormat1:true

            }

        },
        messages:{

            //编码
            'account-num':{

                required: '请输入编码'

            },

            //名称
            'account-name':{

                required: '请输入名称'

            },

            //区域
            'account-district':{

                required: '请选择区域'

            }

        }

    })

    //正则表达式（账户名不能是中文）
    $.validator.addMethod("NonChinese",function(value,element,params){

        var doubles= /([a-zA-Z0-9]*[a-zA-Z][a-zA-Z0-9]*)/;

        return this.optional(element)||(doubles.test(value));

    },"请使用英文加数字格式");

    //正则表达式（邮箱）
    $.validator.addMethod("emailFormat",function(value,element,params){

        var doubles= /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入邮箱格式");

    //正则表达式（大于0的数字）
    $.validator.addMethod("numberFormat1",function(value,element,params){

        var doubles= /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入大于0的数字");

    //联系方式验证（手机和座机）
    $.validator.addMethod("phoneNumFormat",function(value,element,params){

        //手机号
        var mobile = /^1[3|5|8]\d{9}$/ ;
        //带区号的座机
        //var phone = /^0\d{2,3}-?\d{7,8}$/;

        var phone = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7}$/;

        var flag = false;

        if( mobile.test(value) || phone.test(value)){

            flag = true;

        }

        return this.optional(element)||flag;

    },"请输入合法的联系方式");

    /*---------------------------------表格初始化-------------------------------*/

    //选择聚合商表格
    var JHCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.eprId + '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'企业类型',
            data:'eprTypeName'
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
            title:'行业机构',
            data:'agencyTypeName'
        }

    ]

    _tableInit($('#JH-table'),JHCol,2,true,'','','','',10);

    //区域
    var districtCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'区域编码',
            data:'id'
        },
        {
            title:'区域名称',
            data:'name'
        },
        {
            title:'父级id',
            data:'pId'
        },
        {
            title:'区域等级',
            data:'level',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '省级'

                }else if(data == 2){

                    return '市级'

                }

            }
        },
        //{
        //    title:'是否有效',
        //    data:'isDelName'
        //}

    ]

    _tableInit($('#district-table'),districtCol,2,true,'','','','',10);

    var accountCol = [

        {
            title:'编码',
            data:'',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip"></span>'

            }
        },
        {
            title:'名称',
            data:'',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip"></span>'

            }
        },
        {
            title:'签署容量（kW）',
            data:'',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip"></span>'

            }
        },
        {
            title:'选择区域',
            data:'',
            render:function(data, type, full, meta){

                return '<div><span class="select-district-table" style="display: inline-block;padding: 3px 5px;border: 1px solid #cccccc;border-radius: 4px !important;margin-right: 5px;cursor: pointer">选择区域</span><input type="text" class="input-chinese input-required table-group-action-input form-control" placeholder="必填字段" readonly style="background: #ffffff;width: 120px;display: inline-block;"></div><span class="error-tip"></span>'

            }
        },
        {
            title:'区域',
            data:'',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip"></span>'

            }
        },
        {
            title:'描述',
            data:'',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip"></span>'

            }
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<span class="option-button option-save">保存</span>' +

                    '<span class="option-button option-del">删除</span>'

            }
        }

    ]

    _tableInit($('#accountTable'),accountCol,2,true,'','','','',10);

    /*---------------------------------按钮操作---------------------------------*/

    //tab选项
    $('.steps').on('click','li',function(){

        $('.steps').find('li').removeClass('active');

        $(this).addClass('active');

        $('.tab-pane').hide();

        $('.tab-pane').eq($(this).index()).show();

    })

    //创建【用户】
    $('#createUser').click(function(){

        //格式验证
        formatValidateUser(function(){

            sendOptionUser();

        })

    })

    //创建【企业】
    $('#createEpr').click(function(){

        formatValidateEpr(function(){

            sendOptionEpr();

        })

    })

    //创建企业选择聚合商
    $('.select-epr-button').click(function(){

        //初始化
        _datasTable($('#JH-table'),[]);

        //模态框
        _moTaiKuang($('#select-JH-Modal'),'聚合商列表',false,false,false,'选择')

        //获取数据
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

        _JHID = $('#JH-table').find('.tables-hover').find('.checker').attr('data-id');

        //获取聚合商名字
        var name = $('#JH-table').find('.tables-hover').children().eq(3).html();

        $('#JHS-J').val(name);

        //模态框消失
        $('#select-JH-Modal').modal('hide');

    })

    //企业类型选择
    $('input[type=radio][name=JD]').change(function(){

        if($(this).val() == 0){

            //创建聚合商
            $('.JH-button').hide();

        }else{

            //创建大用户
            $('.JH-button').show();

        }


    })

    //创建【户号】
    $('#createAccount').click(function(){

        formatValidateAccount(function(){



        })

    })

    //【选择区域】
    $('#accountTable').on('click','.select-district-table',function(){

        _thisDistrictButton = $(this);

        $('#theLoading').modal('show');

        //模态框
        _moTaiKuang($('#district-Modal'),'区域',false,'','','选择');

        //数据
        getDistrict();

    })

    //区域条件【查询】
    $('#selected-modal').click(function(){

        getDistrict();

    })

    //区域表格【选择】
    $('#district-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#district-table tbody').find('tr').removeClass('tables-hover');

            $('#district-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#district-table tbody').find('tr').removeClass('tables-hover');

            $('#district-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //选择区域的id
    $('#district-Modal').on('click','.btn-primary',function(){

        var num = $('#district-table').find('.tables-hover').children().eq(1).html();

        if(!num){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择区域','')

        }else{

            var name = $('#district-table').find('.tables-hover').children().eq(2).html();

            var dom = _thisDistrictButton.next();

            dom.val(name);

            dom.parents('td').next().find('input').val(num);

            $('#district-Modal').modal('hide');

        }

    })

    //【增加一条户号】
    $('.button-add').on('click',function(){

        //获取表格对象
        var T = $('#accountTable').DataTable();

        T.row.add(['','','','']).draw();

    })

    //户号【保存】
    $('#accountTable tbody').on('click','.option-save',function(){

        //dom
        var inputs = $(this).parent().parent('tr').find('.input-required');

        //所有input的值
        var inputValue = $(this).parent().parent('tr').find('.input-value');

        //是否符合验证
        var isAccord = true;

        //格式验证
        //首先验证非空
        for(var i=0;i<inputs.length;i++){

            if(inputs.eq(i).val() == ''){

                //指出哪个是不符合的
                inputs.eq(i).addClass('table-error');

                inputs.eq(i).next('.error-tip').html('该项为必填字段').show();

            }else{

                if(inputs.eq(i).attr('class').indexOf('input-chinese')<0){

                    //非空验证通过之后，验证正则
                    var reg = /^\d+(\.\d+)?$/;

                    if(reg.test(inputs.eq(i).val())){

                        //验证消减负荷
                        if(i==2){

                            //判断提示消息是否还在
                            var o = inputs.eq(i).next().css('display');

                            if(o != 'none'){

                                break;

                            }

                        }else{

                            inputs.eq(i).next('.error-tip').html('').hide();

                            inputs.eq(i).removeClass('table-error');

                        }

                    }else{

                        inputs.eq(i).addClass('table-error');

                        inputs.eq(i).next('.error-tip').html('请输入大于0的数字').show();
                    }

                }else{

                    $('.input-chinese').next('.error-tip').hide();

                }

            }

        }

        //查看是否都是非空
        for(var i=0;i<inputs.length;i++){

            var o = inputs.eq(i).next('.error-tip').css('display');

            if( o != 'none'){

                isAccord = false

                break;

            }else{

                isAccord = true;

            }

        }

        console.log(isAccord);

        if(isAccord){

            //暂存当前的值
            var valueArr = [];

            for(var i = 0;i<inputValue.length;i++){

                valueArr.push(inputValue.eq(i).val());

            }

            var tds = $(this).parent().parent('tr').find('.inputValue');

            for(var i=0;i<tds.length;i++){

                var str = '<span class="input-value">' + valueArr[i] +'</span>';

                tds.eq(i).empty().append(str);

            }

            $(this).html('编辑').removeClass('option-save').addClass('option-edit');

        }


    })

    //输入验证
    $('#accountTable tbody').on('keyup','.input-required',function(){

        //验证非空
        if($(this).val() == ''){

            $(this).next('.error-tip').html('该项为必填字段').show();

        }else{

            //区分数字和文本的必填项

            $(this).next('.error-tip').html('').hide();

            //验证格式

            if($(this).attr('class').indexOf('input-chinese')<0){

                var reg = /^\d+(\.\d+)?$/;

                if(reg.test($(this).val())){

                    $(this).next('.error-tip').html('').hide();

                    //再判断消减负荷的数量

                    if( $(this).parent('td').index() == 4 ){

                        //首先判断是否在自己的签署容量之内
                        var maxCapacity = $(this).parent().parent().children().eq(0).children().attr('data-capacity');

                        if(Number($(this).val())>Number(maxCapacity)){

                            $(this).addClass('table-error');

                            $(this).next('.error-tip').html('消减负荷不能超过自身签署容量').show();

                        }else{

                            //将该表格的所有第三列数字加起来，必须小于等于thisLoad
                            var table = $(this).parents('.innerTable');

                            var loadTr = table.children('tbody').children('tr');

                            var totle = 0;

                            for(var i=0;i<loadTr.length;i++){

                                var typeFlag = loadTr.eq(i).children('td').eq(4).children('input').length;

                                var num = 0;

                                if(typeFlag == 0){

                                    num = Number(loadTr.eq(i).children('td').eq(4).children().html());

                                }else{

                                    num = Number(loadTr.eq(i).children('td').eq(4).children().val());

                                }

                                totle += num;

                            }

                            //如果总量大于thisLoad，要提示
                            if(totle>_thisLoad){

                                $(this).addClass('table-error');

                                $(this).next('.error-tip').html('消减负荷累计不能超过总负荷量').show();

                            }else{

                                $(this).removeClass('table-error');

                                $(this).next('.error-tip').html('').hide();

                            }

                        }

                    }

                }else{

                    $(this).next('.error-tip').html('请输入大于0的数字').show();

                }

            }

        }

    })

    /*-----------------------------------------------------其他方法----------------------------------------*/

    //创建用户验证
    function formatValidateUser(fun){

        //非空验证
        if($('#create-user-name').val() == '' || $('#create-user-login-name').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项','');

        }else{

            //验证错误
            var error = $('#commentForm').find('.error');

            if(error.length != 0){

                var flag = true;

                for(var i=0;i<error.length;i++){

                    if(error.eq(i).css('display') != 'none'){

                        flag = false;

                        break;

                    }

                }

                if(flag){

                    fun();

                }else{

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式','');

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //创建用户发送数据
    function sendOptionUser(){

        $('#theLoading').modal('show');

        var prm = {

            //账户登录名 ,
            sysuserId : $('#create-user-name').val(),
            //账户密码
            sysuserPass : $('#create-user-passW').val(),
            //账户名称
            userName:$('#create-user-login-name').val(),
            //账户角色
            userRole:$('#create-user-role').val(),
            //备注
            memo:$('#create-remark').val()

        };

        //跳到创建企业

        //样式修改
        $('.steps').children().removeClass('active');

        $('.steps').children().eq(1).addClass('active');

        $('.tab-pane').hide();

        $('.tab-pane').eq(1).show();

        $('#theLoading').modal('hide');

        return false;

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRUser/CreateDRUserInfo',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //跳到创建企业页面。

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

    //创建企业验证
    function formatValidateEpr(fun){

        //非空验证
        if($('#encoded-J').val() == '' || $('#name-J').val() == '' || $('#address-J').val() == ''|| $('#contact-name-J').val() == ''|| $('#contact-mode-J').val() == '' || $('#mailbox-J').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项!','');

        }else{

            //验证错误
            var error = $('#commentFormEpr').find('.error');

            if(error.length != 0){

                var flag = true;

                for(var i=0;i<error.length;i++){

                    if(error.eq(i).css('display') != 'none'){

                        flag = false;

                        break;

                    }

                }

                if(flag){

                    fun();

                }else{

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式','');

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //创建企业发送数据
    function sendOptionEpr(){

        var prm = {

            //行业机构
            agencyType:$('#industry-body-J').val(),
            //编码
            eprCode:$('#encoded-J').val(),
            //名称
            eprName:$('#name-J').val(),
            //地址
            address:$('#address-J').val(),
            //联系人名称
            linkMan:$('#contact-name-J').val(),
            //联系方式
            phone:$('#contact-mode-J').val(),
            //邮箱
            eMail:$('#mailbox-J').val(),
            //描述
            memo:$('#create-remark').val(),
            //默认创建聚合商
            eprType:1

        };

        //通过判断$('.JH-button')的状态来确定是聚合商还是大用户
        var s = $('.JH-button').css('display');

        if(s != 'none'){

            //是否派生于聚合商

            if($('.JH-button').find('input').parent('span').hasClass('checked')){

                prm.isFromAggregator = true;

            }else{

                prm.isFromAggregator = false;

            }

            prm.aggregatorId = _JHID;

            //创建大用户,如果行业机构是居民用户的话，eprType = 2，否则是3

            if($('#industry-body-J').val() == 3){

                prm.eprType = 2;

            }else{

                prm.eprType = 3;

            }




        }

        //跳到创建户号

        //样式修改
        $('.steps').children().removeClass('active');

        $('.steps').children().eq(2).addClass('active');

        $('.tab-pane').hide();

        $('.tab-pane').eq(2).show();

        $('#theLoading').modal('hide');

        return false;

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //模态框消失
                    $('#create-Modal-J').modal('hide');

                    $('#create-Modal-J').one('hidden.bs.modal',function(){

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

    //创建户号验证
    function formatValidateAccount(fun){

        //非空验证
        if($('#account-num').val() == '' || $('#caccount-name').val() == '' || $('#account-district').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项','');

        }else{

            //验证错误
            var error = $('#commentFormAccount').find('.error');

            if(error.length != 0){

                var flag = true;

                for(var i=0;i<error.length;i++){

                    if(error.eq(i).css('display') != 'none'){

                        flag = false;

                        break;

                    }

                }

                if(flag){

                    fun();

                }else{

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式','');

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //创建户号发送数据
    function sendOption(){

        var prm = {

            //户号编码
            accountCode : $('#account-num').val(),
            //账户名称
            accountName : $('#account-name').val(),
            //所属区域
            districtId:_thisDistrict,
            //选择企业
            eprId:_thisErp,
            //备注
            memo:$('#create-remark').val(),
            //签署容量
            signatureVolume:$('#account-capacity').val()

        };

        console.log(prm);

        return false;

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

    //获取所有聚合商列表
    function JHlist(){

        $('#theLoading').modal('show');

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DREpr/GetDREprByAggregatorDs',

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                if(result.code == 0){

                    for(var i=0;i<result.eprs.length;i++){

                        arr.push(result.eprs[i]);

                    }


                }else if(result.code == -2){

                    //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }

                _datasTable($('#JH-table'),arr);

            },

            error:_errorFun1

        })

    }

    //获取区域
    function getDistrict(){

        _datasTable($('#district-table'),[]);

        var prm = {

            keyword:$('#keyWord-modal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRDistrict/GetDRDistrictDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == -2){

                    //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }else if(result.code == 0){

                    var arr = result.dists.reverse();

                    //表格
                    _jumpNow($('#district-table'),arr);
                }

            },

            error:_errorFun

        })

    }



})