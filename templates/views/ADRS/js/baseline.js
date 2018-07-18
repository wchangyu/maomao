var BaseLine = function () {

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

                return  "<span class='data-option option-edit btn default btn-xs green-stripe' data-userId='" + full.id + "'>编辑</span>"

                    //"<span class='data-option option-shanchu btn default btn-xs green-stripe' data-userId='" + full.id + "'>删除</span>"

            }
        },
        {
            title:'基线id',
            data:'id'
        },
        {
            title:'基线名称',
            data:'name'
        },
        {
            title:'基线类型',
            data:'type',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '累计（典型）'

                }else{

                    return '时刻'
                }

            }
        },
        {
            title:'计算方式',
            data:'typical',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '仅限工作日'

                }else if(data == 2){

                    return '不限工作日'

                }

            }
        },
        {
            title:'推前天数',
            data:'days'
        },
        {
            title:'推前分钟数',
            data:'minutes'
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

            //基线名称
            'baseline-name':{

                required: true

            },

            //推前天数
            'forward-days':{

                numberFormat:true

            },

            //推前分钟数
            'forward-minute':{

                numberFormat:true

            }

        },
        messages:{

            //基线名称
            'baseline-name':{

                required: '请输入基线名称'

            },

            //推前天数
            'forward-days':{

                numberFormat:true

            },

            //推前分钟数
            'forward-minute':{

                numberFormat:true

            }

        }

    })

    //验证数字
    //正则表达式（补贴价格只能是数字）
    $.validator.addMethod("numberFormat",function(value,element,params){

        var doubles= /^\d+(\.\d+)?$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入数字格式");

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

        //选择区域显示
        $('.select-district').show();


    })

    //创建账户【确定按钮】
    $('#create-Modal').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRBaseline/CreateDRBaselineInfo','创建成功！');

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

        //选择区域显示
        $('.select-district').show();

    })

    //编辑【确定】
    $('#create-Modal').on('click','.bianji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRBaseline/ModifyDRBaselineInfo','编辑成功！',true);

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
        //账户登录名不能操作
        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        //选择区域消失
        $('.select-district').hide();

    })

    //删除【确定】
    $('#create-Modal').on('click','.shanchu',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            var prm = {

                acctId:_thisID

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DRAccount/LogicDelDRAcct',

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

    //累计类型选择
    $('#baseline-type-modal').change(function(){

        var value = $('#baseline-type-modal').val()

        if(value == 1){

            $('.type-add-up').show();

            $('.type-schedule').hide();

        }else{

            $('.type-add-up').hide();

            $('.type-schedule').show();

        }

    })

    //提示关闭之后，再刷新数据
    $('#tip-Modal').on('hidden.bs.modal',function(){

        if(_isReloadData){

            conditionSelect();

        }

        //标识重置
        _isReloadData = false;

    })
    /*----------------------------------其他方法-----------------------------------------*/

    //获取列表
    function conditionSelect(){

        $('#theLoading').modal('show');

        var  prm = {

            //基线类别
            type:$('#baseline-type').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRBaseline/GetDRBaselineDs',

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

                    arr = result.drbls.reverse();

                }

                _jumpNow($('#table'),arr);

            },

            error:_errorFun

        })


    }

    //初始化
    function createInit(){

        //清空
        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val(1);

        $('#create-Modal').find('textarea').val('');

        //当前id
        _thisID = '';

        $('.type-add-up').show();

        $('.type-schedule').hide();

    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#baseline-name').val() == ''){

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

            //基线名称
            name:$('#baseline-name').val(),
            //基线类型
            type:$('#baseline-type-modal').val(),
            //描述
            memo:$('#create-remark').val()

        };

        if( $('#baseline-type-modal').val() == 1 ){

            //计算方式
            prm.typical = $('#baseline-calculate').val();
            //推前天数
            prm.days = $('#forward-days').val();

        }else{

            //推前分钟数
            prm.minutes = $('#forward-minute').val()

        }

        if(flag){

            prm.id = _thisID;

            //不管基线类型是啥，天数和分钟数都要传

            if($('#baseline-type-modal').val() == 1){

                //推前分钟数
                prm.minutes = $('#forward-minute').val()

            }else{

                //计算方式
                prm.typical = $('#baseline-calculate').val();
                //推前天数
                prm.days = $('#forward-days').val();

            }


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

            id:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRBaseline/GetDRBaselineById',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //绑定数据
                    //基线名称
                    $('#baseline-name').val(result.baseline.name);
                    //基线类型
                    $('#baseline-type-modal').val(result.baseline.type);

                    if(result.baseline.type == 1){

                        //样式
                        $('.type-add-up').show();

                        $('.type-schedule').hide();

                        //计算方式
                        $('#baseline-calculate').val(result.baseline.typical);

                        //推前天数
                        $('#forward-days').val(result.baseline.days);

                    }else{

                        //样式
                        $('.type-add-up').hide();

                        $('.type-schedule').show();

                        //推前分钟数
                        $('#forward-minute').val(result.baseline.minutes);
                    }

                    //描述
                    $('#create-remark').val(result.baseline.memo);


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

    return {
        init: function () {
            //条件选择
            conditionSelect()

        }
    }

}();