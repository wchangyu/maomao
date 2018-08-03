$(function(){

    //当前企业id
    var _thisEprId = '';

    //当前选择的聚合商列表
    var _JHID = '';

    //选择区域按钮
    var _thisDistrictButton = '';

    //当前选中的账户id
    var _thisUserId = '';

    //记录当前创建的企业的名字
    var _createEprName = '';

    //创建聚合商or大用户？
    var search = window.location.search;

    //单选按钮初始化
    if(search != ''){

        var type = search.split('=')[1];

        if(type == 1){

            //1，创建聚合商
            //样式：聚合商勾选，选择用户，是否派生不显示
            $('.eprType').eq(0).attr('checked','checked');
            //选择用户显示
            $('.user-block').show();
            //是否派生不显示
            $('.JH-button').hide();

        }else if(type ==2){

            //2，创建大用户
            //大用户勾选，选择用户，是否派生显示
            $('.eprType').eq(1).attr('checked','checked');
            //选择用户显示
            $('.user-block').show();
            //是否派生显示，但不勾选
            $('.JH-button').show();

        }

    }

    //当前点击的按钮
    var _thisButton= '';

    /*----------------------------------验证------------------------------------*/

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

        var phone = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;

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
            title:'父级',
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

    //户号
    var accountCol = [

        {
            title:'编码',
            data:'',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display:none; "></span>'

            }
        },
        {
            title:'名称',
            data:'',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display: none;"></span>'

            }
        },
        {
            title:'签署容量（kW）',
            data:'',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display: none;"></span>'

            }
        },
        {
            title:'选择区域',
            data:'',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<span class="select-district-table" style="display: inline-block;padding: 3px 5px;border: 1px solid #cccccc;border-radius: 4px !important;margin-right: 5px;cursor: pointer">选择区域</span><input type="text" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必选字段" readonly style="background: #ffffff;width: 120px;display: inline-block;"><span class="error-tip" style="display: none;"></span>'

            }
        },
        {
            title:'区域',
            data:'',
            className:'inputValue hiddenButton',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display: none;"></span>'

            }
        },
        {
            title:'描述',
            data:'',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value table-group-action-input form-control" style="background: #ffffff"><span class="error-tip" style="display: none;"></span>'

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

    //登录账户
    var userCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker" data-id="' + full.userId +  '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'账户角色',
            data:'roleName'
        },
        {
            title:'登录账户',
            data:'sysuserId'
        },
        {
            title:'登录账户名称',
            data:'userName'
        }

    ]

    _tableInit($('#user-table'),userCol,2,true,'','','','',10);

    /*---------------------------------按钮操作---------------------------------*/

    //tab选项
    //$('.steps').on('click','li',function(){
    //
    //    $('.steps').find('li').removeClass('active');
    //
    //    $(this).addClass('active');
    //
    //    $('.tab-pane').hide();
    //
    //    $('.tab-pane').eq($(this).index()).show();
    //
    //})

    //创建【企业】
    $('#createEpr').click(function(){

        _thisButton = $(this);

        formatValidateEpr(function(){

            sendOptionEpr(_thisButton);

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


    //【选择区域】
    $('#accountTable').on('click','.select-district-table',function(){

        _thisDistrictButton = $(this);

        $('#theLoading').modal('show');

        //初始化
        $('#keyWord-modal').val('');

        _datasTable($('#district-table'),[]);

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

            //隐藏验证消息
            dom.next().hide();

            dom.parents('td').next().find('input').next().hide();

            //红色边框隐藏
            dom.removeClass('table-error');

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

                            }else{

                                inputs.eq(i).next('.error-tip').html('');

                                inputs.eq(i).next('.error-tip').hide();

                                inputs.eq(i).removeClass('table-error');

                            }

                        }else{

                            inputs.eq(i).next('.error-tip').html('');

                            inputs.eq(i).next('.error-tip').hide();

                            inputs.eq(i).removeClass('table-error');

                        }

                    }else{

                        inputs.eq(i).addClass('table-error');

                        inputs.eq(i).next('.error-tip').html('请输入大于0的数字').show();
                    }

                }else{

                    $('.input-chinese').next('.error-tip').hide();

                    $('.input-chinese').removeClass('table-error');

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

        if(isAccord){

            //暂存当前的值
            var valueArr = [];

            for(var i = 0;i<inputValue.length;i++){

                valueArr.push(inputValue.eq(i).val());

            }

            var tds = $(this).parent().parent('tr').find('.inputValue');

            for(var i=0;i<tds.length;i++){

                var str = '<span class="input-value">' + valueArr[i] +'</span>';

                if(i == 3){

                    str = '<span class="select-district-table" style="display: inline-block;padding: 3px 5px;border: 1px solid #cccccc;border-radius: 4px !important;margin-right: 5px;cursor: pointer">选择区域</span>' + '<span class="input-value">' + valueArr[i] +'</span>';

                }

                tds.eq(i).empty().append(str);

            }

            $(this).html('编辑').removeClass('option-save').addClass('option-edit');

        }


    })

    //户号【编辑】
    $('#accountTable tbody').on('click','.option-edit',function(){

        var tds = $(this).parent().parent('tr').find('.input-value').parent('td');

        var valueArr = [];

        //插入input中
        for(var i=0;i<tds.length;i++){

            valueArr.push(tds.eq(i).children('.input-value').html());

            var str = '';

            if(i == 2){

                //签署容量（验证数字）
                str = '<input type="text" class="input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff" value="' + valueArr[i] + '"><span class="error-tip" style="display: none;"></span>'

            }else if(i == 3){

                //选择区域

                str = '<span class="select-district-table" style="display: inline-block;padding: 3px 5px;border: 1px solid #cccccc;border-radius: 4px !important;margin-right: 5px;cursor: pointer">选择区域</span><input type="text" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必填字段" readonly style="background: #ffffff;width: 120px;display: inline-block;" value="' + valueArr[i] + '"><span class="error-tip" style="display: none;"></span>'

            }else if(i == 5){

                str = '<input type="text" class="input-value table-group-action-input form-control" style="background: #ffffff" value="' + valueArr[i] + '"><span class="error-tip" style="display:none; "></span>'

            } else{

                //其他
                str = '<input type="text" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff" value="' + valueArr[i] + '"><span class="error-tip" style="display:none; "></span>'

            }

            $(tds).eq(i).empty().append(str);

        }

        $(this).html('保存').removeClass('option-edit').addClass('option-save');

    })

    //户号【删除】
    $('#accountTable tbody').on('click','.option-del',function(){

        //获取表格对象
        var T = $('#accountTable').DataTable();

        T.row($(this).parents('tr')).remove().draw( false );

    })

    //输入验证
    $('#accountTable tbody').on('keyup','.input-required',function(){

        //验证非空
        if($(this).val() == ''){

            $(this).next('.error-tip').html('该项为必填字段').show();

        }else{

            //区分数字和文本的必填项

            $(this).next('.error-tip').html('').hide();

            //验证格式,说明是数字
            if($(this).attr('class').indexOf('input-chinese')<0){

                var reg = /^\d+(\.\d+)?$/;

                if(reg.test($(this).val())){

                    $(this).next('.error-tip').html('').hide();

                    $(this).removeClass('table-error');


                }else{

                    $(this).next('.error-tip').html('请输入大于0的数字').show();

                    $(this).addClass('table-error');

                }

            }else{

                //说明是文字
                $(this).next('.error-tip').html('').hide();

                $(this).removeClass('table-error');

            }

        }

    })

    //管理户号
    $('#createAccount').click(function(){

        _thisButton = $(this);

        sendOptionAccount(_thisButton)

    })

    //【选择登录账户】
    $('.select-user-button').click(function(){

        //初始化
        _datasTable($('#user-table'),[]);
        //模态框
        _moTaiKuang($('#user-Modal'),'账户选择','','','','确定');

        //数据
        //判断当前创建的是聚合商还是大用户
        var s = $('.JH-button').css('display');

        var roleId = '';

        if(s == 'none'){

            roleId = 1;

        }else{
            roleId = 4;

        }

        getUser(roleId);

    })

    //账户选择【tr】
    $('#user-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#user-table tbody').find('tr').removeClass('tables-hover');

            $('#user-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#user-table tbody').find('tr').removeClass('tables-hover');

            $('#user-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //账户【确定】
    $('#user-Modal').on('click','.btn-primary',function(){

        var currentTr = $('#user-table tbody').find('.tables-hover');

        _thisUserId = currentTr.find('.checker').attr('data-id');

        var name = currentTr.children().eq(3).html();

        $('#create-id').val(name);

        //模态框
        $('#user-Modal').modal('hide');

    })

    //返回企业账户列表(只要填写内容不全部为空，就要弹出框提示)
    $('#returnEpr').click(function(){

        var content = $('#commentFormEpr').find('.input-block').children('input');

        var isModal = false;

        for(var i=0;i<content.length;i++){

            if(content.eq(i).val() != ''){

                isModal = true;

                break;

            }

        }

        //判断当前页面创建的是聚合商还是大用户
        var type = $('.eprType:checked').val();

        if(isModal){

            _moTaiKuang($('#IsBack-Modal-Epr'),'提示','',true,'是否返回企业列表');

        }else{

            if(type == 0){

                //聚合商
                window.location.href = 'epr.html?create=1';

            }else{

                //大用户
                window.location.href = 'epr.html?create=2';

            }


        }

    })

    //点击返回企业
    $('#IsBack-Modal-Epr').on('click','.btn-primary',function(){

        window.location.href = 'epr.html'

    })

    //返回户号列表
    $('#returnAccount').click(function(){

        //判断表格中是否有数据，如果有的话提示
        var tr = $('#accountTable tbody').children();

        var flag = false;

        if(tr.length > 1){

            flag = false;

        }else{

            if(tr.children().length!=1){

                flag = false;

            }else{

                flag = true;

            }

        }

        if(flag){

            window.location.href = 'accountNumber.html'

        }else{

            _moTaiKuang($('#IsBack-Modal-Account'),'提示','',true,'是否返回户号列表','返回');

        }



    })

    //点击返回
    $('#IsBack-Modal-Account').on('click','.btn-primary',function(){

        window.location.href = 'accountNumber.html'

    })

    //如果派生于聚合商的话，选择聚合商显示，否则，聚合商不显示
    $('#aa').change(function(){

        //如果选中的话，显示选择聚合商
        if($(this).parent('.checked').length){

            //选择聚合商显示
            $('.isPS-block').show();

            //选择账户清空
            _thisUserId = '';

            //选择账户不显示
            $('.user-block').hide();

        }else{

            //选择聚合商不显示
            $('.isPS-block').hide();

            _JHID = '';

            $('#JHS-J').val('');

            //账户不选
            $('#create-id').val('');

            _thisUserId = '';

            //选择账户显示
            $('.user-block').show();
        }

    })

    //账户条件选择
    $('#selected-user-modal').click(function(){

        var roleId = '';

        if($('.eprType:checked').val() == 0){

            //聚合商
            roleId = 1;

        }else if($('.eprType:checked').val() == 1){

            //大用户
            roleId =4
        }

        getUser(roleId);

    })

    /*-----------------------------------------------------其他方法----------------------------------------*/

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
    function sendOptionEpr(el){

        //验证。如果勾选了是否派生于聚合商，就必须选择聚合商，如果没有勾选聚合商，聚合商变量清空
        if($('#aa').parent('.checked').length == 0){

            _JHID = '';

            //验证账户是否选择
            if(_thisUserId == ''){

                _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择账户','');

                return false;

            }

        }else{

            //如果勾选了，聚合商必须选择
            if(_JHID == ''){

                //验证
                _moTaiKuang($('#tip-Modal'),'提示',true,true,'派生于聚合商情况下，必须选择聚合商');

                return false;

            }

        }

        var buttonStr = '<i class="fa fa-check" style="margin-right: 5px;"></i>正在保存...';

        el.empty().append(buttonStr).attr('disabled',true);


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
            memo:$('#create-remark-epr').val(),
            //默认创建聚合商
            eprType:1,
            //账户id
            userId:_thisUserId,
            //企业类型
            industryType:$('.IndustryType:checked').val()

        };

        _createEprName = $('#name-J').val();

        var url = 'DREprNew/CreateDREprInfoByAggregatorReturnNewId';

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

            url = 'DREprNew/CreateDREprInfoByConsumerReturnNewId';

        }

        _eprType = $('.eprType').parent('.checked').children().val();

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                var buttonStr = '<i class="fa fa-check" style="margin-right: 5px;"></i>创建企业';

                el.empty().append(buttonStr).attr('disabled',false);


                if(result.code == 0){

                    //样式修改
                    $('.steps').children().removeClass('active');



                    $('#theLoading').modal('hide');

                    $('#createEprName').html(_createEprName);

                    //给企业赋值
                    _thisEprId = result.eprNewId;

                    //创建户号显示
                    $('#tab3').show();

                    //如果是创建了聚合商，完毕之后直接跳回企业列表，如果是大用户，继续跳到创建户号。

                    if(_eprType == 0){

                        //聚合商
                        window.location.href = 'epr.html';

                        return false;

                    }else if( _eprType == 1 ){

                        $('.steps').children().eq(1).addClass('active');

                        $('.tab-pane').hide();

                        $('.tab-pane').eq(1).show();

                        //进度条
                        $('.progress-bar-success').css({width:'100%'});

                        //已创建的样式要变
                        $('.steps').children().eq(0).addClass('done');

                    }


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

    //创建户号
    function sendOptionAccount(el){

        //获取所有户号的数组
        var td = $('#accountTable tbody').children('tr');

        var arr = [];

        for(var i=0;i<td.length;i++){

            var obj = {};

            //编码
            obj.accountCode = td.eq(i).children().eq(0).children('.input-value').html();
            //名称
            obj.accountName = td.eq(i).children().eq(1).children('.input-value').html();
            //签署容量
            obj.signatureVolume = td.eq(i).children().eq(2).children('.input-value').html();
            //区域id
            obj.districtId = td.eq(i).children().eq(4).children('.input-value').html();
            //描述
            obj.memo = td.eq(i).children().eq(5).children('.input-value').html();
            //企业
            obj.eprId = _thisEprId

            arr.push(obj);

        }

        var prm = {

            //企业以及居民信息Id
            eprId:_thisEprId,
            //户号列表
            accts:arr

        };

        var buttonStr = '<i class="fa fa-check" style="margin-right: 5px;"></i>正在保存...';

        el.empty().append(buttonStr).attr('disabled',true)


        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRAccountNew/CreateDRAccountListByEprId',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                var buttonStr = '<i class="fa fa-check" style="margin-right: 5px;"></i>创建户号';

                el.empty().append(buttonStr).attr('disabled',false);


                if(result.code == 0){

                    //跳到账户页面

                    window.location.href = 'accountNumber.html'

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

    //获取用户列表
    function getUser(id){

        $('#theLoading').modal('show');

        var prm = {

            eprType:id,

            keyword:$('#keyWord-user-modal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DREpr/GetEprBindUserSelectDs',

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

                    var arr = result.users;

                    //表格
                    _jumpNow($('#user-table'),arr);
                }

            },

            error:_errorFun

        })

    }

})