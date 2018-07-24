var Resource = function () {

    //记录当前选中的userId
    var _thisID = '';

    //记录当前选中的户号
    var _thisHH = '';

    //记录当前单元格
    var _currentCell = '';

    //选择的设备
    var _selectedDevArr = [];

    //当前是直接绑定还是创建
    var _isBind = false;

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[

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
        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='data-option option-edit btn default btn-xs green-stripe' data-userId='" + full.id + "'>编辑</span>" +

                        //"<span class='data-option option-shanchu btn default btn-xs green-stripe' data-userId='" + full.id + "'>删除</span>" +

                    "<span class='data-option option-dev btn default btn-xs green-stripe' data-userId='" + full.id + "'>绑定设备</span>"

            }
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
            data:'eprName'
        },
        {
            title:'所属区域',
            data:'districtName'
        }

    ];

    _tableInit($('#huNum-table'),huCol,2,true,'','','','');

    //设备
    var devCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker" data-id="' + full.f_ServiceId + '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'楼宇',
            data:'f_BuildingId'
        },
        {
            title:'设备类型',
            data:'f_ServiceType'
        },
        {
            title:'设备',
            data:'f_ServiceName'
        }

    ];

    _tableInit($('#dev-table'),devCol,2,true,'','','','','',true);

    //添加设备（表格编辑）
    var editCol = [

        {
            title:'功率设备',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-dev-GL table-group-action-input form-control" placeholder="点击选择" style="cursor: pointer">点击选择</div>'

            }


        },
        {
            title:'电量设备',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-dev-DL table-group-action-input form-control" placeholder="点击选择" style="cursor: pointer">点击选择</div>'

            }


        },
        {
            title:'控制设备',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-dev-KZ table-group-action-input form-control" placeholder="点击选择" style="cursor: pointer">点击选择</div>'

            }


        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='data-option option-del btn default btn-xs green-stripe'>删除</span>"

            }
        }

    ];

    _tableInit($('#dev-manage'),editCol,2,true,'','','','','',true);


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

                numberFormat1:true

            },

            //消减功率
            'resource-subtracting':{

                required: true,

                numberFormat1:true

            },

            //最大响应次数
            'resource-max':{

                required: true,

                numberFormat1:true

            },

            //提前通知小时
            'resource-notice':{

                required: true,

                numberFormat1:true

            },

            //响应次序
            'resource-order':{

                required: true,

                numberFormat1:true

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

    //正则表达式（大于0的数字）
    $.validator.addMethod("numberFormat1",function(value,element,params){

        var doubles= /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入大于0的数字");

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

            sendOption('','编辑成功！',true);

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

    //【绑定设备】
    $('#table tbody').on('click','.option-dev',function(){

        //样式
        changeCss($(this));

        //loadding
        $('#theLoading').modal('show');

        //初始化
        _datasTable($('#dev-manage'),[]);

        _thisID = $(this).attr('data-userid');

        _isBind = true;

        //根据id获取设备列表
        devDataById(_thisID);

        //模态框
        _moTaiKuang($('#bind-table-Modal'),'绑定设备','','','','确定');

        $('#theLoading').modal('hide');
    })

    //【点击设备选择按钮选择】
    $('.select-dev-button').click(function(){

        //首先判断是选择哪些设备的列表
        var buttonGL = $(this).attr('class').indexOf('select-dev-GL');

        var buttonDL = $(this).attr('class').indexOf('select-dev-DL');

        var buttonKZ = $(this).attr('class').indexOf('select-dev-KZ');

        var str = '';

        if(buttonGL > -1){

            str = '功率设备列表';

            //功率设备
            devData();

            //改变类名
            $('#dev-Modal').find('.btn-primary').addClass('dev-GL-B').removeClass('dev-DL-B').removeClass('dev-KZ-B');

            //读取已选中的功率设备



        }else if(buttonDL > -1){

            str = '电量设备列表';

            //电量设备
            devData();

            //改变类名
            $('#dev-Modal').find('.btn-primary').addClass('dev-DL-B').removeClass('dev-GL-B').removeClass('dev-KZ-B');



        }else if(buttonKZ > -1){

            str = '控制设备列表';

            //控制设备
            devData();

            //改变类名
            $('#dev-Modal').find('.btn-primary').addClass('dev-KZ-B').removeClass('dev-DL-B').removeClass('dev-GL-B');



        }

        //模态框
        _moTaiKuang($('#dev-Modal'),str,'','','','选择');

    })

    //选择设备【tr】
    $('#dev-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#dev-table tbody').find('tr').removeClass('tables-hover');

            $('#dev-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#dev-table tbody').find('tr').removeClass('tables-hover');

            $('#dev-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //【选择设备】
    $('#create-Modal').on('click','.select-SB',function(){

        //初始化
        $('#bin-dev-Modal').find('input').val('');

        //模态框
        _moTaiKuang($('#bind-table-Modal'),'设备','','','','确定');

    })

    //添加一行设备
    $('#bind-table-Modal').on('click','.add-row-dev',function(){

        var T = $('#dev-manage').DataTable();

        T.row.add(['','','','']).draw();

    })

    //选择功率设备
    $('#dev-manage tbody').on('click','.select-dev-GL',function(){

        //初始化
        _datasTable($('#dev-table'),[]);

        //表格
        _moTaiKuang($('#dev-Modal'),'设备','','','','选择');

        //数据
        devData();

        //类
        $('#dev-Modal').find('.btn-primary').removeClass('dev-DL-B').removeClass('dev-KZ-B').addClass('dev-GL-B');

        _currentCell = $(this);

    })

    //选择电量设备
    $('#dev-manage tbody').on('click','.select-dev-DL',function(){

        //初始化
        _datasTable($('#dev-table'),[]);

        //表格
        _moTaiKuang($('#dev-Modal'),'设备','','','','选择');

        //数据
        devData();

        //类
        $('#dev-Modal').find('.btn-primary').removeClass('dev-GL-B').removeClass('dev-KZ-B').addClass('dev-DL-B');

        _currentCell = $(this);

    })

    //选择控制设备
    $('#dev-manage tbody').on('click','.select-dev-KZ',function(){

        //初始化
        _datasTable($('#dev-table'),[]);

        //表格
        _moTaiKuang($('#dev-Modal'),'设备','','','','选择');

        //数据
        devData();

        //类
        $('#dev-Modal').find('.btn-primary').removeClass('dev-GL-B').removeClass('dev-DL-B').addClass('dev-KZ-B');

        _currentCell = $(this);

    })

    //选择设备按钮
    $('#dev-Modal').on('click','.btn-primary',function(){

        var currentTr = $('#dev-table tbody').children('.tables-hover');

        //id
        var num = currentTr.find('.checker').attr('data-id');

        var pid = currentTr.children().eq(1).html();

        var name = currentTr.children().eq(3).html();

        _currentCell.attr('data-num',num);

        _currentCell.attr('data-pid',pid);

        _currentCell.html(name);

        $('#dev-Modal').modal('hide');

    })

    //删除
    $('#dev-manage').on('click','.option-del',function(){

        var T = $('#dev-manage').DataTable();

        T.row($(this).parents('tr')).remove().draw( false );

    })

    //获取绑定的n组数据
    $('#bind-table-Modal').on('click','.btn-primary',function(){

        var tr = $('#dev-manage tbody').children('tr');

        _selectedDevArr.length = 0;

        for(var i=0;i<tr.length;i++ ){

            var currentTr = $(tr).eq(i);

            var obj = {};
            //用户资源Id
            obj.resourceId = _thisID;
            //楼宇Id ,
            obj.pointerId = currentTr.find('.select-dev-GL').attr('data-pid')==undefined?'':currentTr.find('.select-dev-GL').attr('data-pid');
            //功率Id
            obj.powerId = currentTr.find('.select-dev-GL').attr('data-num')==undefined?'':currentTr.find('.select-dev-GL').attr('data-num');
            //电量Id
            obj.electricityId = currentTr.find('.select-dev-DL').attr('data-num')==undefined?'':currentTr.find('.select-dev-DL').attr('data-num');
            //输出控制设备Id
            obj.contrlId = currentTr.find('.select-dev-KZ').attr('data-num')==undefined?'':currentTr.find('.select-dev-KZ').attr('data-num');

            _selectedDevArr.push(obj);

        }

        $('#bind-table-Modal').modal('hide');


        //直接绑定数据
        if(_isBind){

            $('#theLoading').modal('show');

            var prm = {

                //用户资源Id
                resourceId:_thisID,
                //用户资源对应设备表
                rbms:_selectedDevArr

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DRResource/CreateDRResourceBindMetersInfo',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if($('.modal-backdrop').length > 0){

                        $('div').remove('.modal-backdrop');

                        $('#theLoading').hide();
                    }

                    if(result.code == -2){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                    }else if(result.code == 0){

                        conditionSelect();

                    }


                },

                error:_errorFun

            })

        }


    })

    $('#bind-table-Modal').on('hidden.bs.modal',function(){

        _isBind = false;

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

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

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

        //清空设备数组
        _selectedDevArr = [];

        //input框
        $('#isNo').parent('span').removeClass('checked');

    }

    //创建账户(flag代表是否传id)
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
            rbms:_selectedDevArr

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

                if(result.code == 0){

                    //创建成功
                    _moTaiKuang($('#tip-Modal'),'提示',true,true,seccessMeg,'');

                    //模态框消失
                    $('#create-Modal').modal('hide');

                    $('#create-Modal').one('hidden.bs.modal',function(){

                        conditionSelect();

                    })

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

    //获取设备列表
    function devData(url){

        $('#theLoading').modal('show');

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetResourceBindMeterSelectDs',

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                _datasTable($('#dev-table'),result.serviceObjs);

                //格式化数据
                var ztreeArr = [];

                for(var i=0;i<result.serviceObjs.length;i++){

                    var obj = {};

                    obj.name = result.serviceObjs[i].f_ServiceName;

                    obj.id = result.serviceObjs[i].f_ServiceId;

                    obj.pId = result.serviceObjs[i].f_ParentId;

                    ztreeArr.push(obj);

                }

                setZtree($('#ztreeObj'),ztreeArr);

                var treeObj = $.fn.zTree.getZTreeObj("ztreeObj");

                var nodes = treeObj.getCheckedNodes(false);

                treeTableF($('#dev-table1'),nodes);

            },

            error:_errorFun

        })
    }

    //根据id获取设备列表
    function devDataById(id){

        $('#theLoading').modal('show');

        var prm = {

            resId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetDRResourceBindMetersByResourceId',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                //_datasTable($('#dev-table'),result.serviceObjs);

                console.log(result);

                if(result.code == 0){



                }




            },

            error:_errorFun

        })


    }

    //设备树
    //ztree树
    function setZtree(treeId,treeData){

        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType:'all',
                nocheckInherit: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{
                showIcon:false,
            },
            callback: {

                onClick: function(e,treeId,treeNode){

                    //取消全部打钩的节点
                    pointerObj.checkNode(treeNode,!treeNode.checked,true);

                },
                beforeClick:function(){

                    $('#ztreeStation').find('.curSelectedNode').removeClass('curSelectedNode');

                },

                onCheck:function(e,treeId,treeNode){

                    $('#ztreeStation').find('.curSelectedNode').removeClass('curSelectedNode');

                    $('#ztreeStation').find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                    //取消全部打钩的节点
                    pointerObj.checkNode(treeNode,true,true);


                }

            }
        };

        pointerObj = $.fn.zTree.init(treeId, setting, treeData);


    }

    //treeTable表格
    function treeTableF(treeId,treeData){

        var str = '';

        //插入
        for(var i=0;i<treeData.length;i++){

            str += '<tr data-tt-id="' + treeData[i].id + '" data-tt-parent-id="' + treeData[i].pId + '">' + '<td class="checkedInput"></td>' + '<td>' + treeData[i].name + '</td>' + '</tr>'

        }

        treeId.children('tbody').append(str);

        treeId.treetable({ expandable: true });

    }

    //排序
    function compare(propertyName) {

        return function(object1, object2) {

            var value1 = object1[propertyName];

            var value2 = object2[propertyName];

            if (value2 < value1) {

                return 1;

            } else if (value2 > value1) {

                return -1;

            } else {

                return 0;

            }
        }
    }

    return {
        init: function(){

            //条件查询
            conditionSelect();

        }
    }

}()