var Resource = function () {

    //条件刷新标识
    var _isReloadData = false;

    //记录当前选中的userId
    var _thisID = '';

    //记录当前选中的户号
    var _thisHH = '';

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[

        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='data-option option-edit btn default btn-xs green-stripe' data-userId='" + full.id + "'>编辑</span>" +

                    "<span class='data-option option-shanchu btn default btn-xs green-stripe' data-userId='" + full.id + "'>删除</span>" +

                    "<span class='data-option option-qiye btn default btn-xs green-stripe' data-userId='" + full.id + "'>绑定设备</span>"

            }
        },
        {
            title:'资源名称',
            data:'name'
        },
        {
            title:'额定功率（kW）',
            data:'ratedpower'
        },
        {
            title:'消减功率（kW）',
            data:'reducepower'
        },
        {
            title:'最大响应次数',
            data:'maxtimes'
        },
        {
            title:'响应次序',
            data:'respondSort'
        },
        {
            title:'是否自动',
            data:'iscomm',
            render:function(data, type, full, meta){

                if(data == 'True'){

                    return '是'

                }else if(data == 'False'){

                    return '否'

                }

            }
        },
        {
            title:'提前通知小时',
            data:'noticehour'
        },
        {
            title:'所属户号',
            data:'acctNt'
        },
        {
            title:'绑定设备个数',
            data:'meterNbrs'
        },
        {
            title:'资源类型',
            data:'resourceTypeName'
        },
        {
            title:'备注',
            data:'memo'
        }


    ]

    _tableInit($('#table'),col,2,true,'','','','');

    //户号
    var huCol = [
        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'户号',
            data:'accountCode',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.accountId + '">' + data+'</span>'

            }
        },
        {
            title:'户号名称',
            data:'accountName'
        },
        {
            title:'所属企业',
            data:''
        },
        {
            title:'所属企业名称',
            data:''
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

    ];

    _tableInit($('#huNum-table'),huCol,2,true,'','','','');

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //资源名称
            'resource-name-modal':{

                required: true

            },

            //额定功率
            'resource-rated':{

                required: true,

                numberFormat:true

            },

            //消减功率
            'resource-subtracting':{

                required: true,

                numberFormat:true

            },

            //最大响应次数
            'resource-max':{

                required: true,

                numberFormat:true

            },

            //提前通知小时
            'resource-notice':{

                required: true,

                numberFormat:true

            },

            //响应次序
            'resource-order':{

                required: true,

                numberFormat:true

            }

        },
        messages:{

            //资源名称
            'resource-name-modal':{

                required: '请输入资源名称'

            },

            //额定功率
            'resource-rated':{

                required: '请输入额定功率'

            },

            //消减功率
            'resource-subtracting':{

                required: '请输入消减功率'

            },

            //最大响应次数
            'resource-max':{

                required: '请输入最大响应次数'

            },

            //提前通知小时
            'resource-notice':{

                required: '请输入提前通知小时'

            },

            //响应次序
            'resource-order':{

                required: '请输入响应次序'

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

    //【创建用户】
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

    //创建用户【确定按钮】
    $('#create-Modal').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRResource/CreateDRResourceInfo','创建成功！');

        })
    })

    //【编辑】
    $('#table tbody').on('click','.option-edit',function(){

        $('#theLoading').modal('show');

        //样式
        changeCss($(this));

        //初始化
        createInit();

        //获取当前的用户id
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#create-Modal'), '提示', false, '' ,'', '保存');

        //绑定数据
        bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //是否可操作
        //用户登陆名不能操作
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

            sendOption('DRAccount/ModifyDRAcctInfo','编辑成功！',true);

        })

    })

    //选择户号
    $('.select-HH').click(function(){

        //初始化
        $('#keyWord-modal').val('');

        //模态框
        _moTaiKuang($('#huNum-Modal'),'户号','','','','选择');

        //数据
        huNumData();

    })

    //户号条件选择
    $('#selected-modal').click(function(){

        huNumData();

    })

    //户号表格点击选择
    $('#huNum-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#huNum-table tbody').find('tr').removeClass('tables-hover');

            $('#huNum-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#huNum-table tbody').find('tr').removeClass('tables-hover');

            $('#huNum-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //户号选择确定按钮
    $('#huNum-Modal').on('click','.btn-primary',function(){

        _thisHH = $('#huNum-table tbody').find('.tables-hover').children().eq(1).children().attr('data-id');

        //户号名称
        var name = $('#huNum-table tbody').find('.tables-hover').children().eq(2).html();

        $('#resource-HH').val(name);

        //模态框消失
        $('#huNum-Modal').modal('hide');

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

            //资源类别
            type:$('#resource-type').val(),
            //关键字
            keyword:$('#resource-name').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetDRResourceDs',

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

                    arr = result.rces

                }

                _jumpNow($('#table'),arr);

            },

            error:_errorFun

        })


    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#resource-name-modal').val() == '' || $('#resource-rated').val() == '' || $('#resource-subtracting').val() == '' || $('#resource-max').val() == '' || $('#resource-notice').val() == '' || $('#resource-order').val() == '' ){

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

    //初始化
    function createInit(){

        //清空
        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val(1);

        $('#create-Modal').find('textarea').val('');

        //当前id
        _thisID = '';

        //当前选中的户号
        _thisHH = '';

        //input框
        $('#isNo').parent('span').removeClass('checked');

    }

    //创建用户(flag代表是否传id)
    function sendOption(url,seccessMeg,flag){

        var iscomm = ''

        //设备是否具有信息交互接口
        if($('#isNo').parent('span').hasClass('checked')){

            iscomm = true;

        }else{

            iscomm = false;

        }

        var prm = {

            //资源名称
            name:$('#resource-name-modal').val(),
            //额定功率
            ratedpower:$('#resource-rated').val(),
            //消减功率
            reducepower:$('#resource-subtracting').val(),
            //最大响应次数
            maxtimes:$('#resource-max').val(),
            //提前通知小时
            noticetime:$('#resource-notice').val(),
            //响应次序
            resSort:$('#resource-order').val(),
            //资源类型
            resType:$('#resource-type-modal').val(),
            //设备是否具有信息交互接口
            iscomm:iscomm,
            //备注
            memo:$('#create-remark').val(),
            //户号
            acctId:_thisHH,
            //设备
            rbms:[]

        };

        if(flag){



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

    //获取户号
    function huNumData(){

        $('#theLoading').modal('show');

        var  prm = {

            //关键字
            keyword:$('#keyWord-modal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRAccount/GetDRAcctDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }else if(result.code == 0){

                    _jumpNow($('#huNum-table'),result.accts);

                }

            },

            error:_errorFun

        })

    }

    //绑定数据
    function bind(id){

        var prm = {

            resId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetDRResourceById',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //绑定数据

                    //资源名称
                    $('#resource-name-modal').val(result.resource.name);
                    //额定功率
                    $('#resource-rated').val(result.resource.ratedpower);
                    //消减功率
                    $('#resource-subtracting').val(result.resource.reducepower);
                    //最大响应次数
                    $('#resource-max').val(result.resource.maxtimes);
                    //提前通知小时
                    $('#resource-notice').val(result.resource.noticehour);
                    //响应次序
                    $('#resource-order').val(result.resource.respondSort);
                    //资源类型
                    $('#resource-type-modal').val(result.resource.resourceType);
                    //设备是否具有信息交互接口
                    if(result.resource.iscomm == 'True'){

                        $('#isNo').parent('span').addClass('checked');

                    }else{

                        $('#isNo').parent('span').removeClass('checked');

                    }
                    //户号
                    $('#resource-HH').val(result.resource.acctNt);
                    //户号
                    _thisHH = result.resource.acctId;
                    //描述
                    $('#create-remark').val(result.resource.memo);


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

    //样式
    function changeCss(el){

        $('.table tbody').find('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

    }

    return {
        init: function(){

            //条件查询
            conditionSelect();

        }
    }

}()