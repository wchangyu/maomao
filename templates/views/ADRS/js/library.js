var Library = function () {

    //记录当前选中的userId
    var _thisID = '';

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[

        {
            title:'产品名称',
            data:'name'
        },
        {
            title:'产品类型',
            data:'libraryType',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '价格型'

                }else if(data == 2){

                    return '鼓励型'

                }

            }
        },
        {
            title:'计价方式',
            data:'priceMode',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '按次每kW'

                }else if(data == 2){

                    return '按量每kWh'

                }else if(data == 3){

                    return '分时电价'

                }

            }
        },
        {
            title:'补贴价格',
            data:'price'
        },
        {
            title:'补贴发放方式',
            data:'allowType',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '电费抵扣'

                }else if(data == 2){

                    return '现金支付'

                }else if(data == 3){

                    return '预付补贴'

                }

            }
        },
        {
            title:'提前通知时间',
            data:'noticeHour'
        },
        {
            title:'产品描述',
            data:'memo'
        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='option-button option-edit' data-userId='" + full.id + "'>编辑</span>"

            }
        }

    ]

    _tableInit($('#table'),col,2,true,'','','','');

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //产品名称
            'product-name':'required',

            //补贴价格
            'subsidized-price':{

                required: true,

                numberFormat1:true

            },

            //通知时间
            'notice-time':{

                required: true,

                numberFormat1:true

            }

        },
        messages:{

            //登录账户名
            'product-name':{

                required: '请输入产品名称'

            },
            //补贴价格
            'subsidized-price':{

                required: '请输入补贴价格'

            },

            //通知时间
            'notice-time':{

                required: '请输入通知时间'

            }

        }

    })

    //正则表达式（补贴价格只能是数字）
    $.validator.addMethod("numberFormat",function(value,element,params){

        var doubles= /^\d+(\.\d+)?$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入数字格式");

    //正则表达式（大于0的数字）
    $.validator.addMethod("numberFormat1",function(value,element,params){

        var doubles= /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入大于0的数字");

    /*-----------------------------------按钮事件---------------------------------------*/

    //查询
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
        _moTaiKuang($('#create-Modal'), '创建产品库', false, '' ,'', '创建');

        //loadding
        $('#theLoading').modal('hide');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可编辑（都可编辑）
        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);


    })

    //创建账户【确定按钮】
    $('#create-Modal').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRLibrary/CreateDRLibraryInfo','创建成功');

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
        _moTaiKuang($('#create-Modal'), '编辑产品库', false, '' ,'', '保存');

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

            sendOption('DRLibrary/ModifyDRLibraryInfo','编辑成功',true);

        })

    })

    /*-------------------------------------其他方法-----------------------------------------*/

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

    }

    //获取所有产品
    function conditionSelect(){

        $('#theLoading').modal('show');

        var prm = {

            //产品类型
            libraryType:$('#product-type').val(),
            //计价方式
            priceMode:$('#valuation-method').val(),
            //登录者
            loginSysuserRole:sessionStorage.ADRS_UserRole

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRLibrary/GetDRLibraryDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                var arr = [];

                $('#tip').hide();

                if(result.code == -2){

                    _topTipBar('暂时没有套餐数据')

                }else if(result.code == -1){

                    _topTipBar('异常错误')

                }else if(result.code == -3){

                    _topTipBar('参数错误')

                }else if(result.code == -4){

                    _topTipBar('内容已存在')

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有获取套餐数据的权限')

                }else if(result.code == 0){

                    arr = result.libs;

                }

                _jumpNow($('#table'),arr);

            },

            error:_errorBar

        })


    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#product-name').val() == '' || $('#subsidized-price').val() == '' || $('#notice-time').val() == '' ){

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

            //产品名称 ,
            name:$('#product-name').val(),
            //产品类型
            type:$('#product-types').val(),
            //计价方式
            priceMode:$('#valuation-methods').val(),
            //补贴价格
            price:$('#subsidized-price').val(),
            //发放方式
            allowType:$('#grant-methods').val(),
            //通知时间
            noticehour:$('#notice-time').val(),
            //描述
            memo:$('#create-remark').val()

        };

        if(flag){

            prm.id = _thisID;

        }else{

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

            libraryId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRLibrary/GetDRLibraryById',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //绑定数据
                    //产品名称
                    $('#product-name').val(result.library.name);
                    //产品类型
                    $('#product-types').val(result.library.libraryType);
                    //计价方式
                    $('#valuation-methods').val(result.library.priceMode);
                    //补贴价格
                    $('#subsidized-price').val(result.library.price);
                    //发放方式
                    $('#grant-methods').val(result.library.allowType);
                    //通知时间
                    $('#notice-time').val(result.library.noticeHour);
                    //描述
                    $('#create-remark').val(result.library.memo);

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }

            }

        })

    }

    return {
        init: function () {

            conditionSelect();

        }
    }

}();